import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { Splashscreen } from 'ionic-native';
import { SettingsPage } from '../pages/settings/settings';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { StatsPage } from '../pages/stats/stats';
import { ReportsPage } from '../pages/reports/reports';
import { MsgsPage } from '../pages/msgs/msgs';
import { ShiftPage } from '../pages/shift/shift';
import { AppInfoPage } from '../pages/app-info/app-info';


@Component({
  templateUrl: 'app.html'
})
export class OnSiteX {
  @ViewChild(Nav) nav: Nav;

  title: string = 'OnSiteX';
  

  rootPage: any = LoginPage;
  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Settings', component: SettingsPage}, 
      { title: 'Login'   , component: LoginPage   }, 
      { title: 'Home'    , component: HomePage    }, 
      { title: 'Stats'   , component: StatsPage   }, 
      { title: 'Reports' , component: ReportsPage }, 
      { title: 'Messages', component: MsgsPage    }, 
      { title: 'Shift'   , component: ShiftPage   }, 
      { title: 'Info'    , component: AppInfoPage } 
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
