

```json
{
    "_id": "6e1295ed6c29495e54cc05947f18c8af",
    "_rev": "4-e03cdd952833cf36a4affe848f63278d",
    "title": "There is Nothing Left to Lose",
    "artist": "Foo Fighters",
    "year": "1997",
    "_attachments": {
        "Foo_Fighters_-_There_Is_Nothing_Left_to_Lose.jpg": {
            "content_type": "image/jpeg",
            "revpos": 3,
            "digest": "md5-g21CESzD+xqATGG2RdnJ+w==",
            "length": 27864,
            "stub": true
        }
    }
}
```

### Replication
#### local replication:
```curl
curl http: //127.0.0.1:5984/_replicate  -d '{"source":"albums","target":"albums-replica"}'  -H "Content-Type: application/json"
```

```json
{
    "ok": true,
    "no_changes": true,
    "session_id": "27ea19c8069799a5c67bc40a16725326",
    "source_last_seq": "5-g1AAAAHLeJzLYWBg4MhgTmEQTM4vTc5ISXLIyU9OzMnILy7JAUoxJTIkyf___z8rgzmRIRcowJ5mYmpsYpqUwsBZmpeSmpaZl5qCR3uSApBMsoeawAgxIS0pzdjQApsefCY5gEyKR3GLmampQUpKMrFuSQCZUA81gQVsgqGJgYmZcQqJbsljAZIMDUAKaNj8rEQGgmoXQNTuJ0btAYja-8SofQBR-x-oNgsAaZmRJw",
    "replication_id_version": 3,
    "history": [{
        "session_id": "27ea19c8069799a5c67bc40a16725326",
        "start_time": "Fri, 16 Dec 2016 06:51:10 GMT",
        "end_time": "Fri, 16 Dec 2016 06:51:10 GMT",
        "start_last_seq": 0,
        "end_last_seq": "5-g1AAAAHLeJzLYWBg4MhgTmEQTM4vTc5ISXLIyU9OzMnILy7JAUoxJTIkyf___z8rgzmRIRcowJ5mYmpsYpqUwsBZmpeSmpaZl5qCR3uSApBMsoeawAgxIS0pzdjQApsefCY5gEyKR3GLmampQUpKMrFuSQCZUA81gQVsgqGJgYmZcQqJbsljAZIMDUAKaNj8rEQGgmoXQNTuJ0btAYja-8SofQBR-x-oNgsAaZmRJw",
        "recorded_seq": "5-g1AAAAHLeJzLYWBg4MhgTmEQTM4vTc5ISXLIyU9OzMnILy7JAUoxJTIkyf___z8rgzmRIRcowJ5mYmpsYpqUwsBZmpeSmpaZl5qCR3uSApBMsoeawAgxIS0pzdjQApsefCY5gEyKR3GLmampQUpKMrFuSQCZUA81gQVsgqGJgYmZcQqJbsljAZIMDUAKaNj8rEQGgmoXQNTuJ0btAYja-8SofQBR-x-oNgsAaZmRJw",
        "missing_checked": 2,
        "missing_found": 2,
        "docs_read": 2,
        "docs_written": 2,
        "doc_write_failures": 0
    }]
}
```

#### Replication to remote:
Log into remoteDB:

```curl
curl -vX PUT http://SESA_Admin:15GDJ741399M6X3o496B87M07i2NVICG@192.168.0.140:5984/albums-replica
```

Response:

```curl
* STATE: INIT => CONNECT handle 0x20049928; line 1402 (connection #-5000)
* Added connection 0. The cache now contains 1 members
*   Trying 192.168.0.140...
* STATE: CONNECT => WAITCONNECT handle 0x20049928; line 1455 (connection #0)
* Connected to 192.168.0.140 (192.168.0.140) port 5984 (#0)
* STATE: WAITCONNECT => SENDPROTOCONNECT handle 0x20049928; line 1562 (connection #0)
* STATE: SENDPROTOCONNECT => DO handle 0x20049928; line 1580 (connection #0)
* Server auth using Basic with user 'SESA_Admin'
> PUT /albums-replica HTTP/1.1
> Host: 192.168.0.140:5984
> Authorization: Basic U0VTQV9BZG1pbjoxNUdESjc0MTM5OU02WDNvNDk2Qjg3TTA3aTJOVklDRw==
> User-Agent: curl/7.49.1
> Accept: */*
>
* STATE: DO => DO_DONE handle 0x20049928; line 1659 (connection #0)
* STATE: DO_DONE => WAITPERFORM handle 0x20049928; line 1786 (connection #0)
* STATE: WAITPERFORM => PERFORM handle 0x20049928; line 1796 (connection #0)
* HTTP 1.1 or later with persistent connection, pipelining supported
< HTTP/1.1 201 Created
* Server CouchDB/1.6.1 (Erlang OTP/17) is not blacklisted
< Server: CouchDB/1.6.1 (Erlang OTP/17)
< Location: http://192.168.0.140:5984/albums-replica
< Date: Fri, 16 Dec 2016 07:17:09 GMT
< Content-Type: text/plain; charset=utf-8
< Content-Length: 12
< Cache-Control: must-revalidate
<
{"ok":true}
* STATE: PERFORM => DONE handle 0x20049928; line 1955 (connection #0)
* multi_done
* Connection #0 to host 192.168.0.140 left intact
* Expire cleared
```

