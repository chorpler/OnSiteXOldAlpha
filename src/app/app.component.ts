import { StatusBar, Splashscreen } from   'ionic-native'                                    ;
import { Component, ViewChild    } from   '@angular/core'                                   ;
import { Nav, Platform           } from   'ionic-angular'                                   ;
import { AcctSetupPage           } from '../pages/acct-setup-page/acct.setup.page'          ;
import { AcctLoginPage           } from '../pages/acct-login-page/acct.login.page'          ;
import { UserMgmtHomePage        } from '../pages/user-mgmt-home-page/user.mgmt.home.page'  ;
import { UserMechHomePage        } from '../pages/user-mech-home-page/user.mech.home.page'  ;
import { UserTechStatsPage       } from '../pages/user-tech-stats-page/user.tech.stats.page';
import { TechMechReport          } from '../pages/tech-mech-report/tech.mech.report'        ;
import { TechToprReport          } from '../pages/tech-topr-report/tech.topr.report'        ;
import { AcctSettingsPage        } from '../pages/acct-settings-page/acct.settings.page'    ;
import { LandingPage             } from '../pages/landing-page/landing.page'                ;



@Component({
  templateUrl: 'app.html'
})

export class OnSiteX {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LandingPage;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform) {
    this.initializeApp();
    this.platform = platform;

  // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Account Setup'   , component: AcctSetupPage     },
      { title: 'OnSiteX Login'   , component: AcctLoginPage     },
      { title: 'MGMT Home'       , component: UserMgmtHomePage  },
      { title: 'Technicians Home', component: UserMechHomePage  },
      { title: 'Tech Stats'      , component: UserTechStatsPage },
      { title: 'Tech Report'     , component: TechMechReport    },
      { title: 'Topper Report'   , component: TechToprReport    },
      { title: 'Account Settings', component: AcctSettingsPage  },
      { title: 'Welcome Screen'  , component: LandingPage       }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
  // Reset the content nav to have just this page
  // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

