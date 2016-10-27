##### Employee Classification

| Common Reference          | JobType | Loc Code 1  | Loc Code 2  |
| ---                       | ---     | ---         | ---         |
| ARTESIA E-TECH            | M-TECH  | ODESSA_     | ODESSA_TEXS |
| ARTESIA NEW MEXICO NORTH  | E-TECH  | BRNFLD_     | BRNFLD_MAIN |
| ARTESIA NEW MEXICO SOUTH  | TOPPER  | BRNFLD_     | BR_PUMPSHOP |
| BROWNFIELD                | MANAGER | ARTESIA     | N.MEX_NORTH |
| BROWNFIELD PUMP SHOP      | ADMIN   | ARTESIA     | N.MEX_SOUTH |
| ODESSA                    |         | ARTESIA     | NORTH/SOUTH |
| ODESSA E-TECHS            |         | WESLACO     | OFFICE      |
| ODESSA TOPPERS            |         |             |             |
| WESLACO HQ                |         |             |             |

On Login, the user enters first and last name.  Name is queried against DB (if service is available) to attempt to autofil options.  Otherwise he selects JobType.  Selecting `ADMIN` will result:
 - `"Loc Code 1" = WESLACO` and `"Loc Code 2"  = OFFICE` and `"Common Reference" = "WESLACO HQ"`

```js
// onSiteScheduleClass
let enum JobType {
  "MANAGER" = 0,
  "ADMIN"   = 1,
  "M-TECH"  = 2,
  "E-TECH"  = 3,
  "TOPPER"  = 4
}

let enum LocCode01 {
  "WESLACO" 0,
  "ARTESIA" 1,
  "BRNFLD_" 2,
  "ODESSA_" 3
}

let enum LocCode02 {
  "WESLACO" 0,
  "BR_PUMPSHOP" 1,
  "BRNFLD_MAIN" 2,
  "N.MEX_NORTH" 3,
  "N.MEX_SOUTH" 4,
  "NORTH/SOUTH" 5,
  "ODESSA_TEXS" 6
}

let enum OnSiteClassification {
  "ARTESIA E-TECH"            = 315,
  "ARTESIA NEW MEXICO NORTH"  = 213,
  "ARTESIA NEW MEXICO SOUTH"  = 214,
  "BROWNFIELD"                = 222,
  "BROWNFIELD PUMP SHOP"      = 221,
  "ODESSA"                    = 236,
  "ODESSA E-TECHS"            = 336,
  "ODESSA TOPPERS"            = 436,
  "WESLACO HQ"                = 100,
  "WESLACO HQ MGR"            = 000
}
```

npm cache ls
npm cache clean
