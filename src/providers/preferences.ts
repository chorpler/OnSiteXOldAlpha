/**
 * Name: Preferences provider (Console)
 * Vers: 68
 * Date: 2018-03-15
 * Auth: David Sargeant
 * Logs: 68 2018-03-15: Added vibration key to USER
 * Logs: 67 2018-03-06: Added jobsites keys in CONSOLE
 * Logs: 66 2018-03-05: Added hbpreauth keys in CONSOLE
 * Logs: 65 2018-03-03: Changed to using JSON8 and JSON8Patch to merge instead of replacing new Preferences
 * Logs: 64 2018-03-01: Added techphones preferences
 * Logs: 63 2018-02-28: Changed oldreports name
 * Logs: 62 2018-02-26: Added CONSOLE global pref keys loadMiscReports and loadOldReports
 * Logs: 61 2018-02-23: Added techshiftreports config keys, and payroll_periods count for CONSOLE
 * Logs: 60 2018-02-21: Added exportUseQuickbooksName to Payroll
 * Logs: 59 2018-02-20: Changed default Payroll showAlerts setting to false
 * Logs: 58 2018-02-20: Added more options for Payroll page
 * Logs: 56 2017-12-11: Added kn, be, hb invoices databases
 * Logs: 55 2017-12-09: Added page size arrays
 * Logs: 54 2017-11-17: Added reports_old01 key
 * Logs: 53: Fixed preauths typo
 * Logs: 52: Added preauth database parameter
 * Logs: 51: Added customizable PouchDB adapter
 * Logs: 50: Added weekStartDay preference
 * Logs: 49: Added loadReports preference
 * Logs: 48: Updated PouchDB adapter back to idb
 * Logs: 47: Updated PouchDB adapter to worker
 * Logs: I forget
 */

import { Injectable                  } from '@angular/core'        ;
import { Log, oo, ooPatch, ooPointer } from 'domain/onsitexdomain' ;

export const version = 67                  ;
// export var   adapter = 'websql'         ;
export var   adapter = 'idb'               ;
// export var   adapter = 'memory'         ;
// export var   adapter = 'cordova-sqlite' ;
// export var   adapter = 'worker'         ;


export var server         = "securedb.sesaonsite.com";
// export var server         = "db.cellar.sesa.us"    ;
// export var server         = "pico.sesa.us"         ;
export var port           = 443                    ;
export var protocol       = "https"                ;
export var reports        = 'reports_ver101100'    ;
export var reportsOther   = 'sesa-reports-other'   ;
export var employees      = 'sesa-employees'       ;
export var config         = 'sesa-config'          ;
export var jobsites       = 'sesa-jobsites'        ;
export var scheduling     = 'sesa-scheduling'      ;
export var schedulingbeta = 'sesa-scheduling-beta' ;
export var invoices       = 'sesa-invoices'        ;
export var invoices_be    = 'sesa-invoices-be'     ;
export var invoices_hb    = 'sesa-invoices-hb'     ;
export var invoices_kn    = 'sesa-invoices-kn'     ;
export var technicians    = 'sesa-technicians'     ;
export var messages       = 'sesa-messages'        ;
export var comments       = 'sesa-comments'        ;
export var phoneInfo      = 'sesa-tech-phones'     ;
export var sounds         = 'sesa-sounds'          ;
export var login          = 'sesa-login'           ;
export var geolocation    = 'sesa-geolocation'     ;
export var preauths       = 'sesa-preauths'        ;
export var worksites      = 'sesa-worksites'       ;
export var reports_old01  = 'sesa-reports-2017-09' ;
export var reports_old02  = 'sesa-reports-2017-12' ;
export var reports_old    = [
  'reports_old01',
  // 'reports_old02',
 ];
// export var reports_old    = ['reports_old01', 'reports_old02', ]

