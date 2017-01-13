import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as PouchDB from 'pouchdb';

@Injectable()
export class DBSrvcs {

  data    : any; 
  db      : any; 
  username: any; 
  password: any; 
  remote  : any;
  

  constructor(public http: Http, public zone: NgZone) {

      this.db = new PouchDB('test_pouch-connections');
      this.username = 'sesatech';
      this.password = 'sesatech';
      this.remote = 'http://martiancouch.hplx.net/test_pouch-connections';
 
      let options = {
        live      : true, 
        retry     : true, 
        continuous: true, 
        auth      : { username: this.username, password: this.password }
      };
  
      this.db.sync(this.remote, options);
 
  }

  addDocument(doc){ this.db.put(doc); }

  getDocuments(){
 
    return new Promise(resolve => {
 
      this.db.allDocs({  include_docs: true })
      .then((result) => { this.data = [];
        let docs = result.rows.map((row) => {
          this.data.push(row.doc);
          resolve(this.data);
        });
 
        this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
          this.handleChange(change);
        });
      }).catch((error) => {
        console.log(error);
      });
    });
  }

  handleChange(change){
 
    this.zone.run(() => { 
      let changedDoc = null;
      let changedIndex = null;
 
    this.data.forEach((doc, index) => {
      if(doc._id === change.id){ changedDoc = doc;  changedIndex = index; }
      });

    if(change.deleted){ this.data.splice(changedIndex, 1); } 
      else { if(changedDoc){ this.data[changedIndex] = change.doc; } 
      else { this.data.push(change.doc); } }
      });

  }

}
