import { Component, OnInit} from '@angular/core';
import { IonicPage, ViewController, PopoverController, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from '../../pipes/safe';
import { Log } from '../../config/config.functions';

/**
 * Generated class for the PopoverTemplatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({name: 'Popover'})
@Component({
  selector: 'page-popover-template',
  templateUrl: 'popover-template.html',
})
export class PopoverTemplate implements OnInit {
  public popoverData:any = "nothing";
  public navParms:any = null;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public popoverCtrl: PopoverController) {
    window["onsitepopover"] = this;
  }

  ngOnInit() {
    Log.l("PopoverTemplate: ngOnInit() fired.");
  }

  ionViewDidLoad() {
    Log.l('PopoverTemplate: ionViewDidLoad() fired');
    this.navParms = this.navParams;
    let popupData = "empty";
    Log.l("PopoverTemplate: navParams are:\n", this.navParams);
    if(this.navParams.get('contents') !== undefined) {
      popupData = this.navParams.get('contents');
    }
    this.popoverData = popupData;
  }

  closePopover() {
    this.viewCtrl.dismiss({passed: "This is data"});
  }

}
