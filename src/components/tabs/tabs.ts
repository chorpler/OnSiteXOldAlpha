import { Component, OnInit   } from '@angular/core'                   ;
import { NgZone              } from '@angular/core'                   ;
import { App, Platform       } from 'ionic-angular'                   ;
import { TranslateService    } from '@ngx-translate/core'             ;
import { UserData            } from '../../providers/user-data'       ;
import { AlertService        } from '../../providers/alerts'          ;
import { MessageService      } from '../../providers/message-service' ;
import { Log, moment, Moment } from '../../config/config.functions'   ;

enum Pages {
  'OnSiteHome'    = 0,
  'Report'        = 1,
  'ReportHistory' = 2,
  'User'          = 3,
  'Message List'  = 4,
  'Settings'      = 5,
  'DevPage'       = 6,
}

@Component({
  selector: 'onsite-tabs',
  templateUrl: 'tabs.html'
})
export class TabsComponent implements OnInit {

  public lang:any;
  public static nav:any;
  public nav:any = TabsComponent.nav;
  // public static unreadMessageCount:number = 0;
  // public get unreadMessageCount():number { return TabsComponent.unreadMessageCount;};
  // public set unreadMessageCount(value:number) { TabsComponent.unreadMessageCount = value;};
  public static tabClass: Array<boolean> = [ false, false, false, false, false, false, false ];
  public tabClass:Array<boolean> = TabsComponent.tabClass;
  public static allTabs:any = {'disabled': false};
  public allTabs:any = TabsComponent.allTabs;
  public static ready:boolean = false;
  public static get tabInfo() { return UserData.isDeveloper() ? TabsComponent.tabArrayDev : TabsComponent.tabArray; };
  public static tabArray:any = [
    { name: 'OnSiteHome'    , fullName: 'OnSite Home'        , icon: 'ios-home-outline'     , active: false, badgeCount: 0, get hideBadge() {return this.badgeCount <= 0 || !(UserData && UserData.isAppLoaded()) ? true : false}, set hideBadge(val:boolean) {} } ,
    { name: 'Report'        , fullName: 'Report'             , icon: 'ios-document-outline' , active: false, badgeCount: 0, get hideBadge() {return this.badgeCount <= 0 || !(UserData && UserData.isAppLoaded()) ? true : false}, set hideBadge(val:boolean) {} } ,
    { name: 'ReportHistory' , fullName: 'Report History'     , icon: 'ios-folder-outline'   , active: false, badgeCount: 0, get hideBadge() {return this.badgeCount <= 0 || !(UserData && UserData.isAppLoaded()) ? true : false}, set hideBadge(val:boolean) {} } ,
    { name: 'User'          , fullName: 'User'               , icon: 'ios-contact-outline'  , active: false, badgeCount: 0, get hideBadge() {return this.badgeCount <= 0 || !(UserData && UserData.isAppLoaded()) ? true : false}, set hideBadge(val:boolean) {} } ,
    { name: 'Message List'  , fullName: 'Messages'           , icon: 'ios-text-outline'     , active: false, get badgeCount():number { return UserData.getUnreadMessageCount();}, set badgeCount(value:number) {}, get hideBadge() {return this.badgeCount <= 0 || !(UserData && UserData.isAppLoaded()) ? true : false}, set hideBadge(val:boolean) {} } ,
    { name: 'Settings'      , fullName: 'Settings'           , icon: 'ios-settings-outline' , active: false, badgeCount: 0, get hideBadge() {return this.badgeCount <= 0 || !(UserData && UserData.isAppLoaded()) ? true : false}, set hideBadge(val:boolean) {} } ,
  ];
  public static tabArrayDev:any = [
    ...TabsComponent.tabArray,
    { name: 'DevPage', fullName: 'Developer Settings', icon: 'options', active: false, badgeCount: 0, get hideBadge() { return this.badgeCount <= 0 ? true : false }, set hideBadge(val: boolean) { } }
  ];