Send Replication command:

```curl
curl http://127.0.0.1:5984/_replicate -d '{"source":"albums","target":"http://192.168.0.140:5984/albums-replica"}' -H "Content-Type:application/json"
```

```json
{
    "ok": true,
    "session_id": "c82b9e2924d1d7663694f121d4244227",
    "source_last_seq": "5-g1AAAAH_eJyVzksOgjAQBuBRSNSlJ9AjgG2RndxE-0wlFRbKWm-iN9Gb6E1qsSRqYhA206Qz881vAGCsAwFTXlZcC5aZklOjy_3BuNaQAptZa3MdUNi5j5HCBGHCBEyqQki1LaRoWWdzV9mqEQZeUEyhOP210yZltbT-ypIQEgnBu2bZ1MKxEcKXEOMIJ0j0zFKErsLJPQ47f-RJMUpl0jGPVy5eueYU_s7e_Oz9fXEhlzxVUa-LD69YdzF_AtpEnso",
    "replication_id_version": 3,
    "history": [{
        "session_id": "c82b9e2924d1d7663694f121d4244227",
        "start_time": "Fri, 16 Dec 2016 07:20:45 GMT",
        "end_time": "Fri, 16 Dec 2016 07:20:45 GMT",
        "start_last_seq": 0,
        "end_last_seq": "5-g1AAAAH_eJyVzksOgjAQBuBRSNSlJ9AjgG2RndxE-0wlFRbKWm-iN9Gb6E1qsSRqYhA206Qz881vAGCsAwFTXlZcC5aZklOjy_3BuNaQAptZa3MdUNi5j5HCBGHCBEyqQki1LaRoWWdzV9mqEQZeUEyhOP210yZltbT-ypIQEgnBu2bZ1MKxEcKXEOMIJ0j0zFKErsLJPQ47f-RJMUpl0jGPVy5eueYU_s7e_Oz9fXEhlzxVUa-LD69YdzF_AtpEnso",
        "recorded_seq": "5-g1AAAAH_eJyVzksOgjAQBuBRSNSlJ9AjgG2RndxE-0wlFRbKWm-iN9Gb6E1qsSRqYhA206Qz881vAGCsAwFTXlZcC5aZklOjy_3BuNaQAptZa3MdUNi5j5HCBGHCBEyqQki1LaRoWWdzV9mqEQZeUEyhOP210yZltbT-ypIQEgnBu2bZ1MKxEcKXEOMIJ0j0zFKErsLJPQ47f-RJMUpl0jGPVy5eueYU_s7e_Oz9fXEhlzxVUa-LD69YdzF_AtpEnso",
        "missing_checked": 2,
        "missing_found": 2,
        "docs_read": 2,
        "docs_written": 2,
        "doc_write_failures": 0
    }]
}
```


### Users

```json
{
  "_id": "org.couchdb.user:onsiteuser",
  "name": "onsiteuser",
  "password": "sesatech",
  "roles": [],
  "type": "user"
}
```

### Test Report
```json
{
    "tech": "Peña, Jesus",
    "client":"Halliburton Brownfield",
    "Job Class":"E-TECH",
    "Date":"12/13/16",
    "Strt":"7:00",
    "End":"8:00",
    "Hrs":"1:00",
    "woNum": 315532679,
    "uNum": 12467753,
    "notes":"Welding disconnect"
}
```

### Setup Users
 1. create DB: tmp
 2. create user: onsiteuser:sesatech
 3. assign onsiteuser admin to tmp DB
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
