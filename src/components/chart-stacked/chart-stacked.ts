// import { trigger, state, style, animate, transition   } from '@angular/animations'  ;
// import { UserData                                     } from 'providers/user-data'  ;
// import   * as ChartStackedPlugin                        from 'chartjs-plugin-stacked100' ;
import   * as DatalabelsPlugin                          from 'chartjs-plugin-datalabels' ;
import { Chart                                        } from 'chart.js'                  ;
import { Component, Input, Output, OnInit, OnDestroy, } from '@angular/core'             ;
import { ViewChild, ElementRef, EventEmitter,         } from '@angular/core'             ;
import { Log, moment, Moment, isMoment                } from 'domain/onsitexdomain'      ;

@Component({
  selector: 'chart-stacked',
  templateUrl: 'chart-stacked.html',
})
export class ChartStackedComponent implements OnInit,OnDestroy {
  @ViewChild('chartStackedCanvas') chartStackedCanvas:ElementRef;
  @Input('times') times:Array<any> = [];
  @Input('options') options:any;
  @Output('onclick') onclick:any = new EventEmitter();
  @Input('data') data:any;

  public chart      : any;
  public labelList  : Array<string> = [];
  public dataList   : Array<string> = [];
  public chartHeight:string = "85vh";
  public chartWidth :string = "95vw";
  public chartStyle :any = {
    position: "relative",
    height: this.chartHeight,
    width: this.chartWidth,
  };

  constructor() {
    Log.l('Hello ChartStackedComponent Component');
    window['onsitechartstackedcomponent'] = this;
    window['onsitechart'] = Chart;
    // Chart.plugins.register(ChartStackedPlugin);
    Chart.plugins.register(DatalabelsPlugin);
  }

  ngOnInit() {
    Log.l("ChartStackedComponent: ngOnInit() fired");
    this.chart = new Chart(this.chartStackedCanvas.nativeElement, {
      type: 'bar',
      // backgroundColor: 'rgba(255, 255, 255, 1.0)',
      data: this.data,
      options: this.options,
    });
  }

  ngOnDestroy() {
    Log.l("ChartStackedComponent: ngOnDestroy() fired");
  }

  ionViewDidLoad() {
    Log.l("ChartStackedComponent: ionViewDidLoad() fired");
    // this.chart = new Chart(this.chartStackedCanvas.nativeElement, {
    //   type: 'bar',
    //   backgroundColor: 'rgba(255, 255, 255, 1.0)',
    //   data: this.data,
    //   options: this.options,
    // });
  }

  public clickHandler(event:any) {
    this.onclick.emit(event);
  }

}
