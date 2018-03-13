// var xl2m = function(xlDate) {
  // let XLArray = [1900, 0, 1, 0, 0, 0];
  // let XLDay0 = moment.utc(XLArray);
  // let now = moment();
  // let value = xlDate;
  // var daysInMilliseconds = moment.duration(moment.duration(value - 2, 'days').asMilliseconds());
  // let outMoment = moment(XLDay0).add(daysInMilliseconds);
  // let offset = moment(now).utcOffset();
  // let newMoment = moment(outMoment).utcOffset(offset, true);
var xl2m = function(xlDate) {
  let tmp1 = moment.fromOADate(xlDate);
  let tmp2 = moment(tmp1).format("YYYY-MM-DDTHH:mm:ss.SSS");
  let tmp3 = moment(tmp2);
  return tmp3;
};

var m2xl = function() {
  // let now = moment();
  let now = moment(this);
  let offset = now.offset();
  let xl1 = now.toOADate();
  let n2 = moment.fromOADate(xl1);
  let n3 = moment(n2);
  let n4 = n3.utcOffset(offset);
  let momentString = n4.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  let n5 = moment.utc(momentString); n5.toOADate();
}
