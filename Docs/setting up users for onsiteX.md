# Users: OnSiteX

### Setup Users

1. create DB: tmp
2. create user: onsiteuser:sesatech

```json
{
  "_id": "org.couchdb.user:onsiteuser",
  "name": "onsiteuser",
  "password": "sesatech",
  "roles": [],
  "type": "user"
}
```

3. assign onsiteuser admin to tmp DB
  - go to DB "tmp" via Fauxton and select permissions
  - add onsiteuser in `users` in the `Admins` section
4. new app users create doc in tmp using onsiteuser

```json
{
    "name":"userName",
    "tech":"lastName, firstName",
    "firstName":"firstName",
    "lastName":"lastName",
    "password":"password",
    "etc.":"... additional user info in key_value pairs"
}
```

5. _id and _rev are generated
6. in Console, the doc is duplicated minus the _id and _rev
7. in console, new user is posted in DB `_users` with `"_id": "org.couchdb.user:username"`
8. possibly add username to users in DB `reports` (not sure if this is necessary... will test)


#### validated_users DB

```js
  userToken = {
    _id: "",
    : 
    message: "Valid User Connected"
  }
```


`_id: userUuid`
`userUuid = lastName + uidString1 + firstName`


1. local storage: check if user exists in local storage,
  - if user exists, verify user (if connection exists) then go to HomePage
  - if user does not exist or if validation fails show login
  - user enters username/pass 
    - store/update user/pass in localStorage
    - if connection exists, validate user


```
App Start ->   check local storage for userToken 
  if(token)
    ┝───  TRUE
    |      ┝───  if(validated)  ───  go to HomePage
    |      └───  if(pending)
    |                └───  check connection
    |                        └───  if(connection)
    |                                    └───  validate
    |                                              ┝───  if(!validated)  error msg  Show LoginPage (form)
    |                                              └───  if(validated)  set validated = TRUE  Go To HomePage
    |
    └───  FALSE
          └───  show LoginPage     //  user enters uname/pass
            ┝───  if(connection)  validate
            |     ┝───  if(!validated)  ──  error msg  show LoginPage
            |     |
            |     └───  if(validated)  ──  set validated = TRUE  ──  Store/Update userToken
            |
            └───  if(!connection)  store token    ──  set validated = pending  ──  Store user Token
```

```js
/**

export interface userToken {
  _id: userUuid;
  userName: OSXU.name;
  password: ISXU.password;
  tokenStatus: VALIDSTATE;
  message: TOKENMSG;
}

export enum VALIDSTATE {
  'invalid' = 0,
  'pending' = 1,
  'valid'   = 2
}

import { NativeStorage } from 'ionic-native';

NativeStorage.setItem('myitem', {property: 'value', anotherProperty: 'anotherValue'})
  .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
  );

NativeStorage.getItem('myitem')
  .then(
    data => console.log(data),
    error => console.error(error)
  );
 */

  checkToken() {
    if(NativeStorage.getItem('userToken')){
      NativeStorage.getItem('userToken')
      .then(if(userToken.tokenStatus === VALIDSTATE[2]) { openPage(HomePage) { this.nav.setRoot(HomePage); } })
    }
  }

```