@Injectable()
export class Preferences {
  public static DB: any = {
    'reports'      : reports       ,
    'reports_other': reportsOther  ,
    'employees'    : employees     ,
    'config'       : config        ,
    'jobsites'     : jobsites      ,
    'scheduling'   : scheduling    ,
    'invoices'     : invoices      ,
    'invoices_be'  : invoices_be   ,
    'invoices_hb'  : invoices_hb   ,
    'invoices_kn'  : invoices_kn   ,
    'technicians'  : technicians   ,
    'messages'     : messages      ,
    'comments'     : comments      ,
    'phoneInfo'    : phoneInfo     ,
    'sounds'       : sounds        ,
    'login'        : login         ,
    'geolocation'  : geolocation   ,
    'preauths'     : preauths      ,
    'worksites'    : worksites     ,
    'reports_old01': reports_old01 ,
    'reports_old02': reports_old02 ,
    'reports_old'  : reports_old   ,
  };
  public static CONSOLE: any = {
    global: {
      payroll_periods: 4,
      loadEmployees: true,
      loadSites: true,
      loadReports: false,
      loadMiscReports: false,
      loadOldReports: false,
      weekStartDay: 3,
    },
    scheduling: {
      persistTechChanges: false,
      showAllSites: true,
      showOffice: false,
      allDatesAvailable: false,
      lastScheduleUsed: "",
    },
    payroll: {
      showColors: true,
      showShiftLength: true,
      showAlerts: false,
      exportUseQuickbooksName: true,
      minHoursWhenOn: 20,
      maxHoursWhenOff: 15,
    },
    techshiftreports: {
      showAllSites: false,
      showAllTechs: false,
      payroll_periods: 4,
    },
    hbpreauth: {
      showAllSites: false,
      payroll_periods: 4,
    },
    jobsites: {
      autoLayoutTable: false,
      tableResizeMode: 'fit',
    },
    techphones: {
      autoLayoutTable: false,
      tableResizeMode: 'fit',
    },
    pages: {
      reports: 100,
      reports_other: 100,
      employees: 200,
      jobsites: 50,
      techphones: 100,
    },
    pageSizes: {
      reports: [50,100,200,500,1000,2000],
      reports_other: [50,100,200,500,1000,2000],
      employees: [30,50,100,150,200,250,300,400,500],
      jobsites: [5,10,20,30,40,50,100],
      techphones: [50,100,200,500,1000],
    },
};
  public static USER: any = {
    preferencesVersion: version,
    language: 'en',
    shifts: 7,
    payroll_periods: 2,
    audio: false,
    stayInReports: false,
    spinnerSpeed: 10,
    messageCheckInterval: 15,
    vibration: true,
  };
  public static DEVELOPER: any = {
    showDocID: false,
    showDocRev: false,
    showReportTimes: false,
    showReportSite: false,
  };
  public static SERVER: any = {
    localAdapter: adapter,
    server: server,
    port: port,
    protocol: protocol,
    opts: { auto_compaction: true, get adapter() { return Preferences.SERVER.protocol; }, set adapter(val:string) {Preferences.SERVER.protocol = val}, skipSetup: true },
    ropts: {
      get adapter() {return Preferences.SERVER.opts.adapter; },
      set adapter(value:string) {Preferences.SERVER.opts.adapter = value;},
      skipSetup: true,
      auth: {
        username: '',
        password: '',
      },
      ajax: {
        headers: {
          Authorization: '',
        },
        withCredentials: true,
      },
    },
    cropts: {
      get adapter() { return Preferences.SERVER.opts.adapter; },
      set adapter(value: string) { Preferences.SERVER.opts.adapter = value; },
    },
    repopts: { live: false, retry: false, continuous: false },
    ajaxOpts: { withCredentials: true, headers: { Authorization: '' } },
    remoteDBInfo: {},
    rdbServer: {
      get protocol() { return Preferences.SERVER.opts.adapter; },
      set protocol(value: string) { Preferences.SERVER.opts.adapter = value; },
      get server() { return Preferences.SERVER.server;},
      set server(value:string) { Preferences.SERVER.server = value;},
      get opts() { return Preferences.SERVER.ropts;},
      set opts(value:any) { Preferences.SERVER.ropts = value;},
    }
  };
  public get DB() { return Preferences.DB; };
  public set DB(value:any) { Preferences.DB = value;};
  public get SERVER() { return Preferences.SERVER;};
  public set SERVER(value:any) { Preferences.SERVER = value;};
  public get USER() { return Preferences.USER;};
  public set USER(value:any) { Preferences.USER = value;};
  public get DEVELOPER() { return Preferences.DEVELOPER;};
  public set DEVELOPER(value:any) { Preferences.DEVELOPER = value;};
  public get CONSOLE() { return Preferences.CONSOLE; };
  public set CONSOLE(value:any) { Preferences.CONSOLE = value; };
  constructor() {
    window["onsiteprefs"] = this;
    window["onsitedebug"] = window["onsitedebug"] || [];
    window["onsitedebug"]["Preferences"] = Preferences;
  }

