export const STRINGS = {
  NUMCHARS: ["⓪", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨"],
  NUMBER_OF_SHIFTS: 8,
  STORAGE: {
    LOCKSCREEN: {
      FIRST: {
        TITLE: "SECURITY TOO LOW",
        TEXT: "To use hardware encryption, your device's lock screen must be secured with a swipe pattern, a PIN, or a password. If you do not enable this, your login will not be securely stored and you may have to log in more often. Would you like to go to settings to turn on lock-screen security?"
      },
      SECOND: {
        TITLE: "ARE YOU SURE?",
        TEXT: "You may have to log in every time you use the app. Are you sure you don't want to secure your lock screen?"
      }
    }
  }
}



export class PREFS {
  public static DB:any = {
    'reports': 'reports',
    'employees': 'sesa-employees',
    'config' : 'sesa-config',
    'jobsites': 'sesa-jobsites',
    'scheduling': 'sesa-scheduling',
    'technicians': 'sesa-technicians',
    'login': '_session'
  };
  public static SERVER:any = {
    server        : "securedb.sesaonsite.com"                          ,
    port          : '443'                                              ,
    protocol      : 'https'                                            ,
    opts          : {adapter : 'websql', auto_compaction: true       } ,
    ropts         : {adapter : null, skipSetup : true       } ,
    cropts        : {adapter : null                         } ,
    repopts       : {live    : false, retry : false                  } ,
    ajaxOpts      : {headers : { Authorization: ''                   }},
    remoteDBInfo  : {                                                } ,
    rdbServer     : {
      protocol: null,
      server: null,
      opts: {
        adapter: null,
        skipSetup : true
      }
    }
  };
  public db:any = PREFS.DB;
  public server:any = PREFS.SERVER;
  constructor() {
    window["onsiteprefs"] = this;
    PREFS.SERVER.ropts.adapter          = PREFS.SERVER.protocol; 
    PREFS.SERVER.cropts.adapter         = PREFS.SERVER.protocol; 
    PREFS.SERVER.rdbServer.protocol     = PREFS.SERVER.protocol; 
    PREFS.SERVER.rdbServer.server       = PREFS.SERVER.server  ; 
    PREFS.SERVER.rdbServer.opts.adapter = PREFS.SERVER.protocol;
  }

  getPrefs() {
    return PREFS.getPrefs();
  }

  getDB() {
    return PREFS.getDB();
  }

  getServer() {
    PREFS.getServer();
  }
  

  static getPrefs() {
    return {DB: PREFS.DB, SERVER: PREFS.SERVER};
  }

  static getDB() {
    return PREFS.DB;
  }

  static getServer() {
    return PREFS.SERVER;
  }

  static setPrefs(value:any) {
    PREFS.DB = value.DB;
    PREFS.SERVER = value.SERVER;
    return PREFS;
  }

  static setDB(key:string, value:any) {
    if(PREFS.DB[key] !== undefined) {
      PREFS.DB[key] = value;
    }
    return PREFS.DB;
  }

  static setServer(key:string, value:any) {
    if(PREFS.SERVER[key] !== undefined) {
      PREFS.SERVER[key] = value;
    }
    return PREFS.SERVER;
  }

  setPrefs(value:any) {
    return PREFS.setPrefs(value);
  }


  setDB(key:string, value:any) {
    return PREFS.setDB(key, value);
  }


  setServer(key:string, value:any) {
    return PREFS.setServer(key, value);
  }

  reinitializePrefs() {
    PREFS.DB = {
      'reports': 'reports',
      'employees': 'sesa-employees',
      'config' : 'sesa-config',
      'jobsites': 'sesa-jobsites',
      'scheduling': 'sesa-scheduling',
      'technicians': 'sesa-technicians',
      'login': '_session'
    };

    PREFS.SERVER = {
      server        : "securedb.sesaonsite.com"                          ,
      port          : '443'                                              ,
      protocol      : "https"                                            ,
      opts          : {adapter : 'websql', auto_compaction: true       } ,
      ropts         : {adapter : PREFS.SERVER.protocol, skipSetup : true       } ,
      cropts        : {adapter : PREFS.SERVER.protocol                         } ,
      repopts       : {live    : false, retry : false                  } ,
      ajaxOpts      : {headers : { Authorization: ''                   }},
      remoteDBInfo  : {                                                } ,
      rdbServer     : {
        protocol: PREFS.SERVER.protocol,
        server: PREFS.SERVER.server,
        opts: {
          adapter: PREFS.SERVER.protocol,
          skipSetup : true
        }
      }
    };
  }

}