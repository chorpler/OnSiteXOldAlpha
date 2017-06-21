import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { IonicPage, NavController, NavParams, LoadingController, PopoverController, ViewController } from 'ionic-angular';
import * as moment from 'moment';
import 'rxjs/add/operator/debounceTime';
import { DBSrvcs } from '../../providers/db-srvcs';
import { AuthSrvcs } from '../../providers/auth-srvcs';
import { TimeSrvc } from '../../providers/time-parse-srvc';
// import { ReportBuildSrvc } from '../../providers/report-build-srvc';
// import { AlertService } from '../../providers/alerts';
import { Log } from '../../config/config.functions';
import { Shift } from '../../domain/shift';
import { WorkOrder } from '../../domain/workorder';
import { Status } from '../../providers/status';
import { UserData } from '../../providers/user-data';
import { sprintf } from 'sprintf-js';
// import { SafePipe } from '../../pipes/safe';
import { FancySelectComponent } from '../../components/fancy-select/fancy-select';
import { TranslateService } from '@ngx-translate/core';
import { Preferences } from '../../providers/preferences';
import { STRINGS } from '../../config/config.strings';


/**
 * Generated class for the FancySelectPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({ name: 'Fancy Select' })
@Component({
  selector: 'page-fancy-select',
  templateUrl: 'fancy-select.html',
})
export class FancySelectPage implements OnInit {
  public title:string = "Shift Select";
  public selectData:any = {};
  public options:Array<any> = [];
  public selected:any = null;
  public svgNumbers:any = [];
  public circChars:any = UserData.circled_numbers_chars;
  public circled_numbers:Array<string> = STRINGS.NUMCHARS;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public translate:TranslateService) {
    if (this.navParams.get('selectData') !== undefined) {
       this.selectData = this.navParams.get('selectData');
       this.options = this.selectData.options;
    }
    if(this.navParams.get('title') !== undefined) { this.title = this.navParams.get('title') }
    let title = this.translate.instant('select_shift');
    this.title = title;
    window['fancyselect'] = this;
  }

  ionViewDidLoad() {
    Log.l('ionViewDidLoad FancySelectPage');
  }

  ngOnInit() {
    Log.l('FancySelect: ngOnInit called. SelectData is:\n', this.selectData);
  }

  selectOption(number) {
    this.selected = this.options[number].shift;
    Log.l(`selectOption(${number}): selected option:\n`, this.selected);
    this.viewCtrl.dismiss(this.selected);
  }

  cancel() {
    Log.l("FancySelect: user clicked cancel(), no shift selected.");
    this.viewCtrl.dismiss(null);
  }

}
