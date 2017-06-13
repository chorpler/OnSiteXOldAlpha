import { Component, OnInit, NgZone              } from '@angular/core';
import { Platform, IonicPage, NavParams, Events } from 'ionic-angular';
import { NavController, ToastController         } from 'ionic-angular';
import { ModalController                        } from 'ionic-angular';
import { Log } from '../../config/config.functions';
import { DBSrvcs } from '../../providers/db-srvcs' ;
import { AuthSrvcs } from '../../providers/auth-srvcs' ;
import { SrvrSrvcs } from '../../providers/srvr-srvcs';
import { UserData } from '../../providers/user-data';
import { WorkOrder } from '../../domain/workorder';
import { Shift } from '../../domain/shift';
import { Employee } from '../../domain/employee';
import moment from 'moment';

@IonicPage({name: 'OnSiteHome'})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loginData    : any           = null                                               ;
  username     : string        = "unknown"                                          ;
  userLoggedIn : boolean                                                            ;
  title        : string        = 'OnSite Home'                                      ;
  numChars     : Array<string> = ["①", "②", "③", "④", "⑤", "⑥", "⑦"]             ;
  shftOne      : string                                                             ;
  shftTwo      : string                                                             ;
  shftThree    : string                                                             ;
  shftFour     : string                                                             ;
  shftFive     : string                                                             ;
  shftSix      : string                                                             ;
  shftSeven    : string                                                             ;
  chkBxBool    : boolean                                                            ;
  chkBx        : string                                                             ;
  shftHrs: number;
  hrsSubmitted: number;
  dataReady:boolean = false;
  public techProfile:any;
  public techWorkOrders:Array<WorkOrder>;
  public shiftWorkOrders:Array<WorkOrder>;
  public static pageLoadedPreviously:boolean = false;
  public payrollWorkOrders:Array<WorkOrder>;
  public hoursTotalList:Array<any>;
  public shifts:Array<Shift> = [];
  public payrollPeriodHoursTotal:number = 0;
  public payrollPeriodHours:number = 0;
  public payrollPeriodBonusHours:number = 0;

  constructor( public navCtrl: NavController,
               public modalCtrl: ModalController,
               public authService: AuthSrvcs,
               public navParams: NavParams,
               public server: SrvrSrvcs,
               public ud: UserData,
               public db: DBSrvcs,
               public events: Events ) 
  {
    this.shftOne   = this.numChars[0];
    this.shftTwo   = this.numChars[1];
    this.shftThree = this.numChars[2];
    this.shftFour  = this.numChars[3];
    this.shftFive  = this.numChars[4];
    this.shftSix   = this.numChars[5];
    this.shftSeven = this.numChars[6];
    window["onsitehome"] = this;
  }

  ionViewDidEnter() {
    Log.l("HomePage: ionViewDidEnter() called. First wait ot make sure app is finished loading.");
    this.dataReady = false;
    // this.events.subscribe('pageload:finished', (loggedIn) => {
    //   Log.l("HomePage: pageload:finished event detected. Login status: ", loggedIn);
    //   this.events.unsubscribe('pageload:finished', () => {
    //     Log.l("HomePage: no longer receiving pageload:finished events.");
    //   });
      this.runEveryTime();
    // });
  }

  ionViewDidLoad() {
    Log.l("HomePage: ionViewDidLoad() called. FIRST, waiting for app to finish loading.");
    // this.events.subscribe('startup:finished', (loggedIn) => {
    //   Log.l("HomePage: startup:finished event detected. Login status: ", loggedIn);
    //   this.events.unsubscribe('startup:finished', () => {
      //   Log.l("HomePage: no longer receiving startup:finished events.");
      // });
      this.runWhenReady();
    // });
  }

  runEveryTime() {
    if (this.ud.getLoginStatus() === false) {
      this.presentLoginModal();
    } else if (!this.ud.woArrayInitialized()) {
      Log.l("HomePage: ionViewDidEnter() says work order array not initialized, fetching work orders.");
      this.fetchTechWorkorders().then((res) => {
        Log.l("HomePage: ionViewDidEnter() fetched work orders, maybe:\n", res);
        this.ud.setWorkOrderList(res);
        this.ud.createShifts();
        this.dataReady = true;
     });
    }
    // this.chkHrs();
  }

  runWhenReady() {
    Log.l("HomePage: app finished loading. Now, checking user login status.");
    if (this.ud.getLoginStatus()) {
      Log.l("HomePage: user logged in, fetching work orders.");
      this.fetchTechWorkorders().then((res) => {
        Log.l("HomePage: fetched work orders, maybe:\n", res);
        this.ud.createShifts();
        this.shifts = this.ud.getPeriodShifts();
        HomePage.pageLoadedPreviously = true;
        this.events.publish('pageload:finished', this.ud.getLoginStatus());
      });
    } else {
      Log.l("HomePage: user not authorized in ionViewDidLoad(). Guess ionViewDidEnter() can present a login modal.");
    }
  }

  fetchTechWorkorders():Promise<Array<any>> {
    let techid = this.ud.getCredentials().user;
    return new Promise((resolve,reject) => {
      this.server.getReportsForTech(techid).then((res) => {
        Log.l(`HomePage: getReportsForTech(${techid}): Success! Result:\n`, res);
        this.ud.setWorkOrderList(res);
        this.techWorkOrders = this.ud.getWorkOrderList();

        let now = moment();
        let payrollPeriod = this.ud.getPayrollPeriodForDate(now);
        this.payrollWorkOrders = this.ud.getWorkOrdersForPayrollPeriod(payrollPeriod);
        Log.l(`HomePage: filteredWorkOrders(${payrollPeriod}) returned:\n`, this.payrollWorkOrders);
        this.hoursTotalList = [];
        for(let shift of this.shifts) {
          let total = this.ud.getTotalHoursForShift(shift.getShiftSerial());
          this.hoursTotalList.push(total);
        }
        let thisPayPeriod = this.ud.getPayrollPeriodForDate(moment());
        this.payrollPeriodHours = this.ud.getTotalHoursForPayrollPeriod(thisPayPeriod);
        this.payrollPeriodBonusHours = this.ud.getTotalPayrollHoursForPayrollPeriod(thisPayPeriod);
        this.techProfile = this.ud.getTechProfile();
        // this.payrollPeriodHoursTotal = this.techProfile.shiftLength * 5;
        this.dataReady = true;
        resolve(res);
      }).catch((err) => {
        Log.l(`HomePage: getReportsForTech(${techid}): Error!`);
        Log.e(err);
        resolve(new Array<WorkOrder>());
      });
    });
  }

  isAuthorized() {
    Log.l("HomePage.isAuthorized(): Checking auth status...");
    let authorized = Boolean( this.loginData !== undefined
                              && this.loginData !== null
                              && typeof this.loginData.user === 'string'
                              && typeof this.loginData.pass === 'string'
                              && this.loginData.user !== ''
                              && this.loginData.pass !== '');
    Log.l("HomePage.isAuthorized(): Auth status is: ", authorized);
    return authorized;
  }

  isLoggedIn() {
    Log.l("HomePage.isLoggedIn(): Checking login status...");
    let loggedin = Boolean( this.isAuthorized() && this.userLoggedIn );
    Log.l("HomePage.isLoggedIn(): Login status: ", loggedin);
    return loggedin;
  }

  countHoursForPayrollPeriod() {
    let fwo = this.payrollWorkOrders;
    let len = fwo.length;
    let total = 0;
    for(let i = 0; i < len; i++) {
      let wo = fwo[i];
      total += wo.getRepairHours();
    }
  }

  presentLoginModal() {
    let loginPage = this.modalCtrl.create('Login', {user: '', pass: ''}, { cssClass: 'login-modal'});
    loginPage.onDidDismiss(data => {
      Log.l("Got back:\n", data);
      // this.loginData = data;
      // if( this.isLoggedIn() ) {
      this.userLoggedIn = this.ud.getLoginStatus();
      if( this.userLoggedIn ) {
        console.log("Login Modal succeeded, now opening user modal.");
        // this.userLoggedIn = true;
        this.presentUserModal(); }
      else { console.log("Login Modal did not succeed."); }
    })
    loginPage.present();
  }

  getShiftStatus(idx:number) {
    let hours = this.hoursTotalList[idx];
    let total = this.techProfile.shiftLength;
    return (hours === total);
  }

  getCheckbox(idx:number) {
    let checkBox = '?';
    let status = this.getShiftStatus(idx);
    if(status) {
      checkBox = '☑';
    } else {
      checkBox = '☒';
    }
    return checkBox;
  }

  getShiftColor(idx:number) {
    let status = this.getShiftStatus(idx);
    if(status) {
      return 'green';
    } else {
      return 'red';
    }
  }

  chkHrs(i) {
    if(this.shftHrs === this.hrsSubmitted ) { this.chkBx = '☑'; this.chkBxBool = true; }
    else { this.chkBx = '☒'; this.chkBxBool = false; }
  }

  presentUserModal() {
    let TechSettings = this.modalCtrl.create('User', { mode: 'modal' });
    TechSettings.present();
  }

}
