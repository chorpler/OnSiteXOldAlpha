var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { REGXMMM, REGXDDD } from '../config/config.date.object.onsite';
import { REGXMIN, REGXSEC } from '../config/config.date.object.onsite';
import { REGXDAY, REGXYEAR } from '../config/config.date.object.onsite';
import { XGMTOFFSET, XTIMEZONE } from '../config/config.date.object.onsite';
import { REGXTIME, REGXHOUR } from '../config/config.date.object.onsite';
var TimeSrvc = (function () {
    function TimeSrvc() {
        this._arrD = [];
        console.log('Hello TimeSrvc Provider');
    }
    TimeSrvc.prototype.getParsedDate = function () {
        this.date = Date();
        this.date;
        this.dstr = this.date.toString();
        var prsMonth = REGXMMM.exec(this.dstr);
        this.month = prsMonth[0];
        var prsWeekday = REGXDDD.exec(this.dstr);
        this.weekDay = prsWeekday[0];
        var prsMday = REGXDAY.exec(this.dstr);
        this.mDay = prsMday[0];
        var prsYear = REGXYEAR.exec(this.dstr);
        this.year = prsYear[0];
        var prsHours = REGXHOUR.exec(this.dstr);
        this.hours = prsHours[0];
        var prsMin = REGXMIN.exec(this.dstr);
        this.min = prsMin[0];
        var prsSec = REGXSEC.exec(this.dstr);
        this.sec = prsSec[0];
        var prsTime = REGXTIME.exec(this.dstr);
        this.time = prsTime[0];
        var prsGmtoffset = XGMTOFFSET.exec(this.dstr);
        this.gmtOffset = prsGmtoffset[0];
        var prsTmzonestr = XTIMEZONE.exec(this.dstr);
        this.tmZoneStr = prsTmzonestr[0];
        this._arrD = [this.month, this.weekDay, this.mDay, this.year, this.hours, this.min, this.sec, this.time, this.gmtOffset, this.tmZoneStr];
        console.log(this._arrD);
        return this._arrD;
    };
    return TimeSrvc;
}());
TimeSrvc = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], TimeSrvc);
export { TimeSrvc };
//# sourceMappingURL=time-parse-srvc.js.map