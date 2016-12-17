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
