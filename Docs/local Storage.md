How to: *

Check if localStorage is supported
Check if localStorage has an Item
Get the amount of space left in localStorage
Get the maximum amount of space in localStorage
Get the used space in localStorage
Get a Backup of localStorage
Apply a Backup to localStorage
Dump all information of localStorage in the console
*check the answers below

FAQ:

[link](http://stackoverflow.com/q/2010892/4339170) How to store Objects in localStorage
[link](http://stackoverflow.com/q/3357553/4339170) How to store an Array in localStorage
[link](http://stackoverflow.com/q/19183180/4339170) How to save an Image in localStorage
[link](http://www.sitepoint.com/an-overview-of-the-web-storage-api/) localStorage Tutorial (also covers storage events and things to remember)
Related:

[link](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) General Information about Web Storage
[link](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) sessionStorage data stored gets cleared when the page session ends
[link](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) indexedDB a low-level API for client-side storage of structured data

[Storing Objects in HTML5 localStorage](http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage?noredirect=1&lq=1)

isSupported
hasItem(key)
getSpaceLeft()
getMaximumSace()
getUsedSpace()
getItemUsedSpace()
getBackup()
applyBackup(backup, fClear, fOverwriteExisting)
consoleInfo(fShowMaximumSize)

The complete code as LocalStorage-Module on GitHubGist: JavaScript and TypeScript
Live example: on JSFiddle


Check if localStorage is supported - TypeScript-Version

/**
  * Flag set true if the Browser supports localStorage, without affecting it
  */
var localStorage_isSupported = (function () {
    try {
        var itemBackup = localStorage.getItem("");
        localStorage.removeItem("");
        localStorage.setItem("", itemBackup);
        if (itemBackup === null)
            localStorage.removeItem("");
        else
            localStorage.setItem("", itemBackup);
        return true;
    }
    catch (e) {
        return false;
    }
})();

Check if localStorage has an Item - TypeScript-Version

/**
 * Check if localStorage has an Item / exists with the give key
 * @param key the key of the Item
 */
function localStorage_hasItem(key) {
    return localStorage.getItem(key) !== null;
}

Get the amount of space left in localStorage - TypeScript-Version

/**
 * This will return the left space in localStorage without affecting it's content
 * Might be slow !!!
 */
function localStorage_getRemainingSpace() {
    var itemBackup = localStorage.getItem("");
    var increase = true;
    var data = "1";
    var totalData = "";
    var trytotalData = "";
    while (true) {
        try {
            trytotalData = totalData + data;
            localStorage.setItem("", trytotalData);
            totalData = trytotalData;
            if (increase)
                data += data;
        }
        catch (e) {
            if (data.length < 2) {
                break;
            }
            increase = false;
            data = data.substr(data.length / 2);
        }
    }
    if (itemBackup === null)
        localStorage.removeItem("");
    else
        localStorage.setItem("", itemBackup);
    return totalData.length;
}

Get the maximum amount of space in localStorage - TypeScript-Version

/**
 * This function returns the maximum size of localStorage without affecting it's content
 * Might be slow !!!
 */
function localStorage_getMaximumSize() {
    var backup = localStorage_getBackup();
    localStorage.clear()
    var max = localStorage_getSizeLeft();
    localStorage_applyBackup(backup);
    return max;
}

Get the used space in localStorage - TypeScript-Version

/**
 * This will return the currently used size of localStorage
 */
function localStorage_getUsedSize() {
    var sum = 0;
    for (var i = 0; i < localStorage.length; ++i) {
        var key = localStorage.key(i)
        var value = localStorage.getItem(key);
        sum += key.length + value.length;
    }
    return sum;
}

Get the space used my an Item TypeScript-Version

/**
 * This will return the currently used size of a given Item,returns NaN if key is not found
 * @param key
 */
function getItemUsedSpace(key) {
    var value = localStorage.getItem(key);
    if (value === null) {
        return NaN;
    }
    else {
        return key.length + value.length;
    }
}

Backup Assosiative Array, only TypeScript-Version


Get a Backup of localStorage - TypeScript-Version

/**
 * This will return a localStorage-backup (Associative-Array key->value)
 */
function localStorage_getBackup() {
    var backup = {};
    for (var i = 0; i < localStorage.length; ++i) {
        var key = localStorage.key(i);
        var value = localStorage.getItem(key);
        backup[key] = value;
    }
    return backup;
}

Apply a Backup to localStorage - TypeScript-Version

/**
 * This will apply a localStorage-Backup (Associative-Array key->value)
 * @param backup            associative-array 
 * @param fClear             optional flag to clear all existing storage first.Default:true
 * @param fOverwriteExisting optional flag to replace existing keys. Default: true
 */
function localStorage_applyBackup(backup, fClear, fOverwriteExisting) {
    if (fClear === void 0) { fClear = true; }
    if (fOverwriteExisting === void 0) { fOverwriteExisting = true; }
    if (fClear == true) {
        localStorage.clear();
    }
    for (var key in backup) {
        if (fOverwriteExisting === false && backup[key] !== undefined) {
            continue;
        }
        var value = backup[key];
        localStorage.setItem(key, value);
    }
}

Dump all information of localStorage in the console - TypeScript-Version

/**
 * This functions dumps all keys and values of the local Storage to the console,
 * as well as the current size and number of items
 * @param fShowMaximumSize optional, flag show maximum size of localStorage. Default: false
 */
function localStorage_consoleInfo(fShowMaximumSize) {
    if (fShowMaximumSize === void 0) { fShowMaximumSize = false; }
    var amount = 0;
    var size = 0;
    for (var i = 0; i < localStorage.length; ++i) {
        var key = localStorage.key(i)
        var value = localStorage.getItem(key);
        console.log(amount, key, value);
        size += key.length + value.length;
        amount++;
    }
    console.log("Total entries:", amount);
    console.log("Total size:", size);
    if (fShowMaximumSize === true) {
        var maxSize = localStorage_getMaximumSize();
        console.log("Total size:", maxSize);
    }
}
Notes

Each key and value is using the exact amount of space equal to its string length
The maximum storage-space allowed in my tests: ~5MB
5000000 Edge
5242880 Chrome
5242880 Firefox
5000000 IE
Firefox issue: Don't use for (var key in localStorage) but:  for (var i = 0; i < localStorage.length; ++i) { var key = localStorage.key(i). The for..in-loop it would give the localStorage Memberfunctions as keys
// Example - http://jsfiddle.net/1rqtd7pg/1/

console.log("LocalStorage supported:", LocalStorage.isSupported)
// true - I hope so anyways 😉
if(LocalStorage.isSupported) {
    localStorage.setItem("asd", "ASDASD")                           
    // sets / overwrites the item "asd"
    localStorage.setItem("asd" + Math.random(), "ASDASD")           
    // set another item each time you refresh the page
    var backup = LocalStorage.getBackup()                           
    // creates a backup, we will need it later!
    console.log(JSON.stringify(backup))                             
    // this is how the backup looks like
    var usedSpace = LocalStorage.getUsedSpace()                     
    // amount of space used right now
    console.log("Used Space:", usedSpace)
    var maxSpace = LocalStorage.getMaximumSpace()                   
    // amount of maximum space aviable
    console.log("Maximum Space:", maxSpace)
    var remSpace = LocalStorage.getRemainingSpace()                 
    // amount of remaining space
    console.log("Remaining Space:", remSpace)
    console.log("SpaceCheck", maxSpace === usedSpace + remSpace)    
    // true
    console.log("hasItem", LocalStorage.hasItem("nothis0ne"))       
    // we don't have this one in our localStorage
    localStorage.clear()                                            
    // oops, we deleted the localStorage!
    console.log("has asd", LocalStorage.hasItem("asd"))              
    // item asd is lost 😒
    LocalStorage.applyBackup(backup)                                
    // but we have a backup, restore it!
    LocalStorage.consoleInfo()                                      
    // show all the info we have, see the backup worked 😊
}