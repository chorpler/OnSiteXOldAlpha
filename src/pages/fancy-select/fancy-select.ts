import 'rxjs/add/operator/debounceTime';

import { Component, OnInit, ViewChild                                                              } from '@angular/core'                              ;
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators         } from "@angular/forms"                             ;
import { IonicPage, NavController, NavParams, LoadingController, PopoverController, ViewController } from 'ionic-angular'                              ;
import { DBSrvcs                                                                                   } from '../../providers/db-srvcs'                   ;
import { AuthSrvcs                                                                                 } from '../../providers/auth-srvcs'                 ;
import { Log, moment, Moment, isMoment                                                             } from '../../config/config.functions'              ;
import { PayrollPeriod                                                                             } from '../../domain/payroll-period'                ;
import { Shift                                                                                     } from '../../domain/shift'                         ;
import { WorkOrder                                                                                 } from '../../domain/workorder'                     ;
// import { Status                                                                                    } from '../../providers/status'                     ;
import { UserData                                                                                  } from '../../providers/user-data'                  ;
import { sprintf                                                                                   } from 'sprintf-js'                                 ;
// import { FancySelectComponent                                                                      } from '../../components/fancy-select/fancy-select' ;
import { TranslateService                                                                          } from '@ngx-translate/core'                        ;
import { Preferences                                                                               } from '../../providers/preferences'                ;
import { STRINGS                                                                                   } from '../../config/config.strings'                ;

@IonicPage({ name: 'Fancy Select' })
@Component({
  selector: 'page-fancy-select',
  templateUrl: 'fancy-select.html',
})
export class FancySelectPage implements OnInit {
  public title:string = "Shift Select";
  public selectData:any = {};
  public options:Array<any> = [];
  public shifts:Array<Shift> = [];
  public selected:Shift = null;
  public periods:Array<PayrollPeriod> = [];
  public period:PayrollPeriod = null;
  public selectDataReady:boolean = false;
  public svgNumbers:any = [];
  public circled_numbers:Array<string> = STRINGS.NUMCHARS;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public translate:TranslateService) {
    window['fancyselect'] = this;
  }

  ionViewDidLoad() {
    Log.l('ionViewDidLoad FancySelectPage');
  }

  ngOnInit() {
    Log.l('FancySelect: ngOnInit called. SelectData is:\n', this.selectData);
    if (this.navParams.get('shifts') !== undefined) {
      this.shifts = this.navParams.get('shifts');
      //  this.shifts = this.selectData.options;
    }
    if(this.navParams.get('periods') !== undefined) {
      this.periods = this.navParams.get('periods');
    }
    if (this.navParams.get('title') !== undefined) { this.title = this.navParams.get('title') }
    let title = this.translate.instant('select_shift');
    this.period = this.periods[0];
    if(this.shifts) {
      let shift = this.shifts[0];
      for(let period of this.periods) {
        let pShifts = period.getPayrollShifts();
        if(pShifts.indexOf(shift) > -1) {
          this.period = period;
        }
      }
    }
    this.title = title;
    this.selectDataReady = true;
  }

  updateSelectedPeriod(period:PayrollPeriod) {
    Log.l("Payroll period updated to:\n", period);
  }

  selectOption(shift:Shift) {
    this.selected = shift;
    Log.l(`selectOption(): selected shift:\n`, shift);
    this.viewCtrl.dismiss(this.selected);
  }

  cancel() {
    Log.l("FancySelect: user clicked cancel(), no shift selected.");
    this.viewCtrl.dismiss(null);
  }

}
