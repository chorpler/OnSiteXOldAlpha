import { Component                } from '@angular/core'                 ;
import { NavController, NavParams } from 'ionic-angular'                 ;
import { FormBuilder, FormGroup   } from '@angular/forms'                ;
import { Validators, FormControl  } from '@angular/forms'                ;
import { Observable               } from "rxjs/Rx"                       ;
import { DBSrvcs                  } from '../../providers/db-srvcs'      ;

@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
  styles: [ ".ng-invalid { background: rgba(255 150, 80, 0.5) }" ]
})

export class ReportsPage {

  items: any;

  constructor(public dbservices: DBSrvcs){  }

  ionViewDidLoad(){
    this.items = [];
    this.dbservices.getDocuments()
      .then( (result) => { this.items = result; } );
  }
 
  addData(){
    let date = new Date();
    let newDoc = {
      '_id': date,
      'message': date.getTime()
    };

    this.dbservices.addDocument(newDoc);
  }

}