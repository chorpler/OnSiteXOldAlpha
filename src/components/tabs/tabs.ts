import { Component, OnInit } from '@angular/core';
import { App, Platform     } from 'ionic-angular';
import { AuthSrvcs         } from '../../providers/auth-srvcs';
import { NgZone            } from '@angular/core';

@Component({
  selector: 'onsite-tabs',
  templateUrl: 'tabs.html'
})
export class TabsComponent implements OnInit {

  nav:any;
  tabClass: Array<boolean> = [ false, false, false, false, false, false]
  tabDisabled: boolean = false;
  onSitePage: any;
  userLoggedIn: boolean;
  userIsDeveloper:boolean;


  constructor( public app:App, public platform: Platform,
               public auth: AuthSrvcs, public zone: NgZone ) {
    this.nav = this.app.getActiveNav();
    window['onSiteTabs'] = this;
  }

  setTabDisable(val:boolean) {
    this.tabDisabled = val;
  }

  goHome() {
    console.log('entering page: OnSite Home' );
    this.nav = this.app.getActiveNav();
    this.highlightTab(0); this.nav.setRoot('OnSiteHome'   );
  }

  goReport() {
    console.log('entering page: WorkOrder' );
    this.nav = this.app.getActiveNav();
    this.highlightTab(1); this.nav.setRoot('WorkOrder'    );
  }

  goHistory() {
    console.log('entering page: ReportHistory' );
    this.nav = this.app.getActiveNav();
    this.highlightTab(2); this.nav.setRoot('ReportHistory');
  }

  goUser() {
    console.log('entering page: User' );
    this.nav = this.app.getActiveNav();
    this.highlightTab(3); this.nav.setRoot( 'User'        );
  }

  goSettings() {
    console.log('entering page: Settings' );
    this.nav = this.app.getActiveNav();
    this.highlightTab(4); this.nav.setRoot('Settings'     );
  }

  goDev() {
    console.log('entering page: DevPage' );
    this.nav = this.app.getActiveNav();
    this.highlightTab(5); this.nav.setRoot('DevPage'      );
  }

  highlightTab(tabIndx: number) {
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
    if( this.onSitePage === 'Login') { this.tabDisabled = true; }
  }
}
