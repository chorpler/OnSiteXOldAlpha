import { Component               } from '@angular/core'               ;
import { Platform, NavController } from 'ionic-angular'               ;
import { StatusBar               } from '@ionic-native/status-bar'    ;
import { SplashScreen            } from '@ionic-native/splash-screen' ;
import { Storage                 } from '@ionic/storage'              ;
import { Log, CONSOLE            } from '../config/config.functions'  ;
import * as PouchDB2               from 'pouchdb'                     ;
import * as pdbAuth                from 'pouchdb-authentication'      ;
import * as pdbUpsert              from 'pouchdb-upsert'              ;
import * as moment                 from 'moment'                      ;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'OnSiteHome';
  PouchDB: any;
  pouchOptions: any = {};

  constructor(platform: Platform, navCtrl: NavController, statusBar: StatusBar, splashScreen: SplashScreen, storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.pouchOptions = {adapter: 'websql', auto_compaction: true};
      window["PouchDB"] = require("pouchdb");
      window["PouchDB"].plugin(require('pouchdb-upsert'));
      window["PouchDB"].plugin(require('pouchdb-authentication'));
      // this.PouchDB = require('pouchdb');
      this.PouchDB = window["PouchDB"].defaults(this.pouchOptions);
      window["PouchDB"] = window["PouchDB"].defaults(this.pouchOptions);
      // this.PouchDB.debug.enable('pouchdb:api');
      // this.PouchDB.debug.enable('pouchdb:http');
      this.PouchDB.debug.disable('*');
      window['moment'] = moment;
      window['Log'] = Log;
      window['t1'] = CONSOLE.t1;
      window['c1'] = CONSOLE.c1;
      // this.PouchDB.debug.disable('pouchdb:api');
      // window["PouchDB"] = this.PouchDB; // Dev: reveals PouchDB to PouchDB Inspector

      console.log("App done starting, now moving to Home...");
      Log.l("Testing log");
      navCtrl.push('OnSiteHome');
    });
  }
}