  public get tabInfo():any {return TabsComponent.tabInfo};
  public get ready():boolean {return TabsComponent.ready;};
  public set ready(value:boolean) { TabsComponent.ready = value;};
  public static tab:any = {
    'OnSiteHome': {}
  };
  public get tabArray():any {return TabsComponent.tabArray;};
  public onSitePage     : any     ;
  public userLoggedIn   : boolean ;
  public userIsDeveloper: boolean =false ;
  public enumPages      : any     ;
  public enumPagesDef   : any     ;

  constructor( public app: App, public platform: Platform, public zone: NgZone, public translate: TranslateService, public ud:UserData, public alert:AlertService, public msg:MessageService) {
    this.getActiveNav();
    window['onsitetabs'] = this;
    window['onsitetabsstatic'] = TabsComponent;
    this.enumPages = Pages.OnSiteHome;
    this.enumPagesDef = Pages;
  }

  // public static getUnreadMessageCount():number {
  //   let ret = TabsComponent.unreadMessageCount ? TabsComponent.unreadMessageCount : 0;
  //   return ret;
  // }

  // public getUnreadMessageCount():number {
  //   if(this && this.msg && this.msg.getNewMessageCount) {
  //     let msgs = this.msg.getNewMessageCount();
  //     TabsComponent.unreadMessageCount = msgs ? msgs : 0;
  //     return TabsComponent.unreadMessageCount;
  //   } else {
  //     return 0;
  //   }
  // }

  ngOnInit() {
    window['onSiteTabs'] = this;
    this.platform.ready().then(res => {
      let translations = [
        'help_home',
        'help_reports',
        'help_report_history',
        'help_tech_settings',
        'help_messages',
        'help_settings',
      ];
      let eng = [
        'Home Page',
        'Add Work Report',
        'Work Report History',
        'User Profile',
        'Messages',
        'Settings',
      ];
      this.lang = new Object();
      let len = translations.length;
      for(let i = 0; i < len; i++) {
        let key = translations[i];
        this.lang[key] = eng[i];
      }
      this.translate.get(translations).subscribe((results:any) => {
        this.lang = results;
      });
      if(UserData.isAppLoaded()) {
        if (this.onSitePage === 'Login') { this.setTabDisable(true); }

        //  else {
          // if(this.isDeveloper()) {
          //   if(this.tabInfo[this.tabInfo.length - 1].name !== 'DevPage') {
          //     this.tabInfo.push(this.developerTab);
          //   }
          // } else if(this.tabInfo[this.tabInfo.length - 1].name === 'DevPage') {
          //   this.tabInfo.pop();
          // }
        // }
      }
    });
  }

  getActiveNav() {
    TabsComponent.nav = this.app.getActiveNavs()[0];
    this.nav = TabsComponent.nav;
  }

  goToPage(page:string|number, params?:any) {
    let tabs = this.tabInfo;
    let pagename = "OnSiteHome";
    if(typeof page === 'number') {
      pagename = tabs[page].name;
    } else {
      pagename = page;
    }
    // Log.l(`Tabs: entering page '${pagename}'. First highlighting tab.`);

    this.highlightPageTab(pagename);
    // Log.l(`Tabs: found page ${pagename} at index ${Pages[pagename]}, getting NavController...`);
    this.getActiveNav();
    if(params) {
      // Log.l(`Tabs: found params, so now calling setRoot(${pagename}, ${params})...`);
      this.nav.setRoot(pagename, params);
    } else {
      // Log.l(`Tabs: no params, so now calling setRoot(${pagename})...`);
      this.nav.setRoot(pagename);
    }
  }

  highlightPageTab(page:string|number) {
    let tabs = this.tabInfo;
    let pagename = "OnSiteHome";
    if(typeof page === 'number') {
      pagename = tabs[page].name;
    } else {
      pagename = page;
    }
    for(let tab of tabs) {
      tab.active = false;
    }
    let pageNum = Pages[pagename];
    if(pageNum !== undefined) {
      tabs[pageNum].active = true;
    }
  }

