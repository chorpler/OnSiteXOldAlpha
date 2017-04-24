import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({ name: 'Work Order Form' })

@Component({
  selector: 'page-work-order',
  templateUrl: 'work-order.html',
})

export class WorkOrder implements OnInit {

  setDate = new Date();
  year = this.setDate.getFullYear();
  mode     : string   = 'New'; 
  workOrder: FormGroup; 
  repairHrs: number   ; 

  strtHrs   ; 
  strtMin   ; 
  hrsHrs    ; 
  hrsMin    ; 
  endMin    ; 
  endHrs    ; 
  prsHrs    ; 
  prsMin    ; 
  rprtDate  ; 
  timeStarts; 
  timeEnds  ;

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() { console.log('ionViewDidLoad WorkOrder'); }

  ngOnInit() {
    if (this.navParams.get('mode') !== undefined) { this.mode = this.navParams.get('mode'); }
    console.log(this.mode);
    console.log(this.setDate);
    console.log(this.year);
    this.initializeForm();
  }


  private initializeForm() {
    this.workOrder = new FormGroup({
      'timeStarts': new FormControl(null, Validators.required), 
      'timeEnds'  : new FormControl(null, Validators.required),
      'repairHrs' : new FormControl(null, Validators.required), 
      'uNum'      : new FormControl(null, Validators.required), 
      'wONum'     : new FormControl(null, Validators.required), 
      'notes'     : new FormControl(null, Validators.required), 
      'rprtDate'  : new FormControl(null, Validators.required)
    })
  }

  onSubmit() {
    const workOrderData = this.workOrder.value;
    this.calcEndTime(workOrderData);
    console.log(workOrderData);
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
    const _Xhrs = /([0-9]+)(?=:\d{2})/;

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

}