  public static getRemoteDBURL(dbtype:string):string {
    let S = Preferences.SERVER;
    let D = Preferences.DB;
    let types = Object.keys(D);
    if (types.indexOf(dbtype) > -1) {
      let dbname = D[dbtype];
      let url = `${S.protocol}://${S.server}:${S.port}/${dbname}`;
      return url;
    } else {
      Log.w(`getRemoteDBURL(): Could not find database type '${dbtype}'!`);
      return null;
    }
  }

  public getRemoteDBURL(dbname:string):string {
    return Preferences.getRemoteDBURL(dbname);
  }

  public static getDBURL(dbname:string):string {
    let S = Preferences.SERVER;
    let D = Preferences.DB;
    let url = `${S.protocol}://${S.server}:${S.port}/${dbname}`;
    return url;
  }

  public getDBURL(dbname:string):string {
    return Preferences.getDBURL(dbname);
  }

  public static getConsole():any {
    return Preferences.CONSOLE;
  }

  public getConsole():any {
    return Preferences.getConsole();
  }

  public getPrefs():any {
    return Preferences.getPrefs();
  }

  public getDBKeys(onlySyncableDatabases?:boolean):Array<string> {
    return Preferences.getDBKeys(onlySyncableDatabases);
  }

  public getDB(key?:string):any {
    return Preferences.getDB(key);
  }

  public getServer():any {
    return Preferences.getServer();
  }

  public getUserPrefs():any {
    return Preferences.USER;
  }

  public setPrefs(value:any):any {
    return Preferences.setPrefs(value);
  }

  public setDB(key:string, value:any):any {
    return Preferences.setDB(key, value);
  }

  public setServer(key:string, value:any):any {
    return Preferences.setServer(key, value);
  }

  public setUserPref(key:string, value:any):any {
    return Preferences.setUserPref(key, value);
  }

  public setUserPrefs(value:any):any {
    return Preferences.setUserPrefs(value);
  }

  public static setUsername(username:string):string {
    Preferences.SERVER.ropts.auth.username = username;
    let p = Preferences.SERVER.ropts.auth.password;
    if(p) {
      Preferences.setAuth(username, p);
    }
    return Preferences.SERVER.ropts.auth.username;
  }

  public static setPassword(password:string):string {
    Preferences.SERVER.ropts.auth.password = password;
    let u = Preferences.SERVER.ropts.auth.username;
    if(u) {
      Preferences.setAuth(u, password);
    }
    return Preferences.SERVER.ropts.auth.password;
  }

  public setUsername(username:string):string {
    return Preferences.setUsername(username);
  }

  public setPassword(password:string):string {
    return Preferences.setPassword(password);
  }

  public static setAuth(username:string, password:string):any {
    Preferences.setUsername(username);
    Preferences.setPassword(password);
    Preferences.SERVER.ropts.auth.username = username;
    Preferences.SERVER.ropts.auth.password = password;
    let authString:string = username + ":" + password;
    let b64AuthString:string = window.btoa(authString);
    Preferences.SERVER.ropts.ajax.headers.Authorization = `Basic ${b64AuthString}`
    Preferences.SERVER.ropts.ajax.withCredentials = true;
    return Preferences.SERVER.ropts;
  }

  public static getRemoteOptions():any {
    return Preferences.SERVER.ropts;
  }

  public getRemoteOptions():any {
    return Preferences.getRemoteOptions();
  }

  public setAuth(username:string, password:string):any {
    return Preferences.setAuth(username, password);
  }

  public static getProtocol():string {
    return Preferences.SERVER.protocol;
  }

  public getProtocol():string {
    return Preferences.getProtocol();
  }

  public static getPrefs():any {
    return { DB: Preferences.DB, SERVER: Preferences.SERVER, USER: Preferences.USER, DEVELOPER: Preferences.DEVELOPER, CONSOLE: Preferences.CONSOLE };
  }

