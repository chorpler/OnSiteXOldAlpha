function (doc) {
	if(doc.client != 'Casa Bonita' && doc.client != 'Star Mobile' && doc.client != 'SESA Fleet Services') {
		emit(doc.client + " (" + doc.city + ")", doc.street + ", " + doc.city + ", " + doc.state + " " + doc.zip);
	}
}

function (doc) {
	if(doc.client != 'Casa Bonita' && doc.client != 'Star Mobile' && doc.client != 'SESA Fleet Services') {
		emit(doc.locname, {"Company": doc.client + " (" + doc.city + ")", "CompanyAddress": doc.street + ", " + doc.city + ", " + doc.state + " " + doc.zip});
	}
}


// sesa-shiftsdb/_design/distinct/_view/shiftsforuser
function(doc) {
	if(typeof doc.user != 'undefined' && typeof doc.employeeNumber != 'undefined') {
		emit(doc.employeeNumber);
	}
}


function (doc) {
	if(doc.employeeNumber) {
		var eNum = parseInt(doc.employeeNumber);
		var strNum = doc.employeeNumber + "";
		var strLen = strNum.length;
		if(!isNaN(eNum) && eNum >= 100000 && strLen <= 6) {
			emit(eNum, {employeeNumber: eNum, firstname: doc.firstname, lastname: doc.lastname});
		}
	}
}


function (doc) {
	var moment = require('views/lib/moment');
	var now = moment();
	if(doc.logStatus == 'in' && doc.shift_start && doc.jobsiteid && doc.sitename && doc.employeeNumber && doc.employee) {
		// var start = moment(doc.shift_start, "YYYY-MM-DD HH:mm:ss ZZ");
		var start = moment(doc.shift_start);
		var days = Math.abs(now.diff(start, 'days', true));
		if(days < 3) {
			emit([doc.jobsiteid, doc.sitename, doc.employeeNumber, doc.employee]);
		}
	}
}

function(doc) {
	var moment = require("views/lib/moment");
	var now = moment();
	if(doc.logStatus == 'in') {
		emit([doc.shift_id, now.toJSON()]);
	}
}


// workorders/uninvoicedworkorders
function(doc) {
  if(doc.wo_number && doc.time_worked && doc.FLAGS) {
    var invoiced = doc.FLAGS.IS_INVOICED;
    var todo     = doc.FLAGS.TO_INVOICE;
    if(todo && !invoiced) {
      emit(doc.onsite_id);
    }
  }
}

// shiftsdb/loggedinusers
function(doc) {
  var moment = require("views/lib/moment");
  if(doc.logStatus == 'in') {
    if(doc.shift_id && doc.shift_start && doc.shift_end && doc.employeeNumber && doc.jobsiteid && doc.sitename) {
      var now = moment();
      var start = moment(doc.shift_start, "YYYY-MM-DD HH:mm:ss ZZ");
      var end   = moment(doc.shift_end,   "YYYY-MM-DD HH:mm:ss ZZ");
      var startplus18 = moment(start).add(18, 'hours');
      if(start.isValid() && end.isValid() && !now.isAfter(startplus18)) {
        emit([doc.sitename, doc.employeeNumber, doc.employee, doc.jobsiteid]);
     }
    }
  }
}

// shiftsdb/loggedinusersbysite
function(doc) {
  var moment = require("views/lib/moment");
  if(doc.logStatus == 'in') {
    if(doc.shift_id && doc.shift_start && doc.shift_end && doc.employeeNumber && doc.jobsiteid && doc.sitename) {
      var now = moment();
      var start = moment(doc.shift_start, "YYYY-MM-DD HH:mm:ss ZZ");
      var end   = moment(doc.shift_end,   "YYYY-MM-DD HH:mm:ss ZZ");
      var startplus18 = moment(start).add(18, 'hours');
      if(start.isValid() && end.isValid() && !now.isAfter(startplus18)) {
        // var days = Math.abs(now.diff(start, 'days', true));
        // if(days < 3) {
          emit(doc.sitename, doc.employeeNumber);
       // }
     }
    }
  }
}



// {
  //  "in-place":
function(doc, req) {
  var field = req.form.;
  var value = req.form.;
  var message = 'set ' + field + ' to ' + value;
  doc[field] = value;
  return [doc, message];
}
// ",
// "in-place-query":
function(doc, req) {
    var field = req.query.field;
    var value = req.query.value;
    var message = 'set ' + field + ' to ' + value;
    doc[field] = value;
    return [doc, message];
}

