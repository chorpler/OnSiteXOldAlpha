import 'rxjs/add/operator/debounceTime'                                                     ;
import { sprintf                                          } from 'sprintf-js'               ;
import { Component, OnInit, ViewChild, NgZone, OnDestroy, } from '@angular/core'            ;
import { AfterViewInit, ElementRef,                       } from '@angular/core'            ;
import { IonicPage, NavController, NavParams              } from 'ionic-angular'            ;
import { DBService                                        } from 'providers/db-service'     ;
import { ServerService                                    } from 'providers/server-service' ;
import { AuthSrvcs                                        } from 'providers/auth-srvcs'     ;
import { AlertService                                     } from 'providers/alerts'         ;
import { SmartAudio                                       } from 'providers/smart-audio'    ;
import { Log, moment, Moment, isMoment                    } from 'domain/onsitexdomain'     ;
import { SESAClient, SESALocation, SESALocID, CLL         } from 'domain/onsitexdomain'     ;
import { PayrollPeriod                                    } from 'domain/onsitexdomain'     ;
import { Shift                                            } from 'domain/onsitexdomain'     ;
import { Report                                           } from 'domain/onsitexdomain'     ;
import { Employee                                         } from 'domain/onsitexdomain'     ;
import { ReportOther                                      } from 'domain/onsitexdomain'     ;
import { Jobsite                                          } from 'domain/onsitexdomain'     ;
import { UserData                                         } from 'providers/user-data'      ;
import { Preferences                                      } from 'providers/preferences'    ;
import { TranslateService                                 } from '@ngx-translate/core'      ;
import { TabsService                                      } from 'providers/tabs-service'   ;
import { Pages, SVGIcons, SelectString,                   } from 'domain/onsitexdomain'     ;
import { ChartStackedComponent                            } from 'components/chart-stacked' ;
import { ColorService                                     } from 'providers/color-service'  ;

export const focusDelay = 500;

@IonicPage({ name: 'Shift View' })
@Component({
  selector: 'page-shift-view',
  templateUrl: 'shift-view.html'
})
export class ShiftViewPage implements OnInit,OnDestroy,AfterViewInit {
  @ViewChild('chartComponent') chartComponent:ChartStackedComponent;
  public title                     : string           = 'Shift View'               ;
  public lang                      : any                                           ;
  public static PREFS              : any              = new Preferences()          ;
  public get prefs():any { return ShiftViewPage.PREFS; }                           ;
  public payrollPeriods            : Array<PayrollPeriod> = []                     ;
  public shift                     : Shift                                         ;
  public shifts                    : Array<Shift>         = []                     ;
  public allShifts                 : Array<Shift>         = []                     ;
  public period                    : PayrollPeriod                                 ;
  public selectedShift             : Shift                                         ;
  public sites                     : Array<Jobsite>      = []                      ;
  public site                      : Jobsite                                       ;
  public dataReady                 : boolean             = false                   ;
  public chartOptions:any = {
    maintainAspectRatio: false,
    title: {
      display: false,
    },
    legend: {
      display: false,
    },
    barThickness: 200,
    layout: {
      padding: {
        top: 10,
      },
    },
    scales: {
      xAxes: [{
        scaleLabel: {
          display: false,
         },
      }],
      yAxes: [{
        stacked: true,
        gridLines: {
          display: true,
          drawTicks: false,
          color: "rgba(80,80,80,0.5)",
        },
        ticks: {
          display: true,
          reverse: true,
          // suggestedMin: 0,
          // suggestedMax: 24,
          min: 0,
          max: 24,
          stepSize: 1.0,
        }
      }],
    },
    plugins: {
      datalabels: {
        // color: "rgba(255,255,255,1.0)",
        color: "rgba(0,0,0,1.0)",
        font: {
          family: "RobotoMono",
          size: 16,
        },
        formatter: function(value, context) {
          // return value.label;
          Log.l("Datalabels formatter: value and context are:");
          Log.l(value);
          Log.l(context);
          let i = context.datasetIndex;
          let out = sprintf("Rpt %02d: %03.01f hrs", i+1, value);
          return out;
          // return sprintf(`Rpt ${i+1}: ${value} hrs`;
        }
      }
    }
  };
  public chartData:any = {};
  // public chartData:any = {
  //   // labels: ["Shift"],
  //   datasets: [
  //     { label: "Job 1", data: [1,],  backgroundColor: "rgba(244, 143, 177, 0.6)" },
  //     { label: "Job 2", data: [2,],  backgroundColor: "rgba(255, 235, 59, 0.66)" },
  //     { label: "Job 3", data: [3,],  backgroundColor: "rgba(100, 181, 246, 0.6)" },
  //   ],
  // };

  // public chartData:any = {
  //   labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  //   datasets: [{
  //       label: '# of Votes',
  //       data: [12, 19, 3, 5, 2, 3],
  //       backgroundColor: [
  //           'rgba(255, 99, 132, 0.2)',
  //           'rgba(54, 162, 235, 0.2)',
  //           'rgba(255, 206, 86, 0.2)',
  //           'rgba(75, 192, 192, 0.2)',
  //           'rgba(153, 102, 255, 0.2)',
  //           'rgba(255, 159, 64, 0.2)'
  //       ],
  //       borderColor: [
  //           'rgba(255,99,132,1)',
  //           'rgba(54, 162, 235, 1)',
  //           'rgba(255, 206, 86, 1)',
  //           'rgba(75, 192, 192, 1)',
  //           'rgba(153, 102, 255, 1)',
  //           'rgba(255, 159, 64, 1)'
  //       ],
  //       borderWidth: 1
  //   }],
  // };

