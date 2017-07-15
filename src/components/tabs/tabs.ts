import    { Component, OnInit } from '@angular/core'                 ;
import    { App, Platform     } from 'ionic-angular'                 ;
// import { AuthSrvcs         } from '../../providers/auth-srvcs'    ;
import    { NgZone            } from '@angular/core'                 ;
import    { TranslateService  } from '@ngx-translate/core'           ;
import    { UserData          } from '../../providers/user-data'     ;
import    { AlertService      } from '../../providers/alerts'        ;
import    { Log               } from '../../config/config.functions' ;

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

  public static nav:any;
  public nav:any = TabsComponent.nav;
  public static tabClass: Array<boolean> = [ false, false, false, false, false, false, false ];
  public tabClass:Array<boolean> = TabsComponent.tabClass;
  public static allTabs:any = {'disabled': false};
  public allTabs:any = TabsComponent.allTabs;
  public static tabInfo:any = [
    { name: 'OnSiteHome'    , fullName: 'OnSite Home'        , icon: 'ios-home-outline'     , active: false, badgeCount: 0, get hideBadge() {return this.badgeCount <= 0 ? true : false}, set hideBadge(val:boolean) {} } ,
    { name: 'Report'        , fullName: 'Report'             , icon: 'ios-document-outline' , active: false, badgeCount: 0, get hideBadge() {return this.badgeCount <= 0 ? true : false}, set hideBadge(val:boolean) {} } ,
    { name: 'ReportHistory' , fullName: 'Report History'     , icon: 'ios-folder-outline'   , active: false, badgeCount: 0, get hideBadge() {return this.badgeCount <= 0 ? true : false}, set hideBadge(val:boolean) {} } ,
    { name: 'User'          , fullName: 'User'               , icon: 'ios-contact-outline'  , active: false, badgeCount: 0, get hideBadge() {return this.badgeCount <= 0 ? true : false}, set hideBadge(val:boolean) {} } ,
    { name: 'Message List'  , fullName: 'Messages'           , icon: 'ios-text-outline'     , active: false, badgeCount: 0, get hideBadge() {return this.badgeCount <= 0 ? true : false}, set hideBadge(val:boolean) {} } ,
    { name: 'Settings'      , fullName: 'Settings'           , icon: 'ios-settings-outline' , active: false, badgeCount: 0, get hideBadge() {return this.badgeCount <= 0 ? true : false}, set hideBadge(val:boolean) {} } ,
  ];
  public tabInfo:any = TabsComponent.tabInfo;
  public static developerTab: any = { name: 'DevPage', fullName: 'Developer Settings', icon: 'options', active: false, badgeCount: 0, get hideBadge() { return this.badgeCount <= 0 ? true : false }, set hideBadge(val: boolean) { } };
  public developerTab:any = TabsComponent.developerTab;
  public static tab:any = {
    'OnSiteHome': {}
  };
  public onSitePage     : any     ;
  public userLoggedIn   : boolean ;
  public userIsDeveloper: boolean =false ;
  public enumPages      : any     ;
  public enumPagesDef   : any     ;

  constructor( public app: App, public platform: Platform, public zone: NgZone, public translate: TranslateService, public ud:UserData, public alert:AlertService) {
    this.getActiveNav();
    window['onsitetabs'] = this;
    this.enumPages = Pages.OnSiteHome;
    this.enumPagesDef = Pages;
  }

  ngOnInit() {
    window['onSiteTabs'] = this;
    this.platform.ready().then(res => {
      if(this.ud.isAppLoaded()) {
        if (this.onSitePage === 'Login') { this.setTabDisable(true); } else {
          if(this.isDeveloper()) {
            if(this.tabInfo[this.tabInfo.length - 1].name !== 'DevPage') {
              this.tabInfo.push(this.developerTab);
            }
          } else if(this.tabInfo[this.tabInfo.length - 1].name === 'DevPage') {
            this.tabInfo.pop();
          }
        }
      }
    });
  }

  getActiveNav() {
    TabsComponent.nav = this.app.getActiveNav();
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
    Log.l(`Tabs: entering page '${pagename}'. First highlighting tab.`);

    this.highlightPageTab(pagename);
    Log.l(`Tabs: found page ${pagename} at index ${Pages[pagename]}, getting NavController...`);
    this.getActiveNav();
    if(params) {
      Log.l(`Tabs: found params, so now calling setRoot(${pagename}, ${params})...`);
      this.nav.setRoot(pagename, params);
    } else {
      Log.l(`Tabs: no params, so now calling setRoot(${pagename})...`);
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
    console.log('entering page: OnSite Home' );
    this.goToPage('OnSiteHome');
  }

  goReport(params?:any) {
    console.log('entering page: Report' );
    this.goToPage('Report');
  }

  goHistory() {
    console.log('entering page: ReportHistory' );
    this.goToPage('ReportHistory');
  }

  goUser() {
    console.log('entering page: User' );
    this.goToPage('User');
  }

  goSettings() {
    console.log('entering page: Settings' );
    this.goToPage('Settings');
  }

  goMsgs() {
    console.log('entering page: Messages' );
    this.goToPage('Messages');
  }

  goDev() {
    console.log('entering page: DevPage' );
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
    Log.l(`User wants info about tab '${name}'. Event:\n`, event);
    let help = {
      "OnSiteHome"   : "Home Page",
      "Report"       : "Work Reports",
      "ReportHistory": "Work Report History",
      "User"         : "User Information",
      "Message List" : "Messages",
      "Settings"     : "Settings",
    }
    this.alert.showPopover(help[name], {}, event);
  }
}
