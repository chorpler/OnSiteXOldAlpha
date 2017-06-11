import { Component, OnInit } from '@angular/core';
import { App, Platform     } from 'ionic-angular';

@Component({
  selector: 'onsite-tabs',
  templateUrl: 'tabs.html'
})
export class TabsComponent implements OnInit {

  nav:any;
  tabClass: Array<boolean> = [ false, false, false, false, false, ]
  tabDisabled: boolean = false;
  onSitePage: any;

  constructor( public app:App, public platform: Platform ) {
    this.nav = this.app.getActiveNav();
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

  highlightTab(tabIndx: number) {
    for( let i = 0; i < this.tabClass.length; i++ ) {
      if( i === tabIndx ) { this.tabClass[i] = true; }
      else { this.tabClass[i] = false; }
    }
  }

  terminateApp() { this.platform.exitApp(); }

  ngOnInit() {
    window['onSiteTabs'] = this;
    if( this.onSitePage === 'Login') { this.tabDisabled = true; }
  }
}
