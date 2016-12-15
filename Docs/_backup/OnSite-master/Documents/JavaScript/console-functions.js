// Console functions 2015-09-21
var fileurl = "file:///Users/dave/dl/art.jpg"; var couchurl = "https://securedb.sesaonsite.com:7984/atest-test/test001/art.jpg"; var headers = {'Authorization': 'Basic ' + base64.encodeText('admin:starmobile'), 'Content-Type': 'image/jpeg'}; var ulobj = {url: couchurl, file: fileurl, method: 'PUT', headers: headers}; var prog = function(e) { var perc = Math.round(100*(e.loaded/e.total)); var fname = e.config.file.name; Log.l("UL progress on file '%s': %d%%", fname, perc);}; var success = function(data, status, headers, config) { var fname = config.file.name; Log.l("UL file '%s' done. Response:", fname); Log.l(data); };

var dlurl = "http://www.h-schmidt.net/map/download/world_shaded_43k.jpg"; var targetPath = cordova.file.documentsDirectory + "world.jpg"; var trust = true; var options = {}; var innerfunc = function(e) { var perc = Math.round(100.0*e.loaded / e.total); Log.l("Progress: %d%%", perc);}; var asyncprogress = function(e) { var tout = null; if(window.cordova && $timeout) { tout = $timeout;} else { tout = window.setTimeout;} tout(innerFunc(e)); };
CFT.download(dlurl, targetPath, options, trust).then(t1, c1, asyncprogress)


var change = function(change) {
	Log.l("DB changed:\n%s", vuvuzela.stringify(change));
	Log.l(change);
};
var complete = function(info) {
	Log.l("DB changes() was canceled.");
	Log.l(info);
};
var error = function(err) {
	Log.l("DB changes error!");
	Log.e(err);
};

var change = function(change) { 	Log.l("DB changed:\n%s", vuvuzela.stringify(change)); 	Log.l(change); }; var complete = function(info) { 	Log.l("DB changes() was canceled."); 	Log.l(info); }; var error = function(err) { 	Log.l("DB changes error!"); 	Log.e(err); };  


var picsrv = rs.dbs.picturesdb; var picdbyng = picsrv.db(); var picdb = picsrv.directdb(); var rpicdb = rs.rdb.picturesdb; var opt = {live: true, include_docs: false}; var picchanges = picdb.changes(opt).on('change', change).on('complete', complete).on('error', error);

Upload.http({
	url: 'https://securedb.sesaonsite.com:7984/sesa-picturesdb/testpics1/bkgimg.jpg',
	headers : {
		'Content-Type': ifile.type
	},
	data: ifile
})

var ulopt = { url: 'https://securedb.sesaonsite.com:7984/sesa-picturesdb/testpics3/bkgimg.jpg', headers : {  'Content-Type': ifile.type }, method: 'PUT', data: ifile};

Upload.http()


var authhdr = "Basic " + base64.encodeText('sesatech:sesatech3onsite');
var ulprog = function(e) {
	var percent = 0;
	if (e.lengthComputable) {
		if (typeof e.loaded == 'number' && typeof e.total == 'number') {
			percent = Math.round((e.loaded / e.total) * 100);
			Log.l("Upload progress (%020d / %020d): %d", e.loaded, e.total, percent);
		}
	}
};
var ulurl = 'https://securedb.sesaonsite.com:7984/sesa-picturesdb/testpics4/bkgimg.jpg';
var req = new XMLHttpRequest();
req.upload.onprogress = ulprog;
req.open("PUT", ulurl);
req.setRequestHeader("Content-type", ifile.type);
req.setRequestHeader("Authorization", authhdr);
req.onload = function(event) {
	Log.l("XHR Onload!");
	Log.l(event);
};

 
req.send(ifile);
req.onprogress = function(e) { Log.l("XHR Progress!"); Log.l(e);}; 

var ulprog = function(e) {
	var percent = 0;
	if(e.lengthComputable) {
		if(typeof e.loaded == 'number' && typeof e.total == 'number') {
			percent = Math.round((e.loaded / e.total) * 100);
			Log.l("Upload progress (%020d / %020d): %d", percent);
		}
	}
}

var ulprog = function(e) {  var percent = 0;  if(e.lengthComputable) {   if(typeof e.loaded == 'number' && typeof e.total == 'number') {    percent = Math.round((e.loaded / e.total) * 100);    Log.l("Upload progress (%020d / %020d): %d", percent);   }  } }  