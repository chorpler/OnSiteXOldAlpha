import { Component               } from '@angular/core'               ;
import { Platform, NavController } from 'ionic-angular'               ;
import { StatusBar               } from '@ionic-native/status-bar'    ;
import { SplashScreen            } from '@ionic-native/splash-screen' ;
import * as PouchDB2 from 'pouchdb'                                   ;
import * as pdbAuth from 'pouchdb-authentication'                     ;
import * as pdbUpsert from 'pouchdb-upsert'                           ;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'OnSiteHome';
  PouchDB: any;

  constructor(platform: Platform, navCtrl: NavController, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      window["PouchDB"] = require("pouchdb");
      window["PouchDB"].plugin(require('pouchdb-upsert'));
      window["PouchDB"].plugin(require('pouchdb-authentication'));
      this.PouchDB = require('pouchdb');
      // this.PouchDB = require("pouchdb");
      this.PouchDB.plugin(require('pouchdb-upsert'));
      this.PouchDB.plugin(require('pouchdb-authentication'));

      // window["PouchDB"] = this.PouchDB; // Dev: reveals PouchDB to PouchDB Inspector

      console.log("App done starting, now moving to Home...");
      navCtrl.push('OnSiteHome');
    });
  }
}

