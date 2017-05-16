export var REGXMMM = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/;
export var REGXDDD = /(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/;
export var REGXDAY = /\d{2}(?=\s\d{4}\s)/;
export var REGXYEAR = /\d{4}(?=\s\d{2}:)/;
export var REGXHOUR = /\d{2}(?=:\d{2}:\d{2})/;
export var REGXMIN = /\d{2}(?=:\d{2}\s)/;
export var REGXSEC = /\d{2}(?=\s\D{3}-)/;
export var REGXTIME = /\d{2}:\d{2}:\d{2}(?=\s\D{3}-)/;
export var XGMTOFFSET = /\D{3}-\d*(?=\s\()/;
export var XTIMEZONE = /\(\D*\s*(?=)/;
export var MONTH;
(function (MONTH) {
    MONTH[MONTH["Jan"] = 1] = "Jan";
    MONTH[MONTH["Feb"] = 2] = "Feb";
    MONTH[MONTH["Mar"] = 3] = "Mar";
    MONTH[MONTH["Apr"] = 4] = "Apr";
    MONTH[MONTH["May"] = 5] = "May";
    MONTH[MONTH["Jun"] = 6] = "Jun";
    MONTH[MONTH["Jul"] = 7] = "Jul";
    MONTH[MONTH["Aug"] = 8] = "Aug";
    MONTH[MONTH["Sep"] = 9] = "Sep";
    MONTH[MONTH["Oct"] = 10] = "Oct";
    MONTH[MONTH["Nov"] = 11] = "Nov";
    MONTH[MONTH["Dec"] = 12] = "Dec";
})(MONTH || (MONTH = {}));
//# sourceMappingURL=config.date.object.onsite.js.map