  public static getDBKeys(onlySyncableDatabases?:boolean):Array<string> {
    let out:string[] = [];
    let keys1 = Object.keys(Preferences.DB);
    for(let prefsKey of keys1) {
      if(!Array.isArray(prefsKey)) {
        /* This key is a string, so push it to the output array of strings */
        if(onlySyncableDatabases) {
          if(prefsKey !== 'login' && prefsKey !== 'reports_old' && prefsKey !== '_session') {
            out.push(prefsKey)
          }
        } else {
          out.push(prefsKey);
        }
      } else {
        /* This key is actually an array, so break its keys up and push them individually */
        for(let key of prefsKey) {
          out.push(key);
        }
      }
    }
    return out;
  }

  public static getDBRecords():any {
    return Preferences.DB;
  }

  public getDBRecords():any {
    return Preferences.getDBRecords();
  }

  public static getSyncableDBKeys():Array<string> {
    return Preferences.getDBKeys(true);
  }

  public getSyncableDBKeys():Array<string> {
    return Preferences.getSyncableDBKeys();
  }

  public static getSyncableDBList():Array<string> {
    let keys:string[] = Preferences.getDBKeys(true);
    let out:string[] = [];
    let DB = Preferences.getDBRecords();
    for(let key of keys) {
      let dbname:string = "";
      if(DB[key] !== undefined) {
        out.push(DB[key]);
      }
    }
    return out;
  }

  public getSyncableDBList():Array<string> {
    return Preferences.getSyncableDBList();
  }

  public static getDB(dbkeys?:string|Array<string>, onlySyncableDatabases?:boolean):any {
    let keys = Preferences.getDBKeys();
    let out:Array<string> = [];
    let DB = Preferences.getDBRecords();
    if(typeof dbkeys === 'string') {
      if(DB[dbkeys] !== undefined) {
        return DB[dbkeys];
      } else {
        return null;
      }
    } else if(Array.isArray(dbkeys)) {
      for(let dbKey of keys) {
        for(let newKey of dbkeys) {
          out.push(newKey);
        }
      }
      return out;
    } else {
      return DB;
    }
    //     if(DB[key] !== undefined) {
    //       let dbname = Preferences.DB[key];
    //       out.push(dbname);
    //       return dbname;
    //     } else {
    //       Log.w(`Preferences.getDB('${key}'): No such key in Preferences.DB list:\n`, Preferences.DB);
    //       return null;
    //     }
    //   } else {
    //     Log.w(`Preferences.getDB('${key}'): Can't even figure out the type of key that is key:\n`, key);
    //     out.push(String(key));
    //   }
    //   return out;
    // } else {
    //   return this.;
    // }
  }

  public static getServer():any {
    return Preferences.SERVER;
  }

  public static getUserPrefs():any {
    return Preferences.USER;
  }

  public static getConsolePrefs():any {
    return Preferences.CONSOLE;
  }

  public getConsolePrefs():any {
    return Preferences.getConsolePrefs();
  }

  public static setPrefs(value: any):any {
    for (let key of Object.keys(value)) {
      for (let key2 of Object.keys(value[key])) {
        if (Preferences[key] !== undefined && Preferences[key][key2] !== undefined) {
          Preferences[key][key2] = value[key][key2];
        }
      }
    }
    // Preferences.DB = value.DB;
    // Preferences.SERVER = value.SERVER;
    // Preferences.USER = value.USER;
    return Preferences;
  }

  public static setDB(key:string, value:any):any {
    if (Preferences.DB[key] !== undefined) {
      Preferences.DB[key] = value;
    }
    return Preferences.DB;
  }

  public static setServer(key:string, value:any):any {
    if (Preferences.SERVER[key] !== undefined) {
      Preferences.SERVER[key] = value;
    }
    return Preferences.SERVER;
  }

  public static setUserPref(key:string, value:any):any {
    Preferences.USER[key] = value;
    return Preferences.USER;
  }

  public static setUserPrefs(value:any):any {
    Preferences.USER = value;
    return Preferences.USER;
  }

