import { Injectable } from '@angular/core' ;
import { Http       } from '@angular/http' ;
import 'rxjs/add/operator/map'             ;
import * as PouchDB   from 'pouchdb'       ;

@Injectable()

export class DbService {
  data  : any   ;
  db    : any   ;
  remote: any   ;
  _id   : string;
  osxdoc: any   ;

  constructor(public http: Http) {
    console.log('Hello DbService Provider');
    this.db = new PouchDB('onSiteXDocDb', {auto_compaction : true, revs_limit : 100});
    this.remote = 'https://192.168.0.140/5984/onSiteXDocDb';
    let options = {
      live: true,
      retry: true,
      continuous: true
    };
    this.db.sync(this.remote, options);
  }

  getOnSiteXDocs() {
    if (this.data) { return Promise.resolve(this.data); }
    return new Promise(resolve => {
      this.db.allDocs({ include_docs: true }).then((result) => {
        this.data = [];
        let docs = result.rows.map((row) => { this.data.push(row.doc); });
        resolve(this.data);
        this.db.changes({live: true, since: 'now', include_docs: true})
          .on('change', (change) => { this.handleChange(change); }); })
          .catch((error) => { console.log(error); });
    });
  }

  createOnSiteXDoc(osxdoc: any){
    this.osxdoc._id = new Date().toISOString();
    this.db.put(osxdoc)
  }

  updateOnSiteXDoc(osxdoc: any){
    this.db.put(osxdoc).catch((err) => { console.log(err); });
  }

  deleteOnSiteXDoc(osxdoc: any){
    this.db.remove(osxdoc).catch((err) => { console.log(err); });
  }

  handleChange(change: any){
    let changedDoc   = null;
    let changedIndex = null;
    this.data.forEach((doc, index) => { if(doc._id === change.id) { changedDoc = doc; changedIndex = index; } });
    if(change.deleted)   { this.data.splice(changedIndex, 1);    } // A document was deleted
    else { if(changedDoc){ this.data[changedIndex] = change.doc; } // A document was updated
    else { this.data.push(change.doc); }                         } // A document was added
  }
}
