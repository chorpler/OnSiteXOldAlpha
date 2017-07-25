/**
 * Name: Preferences provider
 * Vers: 40
 * Date: 2017-07-25
 * Auth: David Sargeant
 */

import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core'              ;
import { Http       } from '@angular/http'              ;
import { Log        } from '../config/config.functions' ;

export const version  = 40;
export var   server   = "securedb.sesaonsite.com";
export var   port     = 443;
export var   protocol = "https";

@Injectable()
export class Preferences {
  public static USER: any = {
    preferencesVersion: version,
    language: 'en',
    shifts: 7,
    payroll_periods: 2,
    audio: false,
    stayInReports: false,
    spinnerSpeed: 10,
  };
  public static DEVELOPER: any = {
    showDocID: false,
    showDocRev: false,
    showReportTimes: false,
  };
  public static DB: any = {
    'reports'      : 'reports_ver101100',
    'reports_other': 'sesa-reports-other',
    'employees'    : 'sesa-employees',
    'config'       : 'sesa-config',
    'jobsites'     : 'sesa-jobsites',
    'scheduling'   : 'sesa-scheduling',
    'technicians'  : 'sesa-technicians',
    'messages'     : 'sesa-messages',
    'comments'     : 'sesa-comments',
    'phoneInfo'    : 'sesa-tech-phones',
    'login'        : '_session',
  };
  public static SERVER: any = {
    server: server,
    port: port,
    protocol: protocol,
    androidUpdateURL: 'https://sos.sesa.us/android/OnSiteX.xml',
    opts: { auto_compaction: true },
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

  public get DB(): any { return Preferences.DB; };
  public get SERVER(): any { return Preferences.SERVER; };
  public get USER():any { return Preferences.USER; };
  public get DEVELOPER():any { return Preferences.DEVELOPER; };
  public set DB(value:any) { Preferences.DB = value; };
  public set SERVER(value:any) { Preferences.SERVER = value; };
  public set USER(value:any){ Preferences.USER = value; };
  public set DEVELOPER(value:any){ Preferences.DEVELOPER = value; };
  constructor() {
    window["onsiteprefs"] = this;
  }

  public getStayInReports() {
    return this.DEVELOPER.stayInReports;
  }

  public setStayInReports(value:boolean) {
    this.USER.stayInReports = value;
    return this.DEVELOPER.stayInReports;
  }

  public getShowID() {
    return this.DEVELOPER.showDocID;
  }

  public getShowRev() {
    return this.DEVELOPER.showDocRev;
  }

  public getShowTimes() {
    return this.DEVELOPER.showReportTimes;
  }

  public setShowID(value:boolean) {
    this.DEVELOPER.showDocID = value;
    return this.DEVELOPER.showDocID;
  }

  public setShowRev(value:boolean) {
    this.DEVELOPER.showDocRev = value;
    return this.DEVELOPER.showDocRev;
  }

  public setShowTimes(value:boolean) {
    this.DEVELOPER.showReportTimes = value;
    return this.DEVELOPER.showReportTimes;
  }

  public getPrefs() {
    return Preferences.getPrefs();
  }

  public getDB() {
    return Preferences.getDB();
  }

  public getServer() {
    return Preferences.getServer();
  }

  public getUserPrefs() {
    return Preferences.USER;
  }

  public setPrefs(value: any) {
    return Preferences.setPrefs(value);
  }

  public setDB(key: string, value: any) {
    return Preferences.setDB(key, value);
  }

  public setServer(key: string, value: any) {
    return Preferences.setServer(key, value);
  }

  public setUserPref(key: string, value:any) {
    return Preferences.setUserPref(key, value);
  }

  public setUserPrefs(value: any) {
    return Preferences.setUserPrefs(value);
  }

  public getLanguage() {
    return this.USER.language;
  }

  public setLanguage(value:boolean) {
    this.USER.language = value;
    return this.USER.language;
  }

  public getPayrollPeriodCount() {
    return this.USER.payroll_periods;
  }

  public setPayrollPeriodCount(value:number) {
    this.USER.payroll_periods = value;
    return this.USER.payroll_periods;
  }

  public static getPrefs() {
    return { DB: Preferences.DB, SERVER: Preferences.SERVER, USER: Preferences.USER, DEVELOPER: Preferences.DEVELOPER };
  }

  public static getDB() {
    return Preferences.DB;
  }

  public static getServer() {
    return Preferences.SERVER;
  }

  public static getUserPrefs() {
    return Preferences.USER;
  }

  public static setPrefs(value: any) {
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

  public static setDB(key: string, value: any) {
    if (Preferences.DB[key] !== undefined) {
      Preferences.DB[key] = value;
    }
    return Preferences.DB;
  }

  public static setServer(key: string, value: any) {
    if (Preferences.SERVER[key] !== undefined) {
      Preferences.SERVER[key] = value;
    }
    return Preferences.SERVER;
  }

  public static setUserPref(key: string, value: any) {
    Preferences.USER[key] = value;
    return Preferences.USER;
  }

  public static setUserPrefs(value: any) {
    Preferences.USER = value;
    return Preferences.USER;
  }

  public static comparePrefs(newPrefs:any) {
    let prefs = Preferences.getPrefs();
    let version = prefs.USER.preferencesVersion;
    let newVersion = 0;
    if(newPrefs['USER'] !== undefined && newPrefs['USER']['preferencesVersion'] !== undefined) {
      newVersion = newPrefs.USER.preferencesVersion;
    }
    if(newVersion >= version) {
      Preferences.setPrefs(newPrefs);
    }
    let updatedPrefs = Preferences.getPrefs();
    return updatedPrefs;
  }

  public comparePrefs(newPrefs:any) {
    return Preferences.comparePrefs(newPrefs);
  }

  public reinitializePrefs() {
    Preferences.DB = {
      'reports'      : 'reports_ver101100',
      'reports_other': 'sesa-reports-other',
      'employees'    : 'sesa-employees',
      'config'       : 'sesa-config',
      'jobsites'     : 'sesa-jobsites',
      'scheduling'   : 'sesa-scheduling',
      'technicians'  : 'sesa-technicians',
      'messages'     : 'sesa-messages',
      'comments'     : 'sesa-comments',
      'login'        : '_session'

    };

    Preferences.SERVER = {
      server: server,
      port: port,
      protocol: protocol,
      androidUpdateURL: 'https://sos.sesa.us/android/OnSiteX.xml',
      // opts: { adapter: 'websql', auto_compaction: true },
      opts: { auto_compaction: true },
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
      preferencesVersion: version,
      language: 'en',
      shifts: 7,
      payroll_periods: 2,
      audio: false,
      stayInReports: false,
      spinnerSpeed: 10,
    }

    Preferences.DEVELOPER = {
      showDocID: false,
      showDocRev: false,
    }
  }

}
