export var PREFS = {
  DB: {
    'reports': 'reports',
    'employees': 'sesa-employees',
    'config' : 'sesa-config',
    'jobsites': 'sesa-jobsites',
    'scheduling': 'sesa-scheduling',
    'technicians': 'sesa-technicians',
    'login': '_session'
  },
  SERVER: {
    server        : "securedb.sesaonsite.com"                          ,
    port          : '443'                                              ,
    protocol      : "https"                                            ,
    opts          : {adapter : 'websql', auto_compaction: true       } ,
    ropts         : {adapter : this.protocol, skipSetup : true       } ,
    cropts        : {adapter : this.protocol                         } ,
    repopts       : {live    : false, retry : false                  } ,
    ajaxOpts      : {headers : { Authorization: ''                   }},
    remoteDBInfo  : {                                                } ,
    rdbServer     : {
      protocol: this.protocol,
      server: this.server,
      opts: {
        adapter: this.protocol,
        skipSetup : true
      }
    }
  }
}

export const STRINGS = {
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

