
#Update Reports

```js

updateReport(){
    DBSrvcs.db.put(doc).then((res) => {
      console.log("addDoc(): Successfully added document.");
      console.log(res);
      resolve(res);
    }).catch((err) => {
      console.log("addDoc(): Failed while trying to add document (after 404 error in get)");
      console.error(err);
      reject(err);
    });
}


```
