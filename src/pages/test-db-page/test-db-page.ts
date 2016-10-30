import { Component                          } from '@angular/core'                    ;
import { NavController                      } from 'ionic-angular'                    ;

/*
  Generated class for the TestDbPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-test-db-page',
  templateUrl: 'test-db-page.html'
})

export class TestDbPage {

  constructor(public navCtrl: NavController) { }

  ionViewDidLoad() {
    console.log('Hello TestDbPage Page');
  }


}
