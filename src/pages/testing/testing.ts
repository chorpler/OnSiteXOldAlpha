import { Component, OnInit, ChangeDetectionStrategy, NgZone,                 } from '@angular/core'           ;
import { OnDestroy, AfterViewInit,                                           } from '@angular/core'           ;
import { IonicPage, NavController, NavParams, } from 'ionic-angular'           ;
import { Log, isMoment, moment, Moment        } from 'config/config.functions' ;
import { TabsService                          } from 'providers/tabs-service'  ;
import { Pages                                } from 'config/config.types'     ;

@IonicPage({ name: 'Testing' })
@Component({ selector: 'page-testing',
templateUrl: 'testing.html',
})
export class TestingPage implements OnInit,OnDestroy,AfterViewInit {
  public title        : string           = "Mike's Test Page"                                            ;

  constructor(
    public tabServ:TabsService,
  ) {
    window["onsitetesting"] = this;
  }

  ngOnInit() {
    Log.l("ReportsFlaggedPage: ngOnInit() fired");
    // if (!(this.ud.isAppLoaded() && this.ud.isHomePageReady())) {
    //   this.tabs.goToPage('OnSiteHome');
    // } else {
    //   this.runOnPageLoad();
    // }
  }

  ngOnDestroy() {
    Log.l("ReportsFlaggedPage: ngOnDestroy() fired");
  }

  ngAfterViewInit() {
    Log.l("ReportsFlaggedPage: ngAfterViewInit() fired");
    this.tabServ.setPageLoaded(Pages.Testing);
  }
}
