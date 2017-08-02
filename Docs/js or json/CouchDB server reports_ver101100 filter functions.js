function(doc, req) {
  var name = req.query.username;
  var startDate = req.query.start || "1900-01-01";
  var endDate = req.query.end || "9999-12-31";
  return doc.username === name && doc.rprtDate >= startDate && doc.rprtDate <= endDate;
}

function(doc, req) {
  var name = req.query.username;
  return doc.username === name;
}

var designDoc = {
  "filters": {
    "forTechDate": "function(doc, req) {\r\n\tvar name = req.query.username;\r\n\tvar startDate = req.query.start || \"1900-01-01\";\r\n\tvar endDate = req.query.end || \"9999-12-31\";\r\n\treturn doc.username === name && doc.rprtDate >= startDate && doc.rprtDate <= endDate;\r\n}",
    "forTech": "function(doc, req) {\r\n\tvar name = req.query.username;\r\n\treturn doc.username === name;\r\n}"
  }
}