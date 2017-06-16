import { Component, OnInit } from '@angular/core';
import { App, Platform     } from 'ionic-angular';
import { AuthSrvcs         } from '../../providers/auth-srvcs';
import { NgZone            } from '@angular/core';

@Component({
  selector: 'onsite-tabs',
  templateUrl: 'tabs.html'
})
export class TabsComponent implements OnInit {

  static nav:any;
  nav:any = TabsComponent.nav;
  static tabClass: Array<boolean> = [ false, false, false, false, false, false ];
  tabClass:Array<boolean> = TabsComponent.tabClass;
  static allTabs:any = {'disabled': false};
  allTabs:any = TabsComponent.allTabs;
  static tabInfo:any = [
    { name: 'OnSiteHome'    , fullName: 'OnSite Home'        , icon: 'home'     , active: false } ,
    { name: 'WorkOrder'     , fullName: 'Work Order'         , icon: 'document' , active: false } ,
    { name: 'ReportHistory' , fullName: 'Report History'     , icon: 'folder'   , active: false } ,
    { name: 'User'          , fullName: 'User'               , icon: 'contact'  , active: false } ,
    { name: 'Settings'      , fullName: 'Settings'           , icon: 'settings' , active: false } ,
    { name: 'DevPage'       , fullName: 'Developer Settings' , icon: 'options'  , active: false } ,
  ];
  tabInfo:any = TabsComponent.tabInfo;
  static tab:any = {
    'OnSiteHome': {}
  };
  onSitePage: any;
  userLoggedIn: boolean;
  userIsDeveloper:boolean;

  constructor( public app:App, public platform: Platform,
               public auth: AuthSrvcs, public zone: NgZone ) {
    TabsComponent.nav = this.app.getActiveNav();
    this.nav = TabsComponent.nav;
    this.getActiveNav();
    window['onSiteTabs'] = this;
  }

  getActiveNav() {
    TabsComponent.nav = this.app.getActiveNav();
    this.nav = TabsComponent.nav;
  }

  goToPage(pagename:string, params?:any) {
    console.log(`Tabs: entering page '${pagename}'`);
    // let i = this.tabNames.indexOf(pagename);
    let tabs = this.tabInfo;
    let len = this.tabInfo.length;
    let index = -1;
    let i = 0;
    for(let tab of tabs) {
      if(tab.name === pagename) {
        tab.active = true;
      } else {
        tab.active = false;
        i++;
      }
    }
    // for(let i = 0; i < len; i++) {
    //   if(tabs[i].name === pagename) {
    //     index = i;
    //     tab.active = true;
    //   }
    // }
    console.log(`Tabs: found page ${pagename} at index ${i}...`);
    // if (index !== -1) { this.highlightTab(index); }
    this.getActiveNav();
    if(params) {
      this.nav.setRoot(pagename, params);
    } else {
      this.nav.setRoot(pagename);
    }
  }

  setTabDisable(val:boolean) {
    // this.tabDisabled = val;
    TabsComponent.allTabs.disabled = val;
  }

  goHome() {
    console.log('entering page: OnSite Home' );
    this.getActiveNav();
    this.highlightTab(0); this.nav.setRoot('OnSiteHome'   );
  }

  goReport(params?:any) {
    console.log('entering page: WorkOrder' );
    this.getActiveNav();
    this.highlightTab(1); this.nav.setRoot('WorkOrder'    );
  }

  goHistory() {
    console.log('entering page: ReportHistory' );
    this.getActiveNav();
    this.highlightTab(2); this.nav.setRoot('ReportHistory');
  }

  goUser() {
    console.log('entering page: User' );
    this.getActiveNav();
    this.highlightTab(3); this.nav.setRoot( 'User'        );
  }

  goSettings() {
    console.log('entering page: Settings' );
    this.getActiveNav();
    this.highlightTab(4); this.nav.setRoot('Settings'     );
  }

  goDev() {
    console.log('entering page: DevPage' );
    this.getActiveNav();
    this.highlightTab(5); this.nav.setRoot('DevPage'      );
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
    if( this.auth.getUser() === 'Chorpler' || this.auth.getUser() === 'Hachero' || this.auth.getUser() === 'mike' ) {
      this.userIsDeveloper = true;
      return true;
    } else {
      this.userIsDeveloper = false;
      return false;
    }
  }

  terminateApp() { this.platform.exitApp(); }

  ngOnInit() {
    window['onSiteTabs'] = this;
    if( this.onSitePage === 'Login') { TabsComponent.allTabs.disabled = true; }
  }
}
