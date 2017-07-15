// import { Injectable              } from                       '@angular/core' ;
// import                                                'rxjs/add/operator/map' ;
// import { REGXMMM, REGXDDD        } from '../config/config.date.object.onsite' ;
// import { REGXMIN, REGXSEC        } from '../config/config.date.object.onsite' ;
// import { REGXDAY, REGXYEAR       } from '../config/config.date.object.onsite' ;
// import { XGMTOFFSET, XTIMEZONE   } from '../config/config.date.object.onsite' ;
// import { REGXTIME, REGXHOUR      } from '../config/config.date.object.onsite' ;
// import { MONTH, OSXD, UETO, EDNO } from '../config/config.date.object.onsite' ;


// @Injectable()

// export class TimeSrvc {

//   date       : any   ;
//   _arrD      : any[  ] = [];
//   dstr       : string;
//   month      : any   ;
//   weekDay    : any   ;
//   mDay       : any   ;
//   year       : any   ;
//   hours      : any   ;
//   min        : any   ;
//   sec        : any   ;
//   time       : any   ;
//   gmtOffset  : any   ;
//   tmZoneStr  : any   ;
//   onSiteXDate: OSXD  ;
//   prsHrs     : any   ;
//   strtHrs    : any   ;
//   prsMin     : any   ;
//   strtMin    : any   ;
//   hrsHrs     : any   ;
//   hrsMin     : any   ;
//   endHrs     : any   ;
//   timeEnds   : any   ;
//   endMin     : any   ;
//   JSDN       : number;
//   JSND       : Date  ;
//   TZO        : number;
//   timeStamp  : number;

//   constructor( ) {
//     console.log('Hello TimeSrvc Provider');
//   }

//   getTimeStamp() {
//     this.JSDN = Date.now();
//     this.JSND = new Date();
//     this.TZO = this.JSND.getTimezoneOffset() / 60;
//     this.timeStamp = (this.JSDN/UETO)+EDNO-(this.TZO/24);
//     return this.timeStamp;
//   }

//   getParsedDate() {

//     this.date = Date(); this.date;  this.dstr = this.date.toString();

//     let prsMonth     =    REGXMMM.exec( this.dstr );  this.month     =     prsMonth[ 0 ];
//     let prsWeekday   =    REGXDDD.exec( this.dstr );  this.weekDay   =   prsWeekday[ 0 ];
//     let prsMday      =    REGXDAY.exec( this.dstr );  this.mDay      =      prsMday[ 0 ];
//     let prsYear      =   REGXYEAR.exec( this.dstr );  this.year      =      prsYear[ 0 ];
//     let prsHours     =   REGXHOUR.exec( this.dstr );  this.hours     =     prsHours[ 0 ];
//     let prsMin       =    REGXMIN.exec( this.dstr );  this.min       =       prsMin[ 0 ];
//     let prsSec       =    REGXSEC.exec( this.dstr );  this.sec       =       prsSec[ 0 ];
//     let prsTime      =   REGXTIME.exec( this.dstr );  this.time      =      prsTime[ 0 ];
//     let prsGmtoffset = XGMTOFFSET.exec( this.dstr );  this.gmtOffset = prsGmtoffset[ 0 ];
//     let prsTmzonestr =  XTIMEZONE.exec( this.dstr );  this.tmZoneStr = prsTmzonestr[ 0 ];

//     this._arrD = [ this.month, this.weekDay, this.mDay, this.year, this.hours, this.min, this.sec, this.time, this.gmtOffset, this.tmZoneStr ];
//     console.log(this._arrD);
//     return this._arrD;
//   }

//   /**
//  * Calcualtes workOrderData.timeEnds given workOrderData.timeStarts
//  * and workOrderData.repairHrs
//  *
//  * @private
//  * @param {any} workOrderData
//  *
//  * @memberOf WorkOrder
//  */
//   calcEndTime(workOrderData) {
//     const _Xdec = /(00|15|30|45)(?!\:\d{2})/;
//     const _Xhrs = /([0-9]{2})(?=:\d{2})/;

//     this.prsHrs = _Xhrs.exec(workOrderData.timeStarts);
//     this.strtHrs = parseInt(this.prsHrs[0]).toString();
//     this.prsMin = _Xdec.exec(workOrderData.timeStarts);

//     if (parseInt(this.prsMin[0]) === 0) {
//       this.strtMin = '00';
//     }
//     else if (parseInt(this.prsMin[0]) === 15) {
//       this.strtMin = '15';
//     }
//     else if (parseInt(this.prsMin[0]) === 30) {
//       this.strtMin = '30';
//     }
//     else {
//       this.strtMin = '45';
//     }

//     workOrderData.timeStarts = this.strtHrs + ':' + this.strtMin;

//     this.hrsHrs = Math.floor(workOrderData.repairHrs);
//     this.hrsMin = (workOrderData.repairHrs%1)*60;

//     if (parseInt(this.strtMin) + this.hrsMin > 60) {

//       if (parseInt(this.strtHrs) + this.hrsHrs + 1 > 24)
//             { this.endHrs = parseInt(this.strtHrs) + this.hrsHrs -23; this.endMin = parseInt(this.strtMin) + this.hrsMin - 60; }
//       else  { this.endHrs = parseInt(this.strtHrs) + this.hrsHrs + 1; this.endMin = parseInt(this.strtMin) + this.hrsMin - 60; }
//     }

//     else {
//       if (parseInt(this.strtHrs) + this.hrsHrs > 24)
//             { this.endHrs = parseInt(this.strtHrs) + this.hrsHrs -24; this.endMin = parseInt(this.strtMin) + this.hrsMin;      }
//       else  { this.endHrs = parseInt(this.strtHrs) + this.hrsHrs;     this.endMin = parseInt(this.strtMin) + this.hrsMin;      }
//     }

//     if( this.endHrs < 10 ) {
//       if( this.endHrs === 0 ) { this.endHrs = '00'       }
//       else { this.endHrs = '0' + this.endHrs.toString(); }
//     } else { this.endHrs = this.endHrs.toString();       }

//     if( this.endMin === 0 ) { this.endMin = '00';        }
//     if( this.hrsMin === 0 ) { this.hrsMin = '00';        }

//     this.timeEnds           = this.endHrs + ':' + this.endMin;
//     workOrderData.timeEnds  = this.endHrs + ':' + this.endMin;
//     workOrderData.repairHrs = this.hrsHrs + ':' + this.hrsMin;

//     console.log(this.strtHrs);
//     console.log(this.endHrs);

//     workOrderData.repairHrs = this.hrsHrs + ':' + this.hrsMin;
//   }

// }
