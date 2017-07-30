curl -X PUT http://admin:starmobile@127.0.0.1:25984/_users
curl -X PUT http://admin:starmobile@127.0.0.1:25984/_replicator
curl -X PUT http://admin:starmobile@127.0.0.1:25984/_global_changes


curl -o reports_ver101100.json  "http://admin:starmobile@127.0.0.1:5984/reports_ver101100/_all_docs?include_docs=true"
curl -o reports.json            "http://admin:starmobile@127.0.0.1:5984/reports/_all_docs?include_docs=true"
curl -o sesa-reports-other.json "http://admin:starmobile@127.0.0.1:5984/sesa-reports-other/_all_docs?include_docs=true"
curl -o sesa-employees.json     "http://admin:starmobile@127.0.0.1:5984/sesa-employees/_all_docs?include_docs=true"
curl -o sesa-config.json        "http://admin:starmobile@127.0.0.1:5984/sesa-config/_all_docs?include_docs=true"
curl -o sesa-jobsites.json      "http://admin:starmobile@127.0.0.1:5984/sesa-jobsites/_all_docs?include_docs=true"
curl -o sesa-scheduling.json    "http://admin:starmobile@127.0.0.1:5984/sesa-scheduling/_all_docs?include_docs=true"
curl -o sesa-technicians.json   "http://admin:starmobile@127.0.0.1:5984/sesa-technicians/_all_docs?include_docs=true"
curl -o sesa-messages.json      "http://admin:starmobile@127.0.0.1:5984/sesa-messages/_all_docs?include_docs=true"

curl -o reports_ver101100.json  "http://admin:starmobile@127.0.0.1:25984/reports_ver101100"
curl -o reports.json            "http://admin:starmobile@127.0.0.1:25984/reports"
curl -o sesa-reports-other.json "http://admin:starmobile@127.0.0.1:25984/sesa-reports-other"
curl -o sesa-employees.json     "http://admin:starmobile@127.0.0.1:25984/sesa-employees"
curl -o sesa-config.json        "http://admin:starmobile@127.0.0.1:25984/sesa-config"
curl -o sesa-jobsites.json      "http://admin:starmobile@127.0.0.1:25984/sesa-jobsites"
curl -o sesa-scheduling.json    "http://admin:starmobile@127.0.0.1:25984/sesa-scheduling"
curl -o sesa-technicians.json   "http://admin:starmobile@127.0.0.1:25984/sesa-technicians"
curl -o sesa-messages.json      "http://admin:starmobile@127.0.0.1:25984/sesa-messages"

curl -X PUT "http://admin:starmobile@127.0.0.1:25984/reports_ver101100"
curl -X PUT "http://admin:starmobile@127.0.0.1:25984/reports"
curl -X PUT "http://admin:starmobile@127.0.0.1:25984/sesa-reports-other"
curl -X PUT "http://admin:starmobile@127.0.0.1:25984/sesa-employees"
curl -X PUT "http://admin:starmobile@127.0.0.1:25984/sesa-config"
curl -X PUT "http://admin:starmobile@127.0.0.1:25984/sesa-jobsites"
curl -X PUT "http://admin:starmobile@127.0.0.1:25984/sesa-scheduling"
curl -X PUT "http://admin:starmobile@127.0.0.1:25984/sesa-technicians"
curl -X PUT "http://admin:starmobile@127.0.0.1:25984/sesa-messages"


['reports_ver101100', 'reports', 'sesa-reports-other', 'sesa-sounds', 'sesa-employees', 'sesa-config', 'sesa-jobsites', 'sesa-scheduling', 'sesa-technicians', 'sesa-messages']
