import { Subscription                                           } from 'rxjs/Subscription'         ;
import { Component, OnInit, OnDestroy, ViewChild, Input, Output } from '@angular/core'             ;
import { NgZone, ApplicationRef, ChangeDetectorRef,             } from '@angular/core'             ;
import { ViewContainerRef, ElementRef,                          } from '@angular/core'             ;
import { App, Platform, Nav                                     } from 'ionic-angular'             ;
import { TranslateService                                       } from '@ngx-translate/core'       ;
import { UserData                                               } from 'providers/user-data'       ;
import { AlertService                                           } from 'providers/alerts'          ;
import { MessageService                                         } from 'providers/message-service' ;
import { TabsService                                            } from 'providers/tabs-service'    ;
import { Log, moment, Moment                                    } from 'config/config.functions'   ;
import { Tab                                                    } from 'config/config.types'       ;

export enum Pages {
  'OnSiteHome'      = 0,
  'ReportHistory'   = 1,
  'Report History'  = 1,
  'Report'          = 2,
  'ReportView'      = 2,
  'Report View'     = 2,
  'Flagged Reports' = 2,
  'Reports Flagged' = 2,
  'ReportsFlagged'  = 2,
  'FlaggedReports'  = 2,
  'User'            = 3,
  'Message List'    = 4,
  'MessageList'     = 4,
  'Settings'        = 5,
  'DevPage'         = 6,
  'Message'         = 7,
  'Comment'         = 8,
  'Fancy Select'    = 9,
  'Testing'         = 10,
}

@Component({
  selector: 'onsite-tabs',
  templateUrl: 'tabs.html'
})
export class TabsComponent implements OnInit,OnDestroy {
  @Input('hideArray') hideArray:Array<boolean> = [];
  @ViewChild('tabsContainer', {read: ViewContainerRef}) tabsContainer:ElementRef;
  public lang:any;
  public get Pages():any { return Pages;};
  public pageSub:Subscription;
  public static nav:any;
  public nav:any = TabsComponent.nav;
  public change:any;
  public ready:boolean = false;
  public get tabInfo():Array<Tab> { return this.tabServ.tabInfo; };
  public tabArray:Array<any> = [];
  public onSitePage     : any     ;
  public userLoggedIn   : boolean ;
  public userIsDeveloper: boolean =false ;
  public enumPages      : any     ;
  public enumPagesDef   : any     ;

  public hider = [ true, true, true, true, true, true, ];
  // public hider = TabsComponent.hider;
  public tabsClasses:any = {};
  public tabsReady:boolean = false;
  // public get hider():Array<boolean> { return TabsComponent.hider; };
  // public set hider(value:Array<boolean>) { TabsComponent.hider = value; };

  constructor(
    public app       : App               ,
    public platform  : Platform          ,
    public zone      : NgZone            ,
    public translate : TranslateService  ,
    public ud        : UserData          ,
    public alert     : AlertService      ,
    public msg       : MessageService    ,
    public tabServ   : TabsService       ,
    public appRef    : ApplicationRef    ,
  ) {
    Log.l("TabsComponent constructor called");
    window['onsitetabsarray'] = window['onsitetabsarray'] || [];
    window['onsitetabsarray'].push(this);
    // window['onsitetabs'] = this;
    window['onsitetabsstatic'] = TabsComponent;
    this.enumPages = Pages.OnSiteHome;
    this.enumPagesDef = Pages;
  }

