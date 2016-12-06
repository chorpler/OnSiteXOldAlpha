import { Component                    } from '@angular/core'                        ;
import { NavController                } from 'ionic-angular'                        ;
import { NgModule                     } from '@angular/core'                        ;
import { BrowserModule                } from '@angular/platform-browser'            ;
import { FormsModule                  } from '@angular/forms'                       ;
import { UserFormComponent            } from '../../components/user-form.component' ;


@Component({
  selector: 'page-acct-setup-page',
  templateUrl: 'acct.setup.page.html'
})
export class AcctSetupPage {

  constructor(public navCtrl: NavController, public usrFrmCmpnt: UserFormComponent) { }

  ionViewDidLoad() {
    console.log('Hello AcctSetupPage Page');
  }

}
