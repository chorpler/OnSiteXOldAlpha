import { InMemoryDbService } from 'angular-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let testUsers = [
      {
        "_id": "org.couchdb.user:Hachero",
        "_rev": "1-561e1b7fef67905cbd5cb957df5c4e62",
        "type": "user",
        "roles": [],
        "avatarName": "Hachero",
        "avtrNameAsUser": true,
        "name": "Hachero",
        "firstName": "Jesus",
        "lastName": "Peña",
        "email": "jpena@sesafleetservices.com",
        "userClass": "E-TECH",
        "clntCmpny": "HALLIBURTON ",
        "loc1": "BROWNFIELD",
        "loc2": "",
        "pyrlClass": "BILLABLE",
        "password_scheme": "pbkdf2",
        "iterations": 10,
        "derived_key": "b40c2acf537983200c53fe706d86f37a5693a5c1",
        "salt": "d7c86cb4c43d84c0184ca77931c642a4"
      },
      {
        "_id": "org.couchdb.user:Hachera",
        "_rev": "1-561e1b7fef67905cbd5cb957df5c4e62",
        "type": "user",
        "roles": [],
        "avatarName": "Hachera",
        "avtrNameAsUser": true,
        "name": "Hachera",
        "firstName": "Michelle",
        "lastName": "Bates",
        "email": "michelle@sesafleetservices.com",
        "userClass": "M-TECH",
        "clntCmpny": "SESA",
        "loc1": "WESLACO",
        "loc2": "SHOP",
        "pyrlClass": "EXPNSLABOR",
        "password_scheme": "pbkdf2",
        "iterations": 10,
        "derived_key": "b40c2acf537983200c53fe706d86f37a5693a5c1",
        "salt": "d7c86cb4c43d84c0184ca77931c642a4"
      }
    ];
    return { testUsers };
  }
}
