import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as PouchDB2 from 'pouchdb';
import * as pdbAuth from 'pouchdb-authentication';
import * as pdbUpsert from 'pouchdb-upsert';

@Injectable()

/**
 * @class DBSrvcs
 *        methods [ addDoc, getDoc, allDoc, hndlChange ]
 */
export class DBSrvcs {

  data     : any;
  db       : any;
  username : any;
  password : any;
  remote   : any;
  PouchDB  : any;
  remoteDB : any;

  constructor(public http: Http, public zone: NgZone) {
    this.PouchDB = require("pouchdb");
    this.PouchDB.plugin(require('pouchdb-upsert'));
    this.PouchDB.plugin(require('pouchdb-authentication'));

    window["PouchDB"] = this.PouchDB; // Dev: reveals PouchDB to PouchDB Inspector
    this.db = new this.PouchDB('reports');
    // this.username = 'sesatech';
    // this.password = 'sesatech';
    // this.remote    = 'http://martiancouch.hplx.net/reports' ;
    // this.remote = 'http://192.168.0.140:5984/reports';


    this.remote = 'http://162.243.157.16/reports';

    let options = {
      live: true,
      retry: true,
      continuous: true,
      auth: {
        username: this.username,
        password: this.password
      }
    };

    // this.db.sync(this.remote, options);
  }

  // -------------- DBSrvcs METHODS------------------------

  addDoc(doc) {
    return new Promise((resolve,reject) => {
      console.log("Adding document...");
      console.log(doc);
      if (typeof doc._id === 'undefined') { doc._id = 'INVALID_DOC' }
      this.getDoc(doc._id).then((result) => {
        // console.log("adding document");
        // this.db.put(doc);
        console.log(`Cannot add document ${doc._id}, document already exists.`);
        console.log(result);
        reject('Doc exists');
      }).catch((error) => {
        console.log(`addDoc(): Could not get document ${doc._id}, hopefully it does not exist...`);
        if (error.status == '404') {
          this.db.put(doc).then((res) => {
            console.log("addDoc(): Successfully added document.");
            console.log(res);
            resolve(res);
          }).catch((err) => {
            console.log("addDoc(): Failed while trying to add document (after 404 error in get)");
            console.error(err);
            reject(err);
          });
        } else {
          console.log("addDoc(): Some other error occurred.");
          console.error(error);
          reject(error);
        }
      })
      // .catch((error) => {
      //   if (error.status = '409') { console.log("Document already exists."); }
      // })
      // })
    });
  }

  getDoc(docID) {
    return new Promise((resolve, reject) => {
      this.db.get(docID).then((result) => {
        console.log(`Got document ${docID}`);
        resolve(result);
      }).catch((error) => {
        console.log("Error in DBSrvcs.getDoc()!");
        console.error(error);
        reject(error);
      });
    });
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

  addLocalDoc(newDoc) {
    // return new Promise((resolve,reject) => {
    console.log("Attempting to add local document...");
    // if (typeof doc._id === 'undefined') { doc._id = 'INVALID_DOC'; };
    // if( typeof doc._rev === 'undefined' ) { doc._rev = '0-1' };
    // this.getDoc(doc._id).then((result) => {
    console.log("Local document to add:");
    console.log(newDoc);
    return new Promise((resolve, reject) => {
      this.db.get(newDoc._id).then((res1) => {
        console.log(`Now removing existing local document ${newDoc._id}`);
        return new Promise((resolveRemove, rejectRemove) => {
          let strID  = res1._id;
          let strRev = res1._rev;
          this.db.remove(strID, strRev).then((res2) => {
            console.log(`Successfully deleted local doc ${newDoc._id}, need to add new copy`);
            resolveRemove(res2);
          }).catch((errRemove) => {
            console.log(`Error while removing local doc ${newDoc._id}.`);
            console.log(newDoc);
            rejectRemove(errRemove);
          });
        });
      }).then(() => {
        if(typeof newDoc._rev == 'string') { delete newDoc._rev;}
        console.log(`Now adding fresh copy of local document ${newDoc._id}`);
        return this.db.put(newDoc);
      }).then((success) => {
        console.log(`Successfully deleted and re-saved local document ${newDoc._id}`);
        resolve(success);
      }).catch((err) => {
        console.log(`Local document ${newDoc._id} does not exist, saving...`);
        if(typeof newDoc._rev == 'string') { delete newDoc._rev;}
        this.db.put(newDoc).then((final) => {
          console.log(`Local document ${newDoc._id} was newly saved successfully`);
          resolve(final);
        }).catch((err) => {
          console.log(`Error while saving new copy of local doc ${newDoc._id}!`);
          console.warn(err);
          // reject(err);
          resolve(null);
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

saveTechProfile(doc) {
  console.log("Attempting to save local techProfile...");
  // let updateFunction = (original) => {}
  doc._id = '_local/techProfile';
  return new Promise((resolve,reject) => {
    this.getTechProfile().then((res) => {
      console.log("saveTechProfile(): About to process old and new:");
      console.log(res);
      console.log(doc);
      // let oldTechProfile = res;
      // let profileChanges = doc;
      var strID  = res['_id'];
      var strRev = res['_rev'];
      let newProfileDoc  = {...res, ...doc, "_id": strID, "_rev": strRev };
      console.log("saveTechProfile(): Merged profile is:");
      console.log(newProfileDoc);
      console.log("saveTechProfile(): now attempting save...");
      return this.addLocalDoc(newProfileDoc);
    }).then((res) => {
      console.log("saveTechProfile(): Saved updated techProfile");
      resolve(res);
    }).catch((err) => {
      console.log("saveTechProfile(): Error merging or saving profile!");
      console.error(err);
      reject(err);
    });
  });
}

 getTechProfile() {
   let documentID = "_local/techProfile";
   return new Promise((resolve, reject) => {
     return this.checkLocalDoc(documentID).then((res) => {
       console.log("techProfile exists, reading it in...");
       return this.getDoc(documentID);
     }).then((res) => {
        console.log("techProfile read successfully:");
        console.log(res);
        resolve(res);
        // this.techProfile = res;
      }).catch((err) => {
        console.log("techProfile not found, user not logged in.");
        console.error(err);
        reject(err);
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
