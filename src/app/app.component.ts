import { Component, ViewChild } from    '@angular/core'                    ;
import { Nav, Platform        } from    'ionic-angular'                    ;
import { StatusBar            } from    'ionic-native'                     ;
import { OnSiteXUser          } from '../pages/onsite-user/onsite-user'    ;
import { AcctSettings         } from '../pages/acct-settings/acct-settings';
import { CalView              } from '../pages/cal-view/cal-view'          ;
import { Messages             } from '../pages/messages/messages'          ;
import { MgmtHome             } from '../pages/mgmt-home/mgmt-home'        ;
import { OnsiteLogin          } from '../pages/onsite-login/onsite-login'  ;
import { Statistics           } from '../pages/statistics/statistics'      ;
import { TechHome             } from '../pages/tech-home/tech-home'        ;
import { TechReport           } from '../pages/tech-report/tech-report'    ;
import { ToprReport           } from '../pages/topr-report/topr-report'    ;


@Component({
  templateUrl: 'app.html'
})
export class OnSiteX {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = OnSiteXUser;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform) {
    this.initializeApp();

  // used for an example of ngFor and navigation
    this.pages = [
      { title: 'User Setup',       component: OnSiteXUser  },
      { title: 'Login ',           component: OnsiteLogin  },
      { title: 'Settings',         component: AcctSettings },
      { title: 'Reports ',         component: CalView      },
      { title: 'Messages',         component: Messages     },
      { title: 'Managers Home ',   component: MgmtHome     },
      { title: 'Statistics',       component: Statistics   },
      { title: 'Technicians Home', component: TechHome     },
      { title: 'Tech Report ',     component: TechReport   },
      { title: 'Topper Report ',   component: ToprReport   }

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
