# Calcs for start and end time

Note: Do not use "moment" functions anywhere near this as this will be converted into some sort of date object.
sst = 0 // shift start time
tpsst: string // tech profile shift start time ex: "6 PM"
tsst: number // tech shift start time ex: 18
rhs: number // report hours
rst: number // report start time
ret: number // report end time
rsts: number // report start time string
rets: number // report end time string

Shift start time, sst, should be calculated from 0 as a number rather than a date function.  The number of 
hours for a shift starts at 0.  As reports are added, the repair times are added.  (i.e. 3 + 5 + 3...) and returned as shift length, sl
shift hours are merely added up to return a total number of hours in decimal
for easthetics we can easily calculate a "start time" and "end time" in hour format -but not using moment.  There is no practical benefit in that.
In this example we will consider three reports for this shift: 3hrs, 5hrs and 3hrs.
we import the tech's shift start time, tsst: 6 PM.  

tsst is parsed to 6 + 12 = 18
rst: number = 18            // first report start
ret: number = 18 + 3 = 21   // first report end time
rst: number = 21            // second report start
ret: number = 26            // second report end
rst: number = 26            // third report start
ret: number = 29            // third report end
now we convert to "time" strings...

```js
// using third report start time...
let rst = i
for ( i > 24, i < 24, i -24) {
 if ( i < 24 ) {
     rst = i;
     return rst; // still a pure number at this point
   }
 }
// rst = 2
if (rst - Math.trunc(rst) === 0.5) { hrs_dec = ":30"; return hrs_dec}
else { hrs_dec = ":00"; return hrs_dec}

rsts = Math.trunc(rst).toString() + hrs_dec;
// rsts = "2:00"
```