  public static mergeNewPrefKeys(userPrefs:any) {
    let newPrefs = oo.clone(Preferences.getPrefs());
    let oldPrefs = oo.clone(userPrefs);
    Log.l("mergeNewPrefKeys(): Now attemtping to merge new preferences with old preferences:\n", newPrefs);
    Log.l(oldPrefs);
    let patchDoc = ooPatch.diff(oldPrefs, newPrefs);
    let newPatchDoc = [];
    for(let patch of patchDoc) {
      if(patch['op'] === 'add') {
        newPatchDoc.push(patch);
      }
    }
    Log.l("mergeNewPrefKeys(): Differences are:\n");
    Log.t(newPatchDoc);
    if(ooPatch.valid(newPatchDoc)) {
      let applyResult = ooPatch.apply(oldPrefs, newPatchDoc, {reversible: true});
      let updatedPrefs = applyResult.doc;
      if(oo.valid(updatedPrefs)) {
        Preferences.setPrefs(updatedPrefs);
      } else {
        Log.w(`Preferences.mergeNewPrefKeys(): keys not merged, merge created invalid JSON:\n`, updatedPrefs);
      }
    } else {
      Log.w(`Preferences.mergeNewPrefKeys(): keys not merged, patch created was invalid:\n`, newPatchDoc);
    }
  }

  public mergeNewPrefKeys(userPrefs:any) {
    return Preferences.mergeNewPrefKeys(userPrefs);
  }

  public static comparePrefs(userPrefs:any):any {
    let prefs = Preferences.getPrefs();
    let version = prefs.USER.preferencesVersion;
    let newVersion = 0;
    if (userPrefs['USER'] !== undefined && userPrefs['USER']['preferencesVersion'] !== undefined) {
      newVersion = userPrefs.USER.preferencesVersion;
    }
    // if (newVersion >= version) {
      // Preferences.setPrefs(userPrefs);
      Preferences.mergeNewPrefKeys(userPrefs);
    // }
    let updatedPrefs = Preferences.getPrefs();
    return updatedPrefs;
  }

  public comparePrefs(userPrefs:any):any {
    return Preferences.comparePrefs(userPrefs);
  }

  public getLanguage():string {
    return this.USER.language;
  }

  public setLanguage(value:boolean):string {
    this.USER.language = value;
    return this.USER.language;
  }

  public getPayrollPeriodCount():number {
    return this.getConsolePayrollPeriodCount();
  }

  public setPayrollPeriodCount(value:number):number {
    return this.setConsolePayrollPeriodCount(value);
  }

  public getConsolePayrollPeriodCount():number {
    return this.CONSOLE.global.payroll_periods;
  }

  public setConsolePayrollPeriodCount(value:number):number {
    this.CONSOLE.global.payroll_periods = value;
    return this.CONSOLE.global.payroll_periods;
  }

  public getUserPayrollPeriodCount():number {
    return this.USER.payroll_periods;
  }

  public setUserPayrollPeriodCount(value:number):number {
    this.USER.payroll_periods = value;
    return this.USER.payroll_periods;
  }

  public getMessageCheckInterval():number {
    return this.USER.messageCheckInterval;
  }

  public setMessageCheckInterval(value:number):number {
    let val = Number(value);
    this.USER.messageCheckInterval = val;
    return this.USER.messageCheckInterval;
  }

  public getStayInReports():boolean {
    return this.DEVELOPER.stayInReports;
  }

  public setStayInReports(value:boolean):boolean {
    this.USER.stayInReports = value;
    return this.DEVELOPER.stayInReports;
  }

  public getShowID():boolean {
    return this.DEVELOPER.showDocID;
  }

  public getShowRev():boolean {
    return this.DEVELOPER.showDocRev;
  }

  public getShowTimes():boolean {
    return this.DEVELOPER.showReportTimes;
  }

  public setShowID(value:boolean):boolean {
    this.DEVELOPER.showDocID = value;
    return this.DEVELOPER.showDocID;
  }

  public setShowRev(value:boolean):boolean {
    this.DEVELOPER.showDocRev = value;
    return this.DEVELOPER.showDocRev;
  }

  public setShowTimes(value:boolean):boolean {
    this.DEVELOPER.showReportTimes = value;
    return this.DEVELOPER.showReportTimes;
  }

  public getShowSite():boolean {
    return this.DEVELOPER.showReportSite;
  }

  public setShowSite(value:boolean):boolean {
    this.DEVELOPER.showReportSite = value;
    return this.DEVELOPER.showReportSite;
  }

