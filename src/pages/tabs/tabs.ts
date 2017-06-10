import { Component                           } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({ name: 'TabsPage'})
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {


  tab1Root: string = 'Work Order Form';
  tab2Root: string = 'Report History' ;
  tab3Root: string = 'OnSiteHome'     ;
  tab4Root: string = 'Summary'        ;
  tab5Root: string = 'Settings'       ;

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad () { console.log('Tabs Page loaded...' ); }

}

  // tab1Root: string = 'Tech Settings'  ;
