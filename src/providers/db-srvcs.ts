import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as PouchDB from 'pouchdb';

@Injectable()

/**
 * @class DBSrvcs
 *        methods [ addDoc, getDoc, allDoc, hndlChange ]
 */
export class DBSrvcs {

  data: any;
  db: any;
  username: any;
  password: any;
  remote: any;

  constructor(public http: Http, public zone: NgZone) {

    window["PouchDB"] = PouchDB; // Dev: reveals PouchDB to PouchDB Inspector
    this.db = new PouchDB('reports');
    this.username = 'sesatech';
    this.password = 'sesatech';
    // this.remote    = 'http://martiancouch.hplx.net/reports' ;
    this.remote = 'http://192.168.0.140:5984/reports';

    let options = {
      live: true,
      retry: true,
      continuous: true,
      auth: {
        username: this.username,
        password: this.password
      }
    };

    this.db.sync(this.remote, options);
  }

  // -------------- DBSrvcs METHODS------------------------

  addDoc(doc) {
    // return new Promise((resolve,reject) => {
      console.log("Adding document...");
      this.getDoc(doc._id).then((result) => {
        // console.log("adding document");
        // this.db.put(doc);
        console.log(`Cannot add document ${doc._id}, document already exists.`);
      }).catch((error) => {
        console.log(`Error getting document ${doc._id}`);
        if(error.status == '404') {
          this.db.put(doc)
        }
      })
      // .catch((error) => {
      //   if (error.status = '409') { console.log("Document already exists."); }
      // })
    // })
  }

  getDoc(doc) {
    return new Promise((resolve, reject) => {
      this.db.get(doc).then((result) => {
        console.log(`Got document ${doc}`);
        resolve(result);
      }).catch((error) => {
        if (error.status = '404') { this.addDoc(doc); }
        else { console.log(error) }
        reject(error);
      })
    })
  }

  allDoc() {
    return new Promise(resolve => {

      this.db.allDocs({ include_docs: true })

        .then((result) => {

          this.data = [];
          let docs = result.rows.map((row) => {
            this.data.push(row.doc);
            resolve(this.data);
          });

          this.db.changes({ live: true, since: 'now', include_docs: true })
            .on('change', (change) => { this.hndlChange(change); });

        })

        .catch((error) => { console.log(error); });

    });
  }

  hndlChange(change) {

    this.zone.run(() => {
      let changedDoc = null;
      let changedIndex = null;

      this.data.forEach((doc, index) => {
        if (doc._id === change.id) {
          changedDoc = doc;
          changedIndex = index;
        }
      });

      if (change.deleted) { this.data.splice(changedIndex, 1); }
      else {
        if (changedDoc) { this.data[changedIndex] = change.doc; }
        else { this.data.push(change.doc); }
      }
    });

  }

} // Close exported Class: DBSrvcs