  public static getOldReportsKeys():Array<string> {
    return Preferences.DB.reports_old;
  }

  public static getOldReportsDBList():Array<string> {
    let out:string[] = [];
    let keys = Preferences.getOldReportsKeys();
    for(let key of Preferences.DB.reports_old) {
      let oneKey = Preferences.DB[key];
      out.push(oneKey);
    }
    return out;
  }

  public getOldReportsKeys():Array<string> {
    return Preferences.DB.reports_old;
  }

  public getOldReportsDBList():Array<string> {
    return Preferences.getOldReportsDBList();
  }

  public reinitializePrefs():any {
    Preferences.DB = {
      'reports'      : reports       ,
      'reports_other': reportsOther  ,
      'employees'    : employees     ,
      'config'       : config        ,
      'jobsites'     : jobsites      ,
      'scheduling'   : scheduling    ,
      'invoices'     : invoices      ,
      'invoices_be'  : invoices_be   ,
      'invoices_hb'  : invoices_hb   ,
      'invoices_kn'  : invoices_kn   ,
      'technicians'  : technicians   ,
      'messages'     : messages      ,
      'comments'     : comments      ,
      'phoneInfo'    : phoneInfo     ,
      'sounds'       : sounds        ,
      'login'        : login         ,
      'geolocation'  : geolocation   ,
      'preauths'     : preauths      ,
      'worksites'    : worksites     ,
      'reports_old01': reports_old01 ,
      'reports_old02': reports_old02 ,
      'reports_old'  : reports_old   ,
      };
    Preferences.SERVER = {
      localAdapter: adapter,
      server: server,
      port: port,
      protocol: protocol,
      opts: { auto_compaction: true, get adapter() { return Preferences.SERVER.protocol; }, set adapter(val:string) {Preferences.SERVER.protocol = val}, skipSetup: true },
      ropts: {
        get adapter() {return Preferences.SERVER.opts.adapter; },
        set adapter(value:string) {Preferences.SERVER.opts.adapter = value;},
        skipSetup: true
      },
      cropts: {
        get adapter() { return Preferences.SERVER.opts.adapter; },
        set adapter(value: string) { Preferences.SERVER.opts.adapter = value; },
      },
      repopts: { live: false, retry: false, continuous: false },
      ajaxOpts: { headers: { Authorization: '' } },
      remoteDBInfo: {},
      rdbServer: {
        get protocol() { return Preferences.SERVER.opts.adapter; },
        set protocol(value: string) { Preferences.SERVER.opts.adapter = value; },
        get server() { return Preferences.SERVER.server;},
        set server(value:string) { Preferences.SERVER.server = value;},
        get opts() { return Preferences.SERVER.ropts;},
        set opts(value:any) { Preferences.SERVER.ropts = value;},
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
      messageCheckInterval: 15,
      vibration: true,
    };
    Preferences.CONSOLE = {
      global: {
        payroll_periods: 4,
        loadEmployees: true,
        loadSites: true,
        loadReports: false,
        loadMiscReports: false,
        loadOldReports: false,
        weekStartDay: 3,
      },
      scheduling: {
        persistTechChanges: false,
        showAllSites: true,
        showOffice: false,
        allDatesAvailable: false,
        lastScheduleUsed: "",
      },
      payroll: {
        showColors: true,
        showShiftLength: true,
        showAlerts: false,
        exportUseQuickbooksName: true,
        minHoursWhenOn: 20,
        maxHoursWhenOff: 15,
      },
      techshiftreports: {
        showAllSites: false,
        showAllTechs: false,
        payroll_periods: 4,
      },
      hbpreauth: {
        showAllSites: false,
        payroll_periods: 4,
      },
      jobsites: {
        autoLayoutTable: false,
        tableResizeMode: 'fit',
      },
      techphones: {
        autoLayoutTable: false,
        tableResizeMode: 'fit',
      },
      pages: {
        reports: 100,
        reports_other: 100,
        employees: 200,
        jobsites: 50,
        techphones: 100,
      },
      pageSizes: {
        reports: [50,100,200,500,1000,2000],
        reports_other: [50,100,200,500,1000,2000],
        employees: [30,50,100,150,200,250,300,400,500],
        jobsites: [5,10,20,30,40,50,100],
        techphones: [50,100,200,500,1000],
      },
    };
  }
}
