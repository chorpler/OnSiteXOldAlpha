import { Component                } from '@angular/core'  ;
import { NavController, NavParams } from 'ionic-angular'  ;
import { FormBuilder, FormGroup   } from '@angular/forms' ;
import { Validators, FormControl  } from '@angular/forms' ;
import { Observable               } from "rxjs/Rx"        ;
import { AuthTestUser } from '../../providers/auth-test-user';
import { OSXU } from '../../config/user.config.user';
import { DBSrvcs } from '../../providers/db-srvcs';

@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
  styles: [ ".ng-invalid { background: rgba(255 150, 80, 0.5) }" ]
})

export class ReportsPage {

  items: any;

  constructor(public dbservcies: DBSrvcs){  }

  ionViewDidLoad(){
    this.items = [];
    this.dbservcies.getDocuments()
      .then( (result) => { this.items = result; } );
  }
 
  addData(){
    let date = new Date();
    let docId = date.toDateString();
    let newDoc = {
      '_id': docId,
      'message': date.getTime()
    };

    this.dbservcies.addDocument(newDoc);
  }

}