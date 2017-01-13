import { Component    , OnInit                   } from '@angular/core'                 ; 
import { NavController, NavParams                } from 'ionic-angular'                 ; 
import { FormBuilder  , FormGroup                } from '@angular/forms'                ; 
import { Validators   , FormControl              } from '@angular/forms'                ; 
import { Observable                              } from "rxjs/Rx"                       ;
import { AuthTestUser                            } from '../../providers/auth-test-user'; 
import { OSXU                                    } from '../../config/user.config.user' ; 
import { DBSrvcs                                 } from '../../providers/db-srvcs'      ; 

@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
  styles: [ ".ng-invalid { background: rgba(255 150, 80, 0.5) }" ]
})

export class ReportsPage{

  // company = this.stngs.company;  
  // loc1 = this.stngs.loc1;  
  // loc2 = this.stngs.loc2; 
  // techClass = this.stngs.techClass ;  
  // technician = this.stngs.technician; 
  // hrsClass = this.stngs.hrsClass;

  constructor( public navCtrl: NavController, public navParams: NavParams, ) { } // private _fb: FormBuilder, private _fc: FormControl, 
      // public stngs: SettingsPage
      //   ngOnInit() {
      //       this.getTestUser();
      //     }

  workReport: FormGroup;

   e   = this.workReport.value.end;
   s   = this.workReport.value.start;
  en   : number;
  st   : number;
  valid: Boolean;

// -------------------------------------------------
  //    this.workReport = this._fb.group({
  //      username  : [ ''   , Validators.required ] ,
  //      today     : [ moment().format()          ] ,
  //      uNum      : [ ''   , Validators.required ] ,
  //      woNum     : [ ''                         ] ,
  //      start     : [ '0:0', Validators.required ] ,
  //      end       : [ '0:0', Validators.required ] ,
  //      reportHrs : [ '0:0', Validators.required ] , // this.rh
  //      woNotes   : [ ''   , Validators.required ]
  //     })
  //   rh(control: FormControl) { }
  // : Promise<any> {
  //   const promise = new Promise<any>(
  //     (resolve, reject) => {
  //       if()
  //     }
  //   )
  //   return promise;
  // }
  // ---------------------------------------------------
  esplit(e: any): number {
    this.e.split(':'); 
    if( e[1] <  8 ){ e[1] =  0; } else {
    if( e[1] < 23 ){ e[1] = 15; } else {
    if( e[1] < 38 ){ e[1] = 30; } else {
    if( e[1] < 53 ){ e[1] = 45; } else
                   { e[1] = 60; } } } }
    this.en = (( +e[0] ) * 60  + ( +e[1] ))/60 || 0;

    return this.en;
  }

  ssplit(s: any): number {
    this.s.split(':');
    if( s[1] <  8 ){ s[1] =  0; } else {
    if( s[1] < 23 ){ s[1] = 15; } else {
    if( s[1] < 38 ){ s[1] = 30; } else {
    if( s[1] < 53 ){ s[1] = 45; } else
                   { s[1] = 60; } } } }
    this.st = (( +s[0]) * 60  + ( +s[1] ))/60 || 0;
    return this.st;
  }
  
  onSubmit(formData: any) {
    console.log(formData);
  }

  procRprTime() {
    this.esplit(this.e);
    this.ssplit(this.s);
    this.runNxt(this.st, this.en);
    }

  runNxt(st, en) {
    this.valid = false;
    if(this.en < this.st) { this.en = this.en + 24; }

  }}