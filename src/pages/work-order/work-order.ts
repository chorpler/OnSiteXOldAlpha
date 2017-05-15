import { Component, OnInit                   } from '@angular/core';
import { FormGroup, FormControl, Validators  } from "@angular/forms";
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DBSrvcs                             } from '../../providers/db-srvcs';
import { TimeSrvc                            } from '../../providers/time-parse-srvc';

@IonicPage({ name: 'Work Order Form' })

@Component({
  selector: 'page-work-order',
  templateUrl: 'work-order.html',
})

export class WorkOrder implements OnInit {

  title        : string   = 'Work Report'             ;
  setDate      : Date     = new Date()                ; 
  year         : number   = this.setDate.getFullYear(); 
  mode         : string   = 'New'                     ; 
  workOrder    : FormGroup; 
  repairHrs    : number   ; 
  profile      : any = { }; 
  tmpReportData: any      ; 
  docID        : string   ; 
  idDate       : string   ;
  idTime       : string   ;

  strtHrs   ; 
  strtMin   ; 
  hrsHrs    ; 
  hrsMin    ; 
  endMin    ; 
  endHrs    ; 
  prsHrs    ; 
  prsMin    ; 
  rprtDate  : Date     = new Date()                ; 
  timeStarts: Date     = new Date()                ; 
  timeEnds  ;
  // , private dbSrvcs: DBSrvcs

  constructor(public navCtrl: NavController, public navParams: NavParams, private dbSrvcs: DBSrvcs, private timeSrvc: TimeSrvc ) { }

  ionViewDidLoad() { console.log('ionViewDidLoad WorkOrder'); }

  ngOnInit() {
    if (this.navParams.get('mode') !== undefined) { this.mode = this.navParams.get('mode'); }
    console.log(this.mode);
    console.log(this.setDate);
    console.log(this.year);
    console.log(this.rprtDate);
    this.initializeForm();
  }


  private initializeForm() {
    this.workOrder = new FormGroup({
      'timeStarts': new FormControl(this.timeStarts, Validators.required), 
      'timeEnds'  : new FormControl(null, Validators.required),
      'repairHrs' : new FormControl(null, Validators.required), 
      'uNum'      : new FormControl(null, Validators.required), 
      'wONum'     : new FormControl(null, Validators.required), 
      'notes'     : new FormControl(null, Validators.required), 
      'rprtDate'  : new FormControl(this.rprtDate, Validators.required)
    })
  }

