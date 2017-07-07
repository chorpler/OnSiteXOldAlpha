import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
// import { StorageService } from './storage-service';
import { Log } from '../config/config.functions';
import 'rxjs/add/operator/map';

/*
  Generated class for the PreferencesProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Preferences {
  public static DB: any = {
    'reports': 'reports_ver101100',
    'reports_other': 'sesa-reports-other',
    'employees': 'sesa-employees',
    'config': 'sesa-config',
    'jobsites': 'sesa-jobsites',
    'scheduling': 'sesa-scheduling',
    'technicians': 'sesa-technicians',
    'messages': 'sesa-messages',
    'comments': 'sesa-comments',
    'login': '_session'
  };
  public static SERVER: any = {
    server: "securedb.sesaonsite.com",
    port: '443',
    protocol: 'https',
    opts: { adapter: 'websql', auto_compaction: true },
    ropts: { get adapter() { return Preferences.SERVER.protocol; }, skipSetup: true },
    cropts: { get adapter() { return Preferences.SERVER.protocol; } },
    repopts: { live: false, retry: false },
    ajaxOpts: { headers: { Authorization: '' } },
    remoteDBInfo: {},
    rdbServer: {
      get protocol() { return Preferences.SERVER.protocol; },
      get server() { return Preferences.SERVER.server; },
      opts: {
        get adapter() { return Preferences.SERVER.protocol; },
        skipSetup: true
      }
    }
  };
  public static USER: any = {
    language: 'en',
    shifts: 7,
    payroll_periods: 2
  }
  public DB: any = Preferences.DB;
  public SERVER: any = Preferences.SERVER;
  public USER:any = Preferences.USER;
  constructor() {
    window["onsiteprefs"] = this;
  }

  getPrefs() {
    return Preferences.getPrefs();
  }

  getDB() {
    return Preferences.getDB();
  }

  getServer() {
    return Preferences.getServer();
  }

  getUserPrefs() {
    return Preferences.USER;
  }

  setPrefs(value: any) {
    return Preferences.setPrefs(value);
  }

  setDB(key: string, value: any) {
    return Preferences.setDB(key, value);
  }

  setServer(key: string, value: any) {
    return Preferences.setServer(key, value);
  }

  setUserPref(key: string, value:any) {
    return Preferences.setUserPref(key, value);
  }

  setUserPrefs(value: any) {
    return Preferences.setUserPrefs(value);
  }

  static getPrefs() {
    return { DB: Preferences.DB, SERVER: Preferences.SERVER, USER: Preferences.USER };
  }

  static getDB() {
    return Preferences.DB;
  }

  static getServer() {
    return Preferences.SERVER;
  }

  static getUserPrefs() {
    return Preferences.USER;
  }

  static setPrefs(value: any) {
    for(let key of Object.keys(value)) {
      for(let key2 of Object.keys(value[key])) {
        if(Preferences[key] !== undefined && Preferences[key][key2] !== undefined) {
          Preferences[key][key2] = value[key][key2];
        }
      }
    }
    // Preferences.DB = value.DB;
    // Preferences.SERVER = value.SERVER;
    // Preferences.USER = value.USER;
    return Preferences;
  }

  static setDB(key: string, value: any) {
    if (Preferences.DB[key] !== undefined) {
      Preferences.DB[key] = value;
    }
    return Preferences.DB;
  }

  static setServer(key: string, value: any) {
    if (Preferences.SERVER[key] !== undefined) {
      Preferences.SERVER[key] = value;
    }
    return Preferences.SERVER;
  }

  static setUserPref(key: string, value: any) {
    Preferences.USER[key] = value;
    return Preferences.USER;
  }

  static setUserPrefs(value: any) {
    Preferences.USER = value;
    return Preferences.USER;
  }

  reinitializePrefs() {
    Preferences.DB = {
      'reports': 'reports_ver101100',
      'reports_other': 'sesa-reports-other',
      'employees': 'sesa-employees',
      'config': 'sesa-config',
      'jobsites': 'sesa-jobsites',
      'scheduling': 'sesa-scheduling',
      'technicians': 'sesa-technicians',
      'messages': 'sesa-messages',
      'comments': 'sesa-comments',
      'login': '_session'
    };

    Preferences.SERVER = {
      server: "securedb.sesaonsite.com",
      port: '443',
      protocol: "https",
      opts: { adapter: 'websql', auto_compaction: true },
      ropts: { adapter: Preferences.SERVER.protocol, skipSetup: true },
      cropts: { adapter: Preferences.SERVER.protocol },
      repopts: { live: false, retry: false },
      ajaxOpts: { headers: { Authorization: '' } },
      remoteDBInfo: {},
      rdbServer: {
        protocol: Preferences.SERVER.protocol,
        server: Preferences.SERVER.server,
        opts: {
          adapter: Preferences.SERVER.protocol,
          skipSetup: true
        }
      }
    };

    Preferences.USER = {
      language: 'en',
      shifts: 7,
      payroll_periods: 2
    }
  }

}