  setTabDisable(val:boolean) {
    TabsComponent.allTabs.disabled = val;
  }

  goHome() {
    // Log.l('entering page: OnSite Home' );
    this.goToPage('OnSiteHome');
  }

  goReport(params?:any) {
    // Log.l('entering page: Report' );
    this.goToPage('Report');
  }

  goHistory() {
    // Log.l('entering page: ReportHistory' );
    this.goToPage('ReportHistory');
  }

  goUser() {
    // Log.l('entering page: User' );
    this.goToPage('User');
  }

  goSettings() {
    // Log.l('entering page: Settings' );
    this.goToPage('Settings');
  }

  goMsgs() {
    // Log.l('entering page: Messages' );
    this.goToPage('Messages');
  }

  goDev() {
    // Log.l('entering page: DevPage' );
    this.goToPage('DevPage');
  }

  highlightStatus(i: number) {
    let ngClass = {'hlght': this.tabClass[i]};
    return ngClass;
  }

  highlightTab(tabIndx: number) {
    /* For SHAME! An array .length call in the second clause of a for loop! If we add hundreds of tabs, there will be hell to pay, performance-wise! */
    for( let i = 0; i < this.tabClass.length; i++ ) {
      if( i === tabIndx ) { this.tabClass[i] = true; }
      else { this.tabClass[i] = false; }
    }
  }

  isDeveloper() {
    return this.ud.isDeveloper();
  }

  setMessageBadge(count:number) {
    this.tabInfo[Pages['Message List']].badgeCount = count;
    if(count <= 0) {
      this.tabInfo[Pages['Message List']].hideBadge = true;
      count = 0;
    } else {
      this.tabInfo[Pages['Message List']].hideBadge = false;
    }
  }

  getMessageBadge() {
    return this.tabInfo[Pages['Message List']].badgeCount;
  }

  decrementMessageBadge() {
    this.tabInfo[Pages['Message List']].badgeCount--;
    let count = this.tabInfo[Pages['Message List']].badgeCount;
    if (count <= 0) {
      count = 0;
      this.tabInfo[Pages['Message List']].hideBadge = true;
    } else {
      this.tabInfo[Pages['Message List']].hideBadge = false;
    }
  }

  incrementMessageBadge() {
    this.tabInfo[Pages['Message List']].badgeCount++
    let count = this.tabInfo[Pages['Message List']].badgeCount;
    if (count <= 0) {
      this.tabInfo[Pages['Message List']].hideBadge = true;
    } else {
      this.tabInfo[Pages['Message List']].hideBadge = false;
    }
  }

  terminateApp() {
    let lang = this.translate.instant(['confirm_exit_title', 'confirm_exit_message']);
    this.alert.showConfirm(lang['confirm_exit_title'], lang['confirm_exit_message']).then(res => {
      if(res) {
       Log.l("terminateApp(): User confirmed, exiting app.");
       this.platform.exitApp();
      }
    }).catch(err => {
      Log.l("terminateApp(): Error attempting to exit app.");
    });
  }

  aboutPage(event:any, name:string) {
    // Log.l(`User wants info about tab '${name}'. Event:\n`, event);
    let lang = this.lang;
    let help = {
      "OnSiteHome"   : 'help_home',
      "Report"       : 'help_reports',
      "ReportHistory": 'help_report_history',
      "User"         : 'help_tech_settings',
      "Message List" : 'help_messages',
      "Settings"     : 'help_settings',
    };
    // let help = {
    //   "OnSiteHome"   : "Home Page",
    //   "Report"       : "Work Reports",
    //   "ReportHistory": "Work Report History",
    //   "User"         : "User Information",
    //   "Message List" : "Messages",
    //   "Settings"     : "Settings",
    // };

    // this.alert.showPopover(help[name], {}, event);
    // this.alert.showToast(lang[help[name]], 2000, 'middle');
  }
}