  onSubmit() {
    this.processWO();
  }

/**
 * Calcualtes workOrderData.timeEnds given workOrderData.timeStarts 
 * and workOrderData.repairHrs
 * 
 * @private
 * @param {any} workOrderData 
 * 
 * @memberOf WorkOrder
 */
  private calcEndTime(workOrderData) {
    const _Xdec = /(00|15|30|45)(?!\:\d{2})/;
    const _Xhrs = /([0-9]{2})(?=:\d{2})/;

    this.prsHrs = _Xhrs.exec(workOrderData.timeStarts);
    this.strtHrs = parseInt(this.prsHrs[0]).toString();
    this.prsMin = _Xdec.exec(workOrderData.timeStarts);
    
    if (parseInt(this.prsMin[0]) === 0) {
      this.strtMin = '00';
    }
    else if (parseInt(this.prsMin[0]) === 15) {
      this.strtMin = '15';
    }
    else if (parseInt(this.prsMin[0]) === 30) {
      this.strtMin = '30';
    }
    else {
      this.strtMin = '45';
    }

    workOrderData.timeStarts = this.strtHrs + ':' + this.strtMin;

    this.hrsHrs = Math.floor(workOrderData.repairHrs);
    this.hrsMin = (workOrderData.repairHrs%1)*60;
    
    if (parseInt(this.strtMin) + this.hrsMin > 60) {

      if (parseInt(this.strtHrs) + this.hrsHrs + 1 > 24) 
            { this.endHrs = parseInt(this.strtHrs) + this.hrsHrs -23; this.endMin = parseInt(this.strtMin) + this.hrsMin - 60; } 
      else  { this.endHrs = parseInt(this.strtHrs) + this.hrsHrs + 1; this.endMin = parseInt(this.strtMin) + this.hrsMin - 60; }
    }

    else { 
      if (parseInt(this.strtHrs) + this.hrsHrs > 24) 
            { this.endHrs = parseInt(this.strtHrs) + this.hrsHrs -24; this.endMin = parseInt(this.strtMin) + this.hrsMin;      }
      else  { this.endHrs = parseInt(this.strtHrs) + this.hrsHrs;     this.endMin = parseInt(this.strtMin) + this.hrsMin;      }
    }
    
    if( this.endHrs < 10 ) {
      if( this.endHrs === 0 ) { this.endHrs = '00'       }
      else { this.endHrs = '0' + this.endHrs.toString(); }
    } else { this.endHrs = this.endHrs.toString();       }

    if( this.endMin === 0 ) { this.endMin = '00';        }
    if( this.hrsMin === 0 ) { this.hrsMin = '00';        }

    this.timeEnds           = this.endHrs + ':' + this.endMin;
    workOrderData.timeEnds  = this.endHrs + ':' + this.endMin;
    workOrderData.repairHrs = this.hrsHrs + ':' + this.hrsMin;

    console.log(this.strtHrs);
    console.log(this.endHrs);

    workOrderData.repairHrs = this.hrsHrs + ':' + this.hrsMin;
  }

  genReportID() {
    this.timeSrvc.getParsedDate();
    this.idDate = this.timeSrvc._arrD[1].toString() +
                  this.timeSrvc._arrD[2].toString() +
                  this.timeSrvc._arrD[0].toString() +
                  this.timeSrvc._arrD[3].toString();
    this.idTime = this.timeSrvc._arrD[4].toString() +
                  this.timeSrvc._arrD[5].toString() +
                  this.timeSrvc._arrD[6].toString();
      console.log( this.idDate );
    // let firstInitial = this.profile.firstName.slice(0,1);
    // let lastInitial = this.profile.lastName.slice(0,1);
    this.docID = this.profile.avatarName + '_' + this.idDate + this.idTime;
    console.log(this.docID);
  }

  processWO() {
    const workOrderData = this.workOrder.value;
    this.calcEndTime(workOrderData);
    this.genReportID();
    console.log("processWO() has initial workOrderData:");
    console.log(workOrderData);

    this.dbSrvcs.checkLocalDoc( '_local/techProfile')
    .then( docExists => {
      if(docExists) {
        console.log("docExists is true");
        this.dbSrvcs.getDoc('_local/techProfile').then(res => {
          this.profile = res;
          if( typeof this.profile.updated == 'undefined' || this.profile.updated === false ) {
            /* Update flag not set, force user to visit Settings page at gunpoint */
            this.tmpReportData = workOrderData;
            this.tmpReportData._id = '_local/tmpReport';
            this.tmpReportData.docID = this.docID;
            // this.tmpReportData._rev = ;
            console.log("Update flag not set, tmpReportData is:");
            console.log( this.tmpReportData );
            this.dbSrvcs.addLocalDoc( this.tmpReportData )
            
            /* Notify user and go to Settings page */
            // this.navCtrl.push('Report Settings');

          } else {
            /* Update flag is true, good to submit work order */
            console.log("docExists is false");
            this.tmpReportData = workOrderData;
            this.tmpReportData.profile = this.profile;
            this.tmpReportData._id = this.docID;
            // this.tmpReportData._rev = '0-1';
            console.log("Update flag set, tmpReportData is:");
            console.log( this.tmpReportData );
            
            this.dbSrvcs.addLocalDoc( this.tmpReportData );
          }
        })
      } else {
        console.error("Tech profile does not exist. Contact developers.");
      }
    });
  }

}
