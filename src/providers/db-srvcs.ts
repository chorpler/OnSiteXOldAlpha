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
    if (typeof doc._id === 'undefined') { doc._id = 'INVALID_DOC' }
    this.getDoc(doc._id).then((result) => {
      // console.log("adding document");
      // this.db.put(doc);
      console.log(`Cannot add document ${doc._id}, document already exists.`);
    }).catch((error) => {
      console.log(`Error getting document ${doc._id}`);
      if (error.status == '404') {
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
      }).catch((error) => { reject(error); })
    })
  }

  checkLocalDoc(docID) {
    return new Promise((resolve, reject) => {
      this.db.get(docID).then((result) => {
        console.log(`Local doc ${docID} exists`);
        resolve(true);
      }).catch((error) => {
        console.log(`Local doc ${docID} does not exist`);
        resolve(false);
        // if (error.status = '404') { 
        //   let doc = { _id: docID };
        //   this.addDoc(doc);

        // }
        // else { console.log(error); }
        // reject(error);
      })
    })
  }

  addLocalDoc(doc) {
    // return new Promise((resolve,reject) => {
    console.log("Attempting to add local document...");
    if (typeof doc._id === 'undefined') { doc._id = 'INVALID_DOC'; };
    // if( typeof doc._rev === 'undefined' ) { doc._rev = '0-1' };
    // this.getDoc(doc._id).then((result) => {
    console.log("Local document to add:");
    console.log(doc);
    return new Promise((resolve, reject) => {
      this.db.get(doc._id).then((res1) => {
        console.log(`Now removing existing local document ${doc._id}`);
        return new Promise((resolveRemove, rejectRemove) => {
          this.db.remove(res1).then((res2) => {
            console.log(`Successfully deleted local doc ${doc._id}, need to add new copy`);
            resolveRemove(res2);
          }).catch((errRemove) => {
            console.log(`Error while removing local doc ${doc._id}.`);
            console.log(doc);
            rejectRemove(errRemove);
          });
        });
      }).then(() => {
        console.log(`Now adding fresh copy of local document ${doc._id}`);
        return this.db.put(doc);
      }).then((success) => {
        console.log(`Successfully deleted and re-saved local document ${doc._id}`);
        resolve(success);
      }).catch((err) => {
        console.log(`Local document ${doc._id} does not exist, saving...`);
        this.db.put(doc).then((final) => {
          console.log(`Local document ${doc._id} was newly saved successfully`);
          resolve(final);
        }).catch((err) => {
          console.log(`Error while saving new copy of local doc ${doc._id}!`);
          console.error(err);
          reject(err);
        })
      })
    })
  // console.log(`adding local document ${doc._id}`);
  // return this.db.put(doc);
  // this.db.put(doc);
  // console.log(`Cannot add document ${doc._id}, document already exists.`);
  // }).catch((error) => {
  // console.log(`Error getting document ${doc._id}`);
  // if(error.status == '404') {
  // this.db.put(doc)
  // }
  // })
  // .catch((error) => {
  //   if (error.status = '409') { console.log("Document already exists."); }
  // })
  // })
}

deleteLocalDoc(doc) {
  console.log("Attempting to delete local document...");
  return new Promise((resolve, reject) => {
    this.db.remove(doc).then((res) => {
      console.log(`Successfully deleted local doc ${doc._id}`);
      resolve(true);
    }).catch((err) => {
      console.log(`Error while deleting local doc ${doc._id}`);
      console.log(doc);
      console.error(err);
      resolve(false);
      // reject(err);
    });
  });
}

purgeLocalTempReport() {
  const tmpID = '_local/tmpReport';

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