"validate_doc_update":"function(newDoc, oldDoc, userCtx, secObj) {\n\tvar moment = require('views/lib/moment');\n\tvar now = moment();\n\tif(oldDoc.SERVER_TIMESTAMPS) {\n\t\tnewDoc.SERVER_TIMESTAMPS = oldDoc.SERVER_TIMESTAMPS;\n\t} else {\n\t\tnewDoc.SERVER_TIMESTAMPS = [];\n\t}\n\tvar usr = userCtx.name;\n\tvar access = now.toJSON();\n\tvar obj = {\"user\": usr, \"time\": access}\n\tnewDOC.SERVER_TIMESTAMPS.push(obj);\n}\n"

function (doc) {
  if(doc.employeeNumber && !(doc.firstname.match(/David/i) && doc.lastname.match(/Sargeant/i)) && !((doc.firstname.match(/Michael/i) || doc.firstname.match(/Mike/i)) && doc.lastname.match(/Bates/i))) {
    var eNum = parseInt(doc.employeeNumber);
    var type = doc.jobtype;
    var fname = doc.firstname;
    var lname = doc.lastname;
    var strLen = (eNum+"").length;
    if(!isNaN(eNum) && eNum >= 100000 && strLen <= 6) {
      emit([type, eNum, lname, fname]);
    }
  }
}


{"validate_doc_update": "function(newDoc, oldDoc, userCtx, secObj) {
  var moment = require('views/lib/moment');
  var now = moment();
  if(oldDoc.SERVER_TIMESTAMPS) {
    newDoc.SERVER_TIMESTAMPS = oldDoc.SERVER_TIMESTAMPS;
  } else {
    newDoc.SERVER_TIMESTAMPS = [];
  }
  var usr = userCtx.name;
  var access = now.toJSON();
  var obj = {\"user\": usr, \"time\": access}
  newDOC.SERVER_TIMESTAMPS.push(obj);
}
}

"function(newDoc, oldDoc, userCtx, secObj) { var now = new Date(); if(oldDoc._SERVER_TIMESTAMPS) {  newDoc._SERVER_TIMESTAMPS = oldDoc._SERVER_TIMESTAMPS; } else {  newDoc._SERVER_TIMESTAMPS = []; } var usr = userCtx.name; var access = now.toJSON(); var obj = {'user': usr, 'time': access} newDoc._SERVER_TIMESTAMPS.push(obj);}"

{
  "validate_doc_update": "function(newDoc, oldDoc, userCtx, secObj) {\n  var now = new Date();\n  if(oldDoc._SERVER_TIMESTAMPS) {\n    newDoc._SERVER_TIMESTAMPS = oldDoc._SERVER_TIMESTAMPS;\n  } else {\n    newDoc._SERVER_TIMESTAMPS = [];\n  }\n  var usr = userCtx.name;\n  var access = now.toJSON();\n  var obj = {'user': usr, 'time': access}\n  newDoc._SERVER_TIMESTAMPS.push(obj);\n}"
}

"function(newDoc, oldDoc, userCtx, secObj) {\n  var moment = require('views/lib/moment');\n  var now = moment();\n  if(oldDoc._id.indexOf('_local/') !== -1 || oldDoc._id.indexOf('_design/') !== -1) {\n\n  } else {\n    if(oldDoc._server_) {\n      newDoc._server_ = oldDoc._server_;\n    } else {\n      newDoc._server_ = [];\n    }\n    var usr = userCtx.avatarName;\n    var access = now.toJSON();\n    var obj = {'user': usr, 'time': access}\n    newDoc._server_.push(obj);\n  }\n}"


"function(newDoc, oldDoc, userCtx, secObj) { var now = new Date(); if(oldDoc._SERVER_TIMESTAMPS) {  newDoc._SERVER_TIMESTAMPS = oldDoc._SERVER_TIMESTAMPS; } else {  newDoc._SERVER_TIMESTAMPS = []; } var usr = userCtx.name; var access = now.toJSON(); var obj = {'user': usr, 'time': access} newDoc._SERVER_TIMESTAMPS.push(obj);}"


function(doc) {
  var moment = require('views/lib/moment');
  var now = moment(), reportAt = '';
  if(doc.rprtDate) {
    reportAt = moment(doc.rprtDate, "YYYY-MM-DD");
  }
}



MANGO query examples:

{
  "selector": {
    "$and": [
      {
        "$gte": {
          "_id": "Hachero_000000000000000000"
        }
      },
      {
        "$lte": {
          "_id": "Hachero_ZZZZZZZZZZZZZZZZZZ"
        }
      }
    ]
  }
}

{"selector": {"_id": {"$regex": "Chorpler.Thu18May2017224513" } } }

