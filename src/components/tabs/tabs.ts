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

  goHome() {
    console.log('entering page: OnSite Home' );
    this.highlightTab(0); this.nav.setRoot('OnSiteHome'   );
  }

  goReport() {
    console.log('entering page: WorkOrder' );
    this.highlightTab(1); this.nav.setRoot('WorkOrder'    );
  }

  goHistory() {
    console.log('entering page: ReportHistory' );
    this.highlightTab(2); this.nav.setRoot('ReportHistory');
  }

  goUser() {
    console.log('entering page: User' );
    this.highlightTab(3); this.nav.setRoot( 'User'        );
  }

  goSettings() {
    console.log('entering page: Settings' );
    this.highlightTab(4); this.nav.setRoot('Settings'     );
  }

  goDev() {
    console.log('entering page: DevPage' );
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