  ngOnInit() {
    Log.l("TabsComponent: ngOnInit() fired")
    this.platform.ready().then(res => {
      this.change = ChangeDetectorRef;
      this.getActiveNav();
      // this.tabServ.setTabArray(this.tabInfo);
      // this.tabServ.setupTabs();
      this.initializeSubscriptions();
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
      this.tabsReady = true;
      if(UserData.isAppLoaded()) {
        // if (this.onSitePage === 'Login') { this.setTabDisable(true); }
        if (this.onSitePage === 'Login') {
          this.tabServ.disableTabs();
        }

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

  ngOnDestroy() {
    Log.l("TabsComponent: ngOnDestroy() fired");
    if(this.pageSub && !this.pageSub.closed) {
      this.pageSub.unsubscribe();
    }
  }

  public initializeSubscriptions() {
    this.pageSub = this.tabServ.pageChanged().subscribe((data:{page:string, params?:any}) => {
      let page = data.page;
      let params:any = data.params;
      if(params) {
        Log.l(`pageChanged(): Changing to page '${page}' with params:\n`, data.params);
        this.goToPage(page, params);
      } else {
        Log.l(`pageChanged(): Changing to page '${page}' without params.`);
        this.goToPage(page);
      }
    });
  }

  // public getHider(idx:number) {
  //   // return this.hider[idx];
  //   let out = this.tabServ.hidden[idx];
  //   return out;
  // }

  // public static wait(val:number) {
  //   let out = !TabsComponent.tabInfo[val].waiting;
  //   // Log.l("wait(%d): value is ", val, out);
  //   return out;
  // }

  // public static showWait(val:number) {
  //   TabsComponent.tabInfo[val].waiting = false;
  // }

  // public static hideWait(val:number) {
  //   TabsComponent.tabInfo[val].waiting = true;
  // }

  // public static toggleWait(val:number) {
  //   TabsComponent.tabInfo[val].waiting = !TabsComponent.tabArray[val].waiting;

  //   return TabsComponent.tabInfo[val].waiting;
  // }

  // public hide(val:number) {
  //   return TabsComponent.wait(val);
  // }

  // public wait(val:number) {
  //   return TabsComponent.wait(val);
  // }

  // public showWait(val:number) {
  //   this.zone.run(() => {
  //     return TabsComponent.showWait(val);
  //   });
  // }

  // public hideWait(val:number) {
  //   this.zone.run(() => {
  //     return TabsComponent.hideWait(val);
  //   });
  // }

  // public toggleWait(val:number) {
  //   // TabsComponent.tabArray[val].waiting = !TabsComponent.tabArray[val].waiting;
  //   // return TabsComponent.tabArray[val].waiting;
  //   this.zone.run(() => {
  //     // return TabsComponent.toggleWait(val);
  //     this.hider[val] = !this.hider[val];
  //     return this.hider[val];
  //   });
  // }

  // public hideroo(value:number) {
  //   let toHide = this.hider[value];
  //   let style = {'hideSpinner': toHide};
  //   return style;
  // }

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

  public getActiveNav() {
    TabsComponent.nav = this.app.getActiveNavs()[0];
    this.nav = TabsComponent.nav;
  }

  public goToPage(page:string|number, params?:any) {
    let tabs = this.tabInfo;
    let pagename = "OnSiteHome";
    let idx = -1;
    if(typeof page === 'number') {
      pagename = tabs[page].name;
      idx = page;
    } else {
      pagename = page;
      idx = this.tabInfo.findIndex((a:any) => {
        return a.name === page;
      });
    }
    // Log.l(`Tabs: entering page '${pagename}'. First highlighting tab.`);

    // this.highlightPageTab(pagename);
    // Log.l(`Tabs: found page ${pagename} at index ${Pages[pagename]}, getting NavController...`);
    if(idx > -1) {
      this.tabServ.setActive(idx);
    }
    this.getActiveNav();
    if(params) {
      // Log.l(`Tabs: found params, so now calling setRoot(${pagename}, ${params})...`);
      this.nav.setRoot(pagename, params);
    } else {
      // Log.l(`Tabs: no params, so now calling setRoot(${pagename})...`);
      // setTimeout(() => {
      //   this.tabServ.hidden[idx] = true;
      // }, 1500);
      this.nav.setRoot(pagename);
    }
  }

  public highlightPageTab(page:string|number) {
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

  public goHome() {
    // Log.l('entering page: OnSite Home' );
    this.goToPage('OnSiteHome');
  }

  public goReport(params?:any) {
    // Log.l('entering page: Report' );
    this.goToPage('Report');
  }

  public goHistory() {
    // Log.l('entering page: ReportHistory' );
    this.goToPage('ReportHistory');
  }

  public goUser() {
    // Log.l('entering page: User' );
    this.goToPage('User');
  }

  public goSettings() {
    // Log.l('entering page: Settings' );
    this.goToPage('Settings');
  }

  public goMsgs() {
    // Log.l('entering page: Messages' );
    this.goToPage('Messages');
  }

  public goDev() {
    // Log.l('entering page: DevPage' );
    this.goToPage('DevPage');
  }

  // public highlightStatus(i: number) {
  //   let ngClass = {'hlght': this.tabClass[i]};
  //   return ngClass;
  // }

  // public highlightTab(tabIndx: number) {
  //   /* For SHAME! An array .length call in the second clause of a for loop! If we add hundreds of tabs, there will be hell to pay, performance-wise! */
  //   for( let i = 0; i < this.tabClass.length; i++ ) {
  //     if( i === tabIndx ) { this.tabClass[i] = true; }
  //     else { this.tabClass[i] = false; }
  //   }
  // }

  public isDeveloper() {
    return this.ud.isDeveloper();
  }

  public handleSwipe(event?:any) {
    Log.l("handleSwipe(): Event is:\n", event);
    this.tabServ.handleSwipe(event);
  }

  // public setMessageBadge(count:number) {
  //   this.tabInfo[Pages['Message List']].badgeCount = count;
  //   if(count <= 0) {
  //     this.tabInfo[Pages['Message List']].hideBadge = true;
  //     count = 0;
  //   } else {
  //     this.tabInfo[Pages['Message List']].hideBadge = false;
  //   }
  // }

  // public getMessageBadge() {
  //   return this.tabInfo[Pages['Message List']].badgeCount;
  // }

  // public decrementMessageBadge() {
  //   this.tabInfo[Pages['Message List']].badgeCount--;
  //   let count = this.tabInfo[Pages['Message List']].badgeCount;
  //   if (count <= 0) {
  //     count = 0;
  //     this.tabInfo[Pages['Message List']].hideBadge = true;
  //   } else {
  //     this.tabInfo[Pages['Message List']].hideBadge = false;
  //   }
  // }

  // public incrementMessageBadge() {
  //   this.tabInfo[Pages['Message List']].badgeCount++
  //   let count = this.tabInfo[Pages['Message List']].badgeCount;
  //   if (count <= 0) {
  //     this.tabInfo[Pages['Message List']].hideBadge = true;
  //   } else {
  //     this.tabInfo[Pages['Message List']].hideBadge = false;
  //   }
  // }

  // public showWaiting(tab:number) {
  //   this.tabArray[tab].waiting = true;
  // }
  // public hideWaiting(tab:number) {
  //   this.tabArray[tab].waiting = false;
  // }
  // public toggleWaiting(tab:number) {
  //   this.tabArray[tab].waiting = !this.tabArray[tab].waiting;
  // }

  public terminateApp() {
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

  public aboutPage(event:any, name:string) {
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

  public getIcon(idx:number) {
    return this.tabServ.getIcon(idx);
  }

  // public getIcon(idx:number) {
  //   let tab = this.tabInfo[idx];
  //   let name = tab.icon;
  //   let className =  `ion-${name}`;
  //   let style:any = {};
  //   style[className] = true;
  //   return style;
  // }

}
