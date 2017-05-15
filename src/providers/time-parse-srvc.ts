import { Injectable            } from                       '@angular/core' ;
import                                              'rxjs/add/operator/map' ;
import { REGXMMM, REGXDDD      } from '../config/config.date.object.onsite' ;
import { REGXMIN, REGXSEC      } from '../config/config.date.object.onsite' ;
import { REGXDAY, REGXYEAR     } from '../config/config.date.object.onsite' ;
import { XGMTOFFSET, XTIMEZONE } from '../config/config.date.object.onsite' ;
import { REGXTIME, REGXHOUR    } from '../config/config.date.object.onsite' ;
import { MONTH, OSXD           } from '../config/config.date.object.onsite' ;


@Injectable()

export class TimeSrvc {

  date        : any       ;
  _arrD       : any[]= [] ;
  dstr        : string    ;
  month       : any       ;
  weekDay     : any       ;
  mDay        : any       ;
  year        : any       ;
  hours       : any       ;
  min         : any       ;
  sec         : any       ;
  time        : any       ;
  gmtOffset   : any       ;
  tmZoneStr   : any       ;
  onSiteXDate : OSXD      ;

  constructor( ) { console.log('Hello TimeSrvc Provider'); }

  getParsedDate() {

    this.date = Date(); this.date;  this.dstr = this.date.toString();

    let prsMonth     =    REGXMMM.exec( this.dstr );  this.month     =     prsMonth[ 0 ];
    let prsWeekday   =    REGXDDD.exec( this.dstr );  this.weekDay   =   prsWeekday[ 0 ];
    let prsMday      =    REGXDAY.exec( this.dstr );  this.mDay      =      prsMday[ 0 ];
    let prsYear      =   REGXYEAR.exec( this.dstr );  this.year      =      prsYear[ 0 ];
    let prsHours     =   REGXHOUR.exec( this.dstr );  this.hours     =     prsHours[ 0 ];
    let prsMin       =    REGXMIN.exec( this.dstr );  this.min       =       prsMin[ 0 ];
    let prsSec       =    REGXSEC.exec( this.dstr );  this.sec       =       prsSec[ 0 ];
    let prsTime      =   REGXTIME.exec( this.dstr );  this.time      =      prsTime[ 0 ];
    let prsGmtoffset = XGMTOFFSET.exec( this.dstr );  this.gmtOffset = prsGmtoffset[ 0 ];
    let prsTmzonestr =  XTIMEZONE.exec( this.dstr );  this.tmZoneStr = prsTmzonestr[ 0 ];

    this._arrD = [ this.month, this.weekDay, this.mDay, this.year, this.hours, this.min, this.sec, this.time, this.gmtOffset, this.tmZoneStr ];
    console.log(this._arrD);
    return this._arrD;
  }

}
