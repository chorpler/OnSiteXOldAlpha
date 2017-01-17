import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as PouchDB from 'pouchdb';
import { NativeStorage } from 'ionic-native';


@Injectable()
export class AuthSrvcs {

  data: any;
  userDb: any;
  username: any;
  password: any;
  remote: any;
  options: any;
  // idPrefix = "org.couchdb.user:";
  docId = "org.couchdb.user:Omega";


  constructor(public http: Http, public zone: NgZone) {

    this.userDb = new PouchDB('notusers');
    this.username = 'Mike';
    this.password = 'Dorothyinkansas4life';
    this.remote = 'http://martiancouch.hplx.net/notusers';

    this.options = {
      live: true,
      retry: true,
      continuous: false,
      auth: { username: this.username, password: this.password }
    };
    this.userDb.sync(this.remote, this.options);
  }

  ionViewDidLoad() { }

  // login(docId: string, auth: { username: any, password: any }) {
  //   this.docId = this.idPrefix + this.username;

  //   return new Promise(resolve => {
  //     this.userDb.get( this.remote, this.docId, this.options)
  //       .then((response) => {
  //         this.data;
  //         console.log(this.data);
  //       })
  //   })
  // }
  login() {
    console.log(this.docId);
  }
}


/**
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

 */