  constructor(
    public  navCtrl      : NavController    ,
    public  navParams    : NavParams        ,
    private db           : DBService        ,
    public  server       : ServerService    ,
    public  alert        : AlertService     ,
    public  audio        : SmartAudio       ,
    public  zone         : NgZone           ,
    public  tabServ      : TabsService      ,
    public  ud           : UserData         ,
    public  translate    : TranslateService ,
    public  colors       : ColorService     ,
  ) {
    let w = window;
    w["shiftview"] = w["onsiteshiftview"] = this              ;
  }

  ngOnInit() {
    Log.l("ShiftViewPage: ngOnInit() fired");
    if(this.ud.isAppLoaded()) {
      this.runWhenReady();
    }
  }

  ngOnDestroy() {
    Log.l("ShiftViewPage: ngOnDestroy() fired");
  }

  ngAfterViewInit() {
    Log.l("ShiftViewPage: ngAfterViewInit() fired");
    this.tabServ.setPageLoaded(Pages.ShiftView);
  }

  ionViewDidLoad() { Log.l('ionViewDidLoad ReportPage'); }

  public async runWhenReady() {
    try {
      this.dataReady = false;
      this.payrollPeriods = this.ud.getPayrollPeriods();
      this.allShifts = this.ud.getAllShifts();
      if (this.navParams.get('shift') !== undefined) {
        this.shift = this.navParams.get('shift');
      } else {
        this.shift = this.allShifts[0];
      }
      let translations = [
        'shift',
        'reports_graph_label',
      ];
      this.lang = this.translate.instant(translations);
      let lang = this.lang;
      this.initializeUIData();
      this.dataReady = true;
    } catch(err) {
      Log.l(`runWhenReady(): Error loading page!`);
      Log.e(err);
      throw new Error(err);
    }
  }

  public initializeUIData() {
    let lang = this.lang;
    let viewData:any = {};
    let datasets = [];
    let labels = [];
    let i = 0;
    let periods:PayrollPeriod[] = this.payrollPeriods;
    let allShifts:Shift[] = [];
    for(let period of periods) {
      let shifts:Shift[] = period.getPayrollShifts();
      for(let shift of shifts) {
        allShifts.push(shift);
      }
    }
    if(allShifts.indexOf(this.shift) === -1) {
      this.shift = allShifts[0];
    }
    let shift:Shift = this.shift;
    let reports:Report[] = shift.getShiftReports();
    for(let report of reports) {
      i++;
      let data:any = {};
      let startMoment:Moment = moment(report.time_start);
      let endMoment:Moment   = moment(report.time_end);
      let hours:number       = report.getRepairHours();
      let bgColor:string     = this.colors.randomColor({format:'rgba', alpha: 0.4});
      // let bgColor:string     = this.ud.randomColor({redLow: 40, redHigh: 120, greenLow: 0, greenHigh: 250, blueLow: 0, blueHigh: 180, alpha: 0.4});
      // { label: "Job 1", data: [1,],  backgroundColor: "rgba(244, 143, 177, 0.6)" },
      let hrs = [
        hours,
      ];
      data = {
        data: hrs,
        backgroundColor: bgColor,
        label: `Report ${i}`,
        stack: "ShiftReports",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.75)",
      };
      // data.data = [hours];
      // // let lbl = `Rpt ${i}`;
      // // data.label = lbl;
      // // labels.push(lbl);
      // data.backgroundColor = bgColor;
      // data.stack = "ShiftReports";
      datasets.push(data);
    }
    viewData.datasets = datasets;
    // viewData.labels = [lang['reports_graph_label']];
    // viewData.labels   = labels;
    viewData.labels   = [""];
    this.chartData = viewData;
    this.shifts = allShifts;
    this.allShifts = allShifts;
    Log.l("initializeUIData(): chartData is:\n", this.chartData);
    return viewData;
  }

  public updateDisplay() {
  }

  public getCrewNumbers() {
  }

  public initializeFormListeners() {

  }

  public updateCrewNumber(evt?:any) {
    Log.l("updateCrewNumber(): Event is:\n", evt);
  }

  public updateType(value:SelectString, event?:any) {
  }

  public updateShift(shift:Shift, event?:any) {
  }

  public chartClick(event:any) {
    Log.l(`clickHandler(): event is:\n`, event);
    // let item = this.chart.getElementAtEvent(event);
    let chart = this.chartComponent.chart;
    let items = chart.getElementsAtEvent(event);
    Log.l(`clickHandler(): got items:\n`, items);
    let item = chart.getDatasetAtEvent(event)[0];
    Log.l(`clickHandler(): got item:\n`, item);
    if(item) {
      // let label = this.chart.data.labels[item._index];
      let label = chart.data.datasets[item._datasetIndex].label;
      let value = chart.data.datasets[item._datasetIndex].data[item._index];
      Log.l(`clickHandler(): Label '${label}' has value:\n`, value);
    }
    // let meta = this.chart.getDatasetMeta(event);
    // Log.l(`clickHandler(): got meta:\n`, meta);
  }

}

