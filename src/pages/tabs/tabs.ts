import { Component                           } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({ name: 'TabsPage'})
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root: string = 'Tech Settings'  ;
  tab2Root: string = 'OnSiteHome'     ;
  tab3Root: string = 'Work Order Form';
  tab4Root: string = 'Report History' ;
  tab5Root: string = 'Summary'        ;
  tab6Root: string = 'Settings'       ;

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad () { console.log('Tabs Page loaded...' ); }

}
