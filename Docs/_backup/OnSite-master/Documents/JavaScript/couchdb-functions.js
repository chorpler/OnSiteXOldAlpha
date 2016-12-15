// {
	//	"in-place":
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

// "validate_doc_update":"function(newDoc, oldDoc, userCtx, secObj) {\n\tvar moment = require('views/lib/moment');\n\tvar now = moment();\n\tif(oldDoc.SERVER_TIMESTAMPS) {\n\t\tnewDoc.SERVER_TIMESTAMPS = oldDoc.SERVER_TIMESTAMPS;\n\t} else {\n\t\tnewDoc.SERVER_TIMESTAMPS = [];\n\t}\n\tvar usr = userCtx.name;\n\tvar access = now.toJSON();\n\tvar obj = {\"user\": usr, \"time\": access}\n\tnewDOC.SERVER_TIMESTAMPS.push(obj);\n}\n"

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
