import { Injectable                                 } from '@angular/core'        ;
import { Log, Moment, isMoment                      } from 'domain/onsitexdomain' ;
import { Observable                                 } from 'rxjs'                 ;
import { Subject                                    } from 'rxjs/Subject'         ;
import { Employee, Jobsite, Report, ReportOther,    } from 'domain/onsitexdomain' ;
import { Shift, PayrollPeriod, Schedule, Schedules, } from 'domain/onsitexdomain' ;
import { Notice,                                    } from 'domain/onsitexdomain' ;

export type OSAppEvent = 'openpage' | 'authenticate' | 'login' | 'logout' | 'updatedata' | 'options' | 'saveprefs' | 'testnotifications' | 'menuclosed' | 'starttime' | 'endtime' | 'elapsedtime';
export type ClockAction = 'show' | 'hide' | 'toggle' | 'caption';

@Injectable()
export class DispatchService {
  private subject        = new Subject<any>() ;
  private ePeriod        = new Subject<any>() ;
  private period         = new Subject<any>() ;
  private shift          = new Subject<any>() ;
  private tableMode      = new Subject<any>() ;
  private calcMode       = new Subject<any>() ;
  private invoiceSite    = new Subject<any>() ;
  private invoiceReports = new Subject<any>() ;
  private DPSCalcGrid    = new Subject<any>() ;
  private datastore      = new Subject<any>() ;
  private dbProgress     = new Subject<any>() ;
  private notice         = new Subject<Notice>();
  private notices        = new Subject<Notice[]>();
  private appReady       = new Subject<boolean>();
  private prefsChange    = new Subject<any>();
  private showOptions    = new Subject<any>();
  private appEvent       = new Subject<{channel:OSAppEvent, event:any}>();
  private clockEvent     = new Subject<{action:ClockAction, text?:string}>()

  public constructor() {
    window['onsitedispatch'] = this;
  }

  public updateEmployeePeriodMap(ePeriod:Map<Employee,PayrollPeriod>) {
    this.ePeriod.next({ ePeriod: ePeriod });
  }

  public updatePeriod(period:PayrollPeriod) {
    this.period.next({ period: period });
  }

  public updateShift(shift:Shift) {
    this.shift.next({ shift: shift });
  }

  public updateDPSCalculationsGrid(grid:Array<Array<any>>) {
    this.DPSCalcGrid.next({ grid: grid });
  }

  public updateTableMode(mode:string) {
    this.tableMode.next({mode: mode});
  }

  public updateCalcMode(mode:string) {
    this.calcMode.next({mode: mode});
  }

  public updateInvoiceSite(site:Jobsite) {
    this.invoiceSite.next({site: site});
  }

  public updateInvoiceReports(reports:Array<Report>) {
    this.invoiceReports.next({reports: reports});
  }

  public updateDatastore(type:string, payload:any) {
    this.datastore.next({type:type, payload:payload});
  }

  public updateDBProgress(type:string, id:string) {
    this.dbProgress.next({type: type, id: id});
  }

  public updateNotices(msgs:Notice[]) {
    this.notices.next(msgs);
  }

  public updateNotice(msg:Notice) {
    this.notice.next(msg);
  }

  public setAppReady(value:boolean) {
    this.appReady.next(value);
  }

  public updatePrefs() {
    this.prefsChange.next(true);
  }

  public showGlobalOptions(value:string) {
    this.showOptions.next(value);
  }

  public sendMessage(message: string) {
    this.subject.next({ text: message });
  }

  public clearMessage() {
    this.subject.next();
  }

  public triggerAppEvent(channel:OSAppEvent, event?:any) {
    this.appEvent.next({channel: channel, event: event});
  }

  public triggerClockEvent(action:ClockAction, text?:string) {
    let data:{action:ClockAction, text?:string};
    if(text) {
      data = {
        action: action,
        text: text,
      };
    } else {
      data = {
        action: action,
      };
    }
    this.clockEvent.next(data);
  }

  public getMessage():Observable<any> {
    return this.subject.asObservable();
  }

  public periodUpdated():Observable<any> {
    return this.period.asObservable();
  }

  public shiftUpdated():Observable<any> {
    return this.shift.asObservable();
  }

  public employeePeriodMapUpdated():Observable<any> {
    return this.ePeriod.asObservable();
  }

  public dpsCalculationsGridUpdated():Observable<any> {
    return this.DPSCalcGrid.asObservable();
  }

  public tableModeUpdated():Observable<any> {
    return this.tableMode.asObservable();
  }

  public calcModeUpdated():Observable<any> {
    return this.calcMode.asObservable();
  }

  public invoiceSiteUpdated():Observable<any> {
    return this.invoiceSite.asObservable();
  }

  public invoiceReportsUpdated():Observable<any> {
    return this.invoiceReports.asObservable();
  }

  public datastoreUpdated():Observable<any> {
    return this.datastore.asObservable();
  }

  public dbProgressUpdated():Observable<any> {
    return this.dbProgress.asObservable();
  }

  public noticesUpdated():Observable<Notice[]> {
    return this.notices.asObservable();
  }

  public noticeUpdated():Observable<Notice> {
    return this.notice.asObservable();
  }

  public appReadyStatus():Observable<boolean> {
    return this.appReady.asObservable();
  }

  public prefsUpdated():Observable<any> {
    return this.prefsChange.asObservable();
  }

  public optionsShown():Observable<any> {
    return this.showOptions.asObservable();
  }

  public appEventFired():Observable<{channel:string, event?:any}> {
    return this.appEvent.asObservable();
  }

  public clockEventFired():Observable<{action:ClockAction, text?:string}> {
    return this.clockEvent.asObservable();
  }
}
