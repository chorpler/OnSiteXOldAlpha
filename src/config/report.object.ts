export interface ONSITEREPORT {
  date                    : Date  ,
  shiftHrs                : number,
  repairHrs               : number,
  hoursMeter              : number,
  hubMeter                : number,
  mileage                 : number,
  tech                    : string,
  userName                : string,
  company                 : string,
  techclass               : string,
  city                    : string,
  site                    : string,
  electronicFirstWord     : string,
  fluidEndAssemblyObject  : string,
  ironAssemblyObject      : string,
  mechanicalFirstWord     : string,
  pmActivityType          : string,
  priorWorkOrderCorrection: string,
  secondWord              : string,
  shortDescriptionOfRepair: string,
  unitNumber              : string,
  workOrderNumber         : string,
  workOrderType           : string
}

export interface ONSITEBASICREPORT {
  reportHeader: REPORTHEADER,
  woNum: string,
  uNum: string,
  repairHours: number,
  jobID: string,
  repairNotes: string
}

export interface REPORTHEADER {
    reportDate    : Date  ,
    firstName     : string,
    lastName      : string,
    technician    : string,
    client        : string,
    location      : string,
    locID         : string,
    loc2nd        : string,
    shift         : string,
    shiftLength   : number,
    shiftStartTime: number,
    shiftRotation : string
}

export interface REPORTMETA {
    firstName     : string,
    lastName      : string,
    client        : string,
    location      : string,
    locID         : string,
    loc2nd        : string,
    shift         : string,
    shiftLength   : number,
    shiftStartTime: number,
    shiftRotation : string
}

export const REPORTTYPE = [
  "Work Order",
  "Standby",
  "Standby: HB Duncan",
  "Training",
  "Travel",
  "Sick",
  "Vacation",
]

export const TRAININGTYPE = [
  "Safety",
  "PEC",
  "Forklift",
  "Overhead Crane",
]

export const JOBSITES = [
  "BE MDL MNSHOP",
  "HB FORT LUPTON MNSHOP",
  "HB ART PMPSHP",
  "HB BRN E-TECH",
  "HB BRN MNSHOP",
  "HB BRN PMPSHP",
  "HB DCN MNSHOP",
  "HB DCN PMPSHP",
  "HB ODS E-TECH",
  "HB ODS MNSHOP",
  "HB RSP MNSHOP",
  "HB SAN MNSHOP",
  "KN MHL MNSHOP",
  "KN ODS MNSHOP",
  "KN SHN MNSHOP",
  "KN SPR E-TECH",
  "KN SPR MNSHOP",
  "SE WES MNSHOP"
]

export const REPORTTYPEI18N = [
  {name: "work_report"       , value: "Work Report"        },
  {name: "training"          , value: "Training"           },
  {name: "travel"            , value: "Travel"             },
  {name: "standby"           , value: "Standby"            },
  {name: "standby_hb_duncan" , value: "Standby: HB Duncan" },
  {name: "sick"              , value: "Sick"               },
  {name: "vacation"          , value: "Vacation"           },
]

export const TRAININGTYPEI18N = [
  {name: "safety"         , value: "Safety"        , hours: 2 },
  {name: "pec"            , value: "PEC"           , hours: 8 },
  {name: "forklift"       , value: "Forklift"      , hours: 3 },
  {name: "overhead_crane" , value: "Overhead Crane", hours: 10},
]

export const JOBSITESI18N = [
  {name: "BE MDL MNSHOP"         , value: "BE MDL MNSHOP"         , hours: 6  },
  {name: "HB FORT LUPTON MNSHOP" , value: "HB FORT LUPTON MNSHOP" , hours: 20 },
  {name: "HB ART PMPSHP"         , value: "HB ART PMPSHP"         , hours: 8  },
  {name: "HB BRN E-TECH"         , value: "HB BRN E-TECH"         , hours: 8  },
  {name: "HB BRN MNSHOP"         , value: "HB BRN MNSHOP"         , hours: 8  },
  {name: "HB BRN PMPSHP"         , value: "HB BRN PMPSHP"         , hours: 0  },
  {name: "HB DCN MNSHOP"         , value: "HB DCN MNSHOP"         , hours: 8  },
  {name: "HB DCN PMPSHP"         , value: "HB DCN PMPSHP"         , hours: 8  },
  {name: "HB ODS E-TECH"         , value: "HB ODS E-TECH"         , hours: 6  },
  {name: "HB ODS MNSHOP"         , value: "HB ODS MNSHOP"         , hours: 0  },
  {name: "HB RSP MNSHOP"         , value: "HB RSP MNSHOP"         , hours: 18 },
  {name: "HB SAN MNSHOP"         , value: "HB SAN MNSHOP"         , hours: 0  },
  {name: "KN MHL MNSHOP"         , value: "KN MHL MNSHOP"         , hours: 0  },
  {name: "KN ODS MNSHOP"         , value: "KN ODS MNSHOP"         , hours: 0  },
  {name: "KN SHN MNSHOP"         , value: "KN SHN MNSHOP"         , hours: 8  },
  {name: "KN SPR E-TECH"         , value: "KN SPR E-TECH"         , hours: 6  },
  {name: "KN SPR MNSHOP"         , value: "KN SPR MNSHOP"         , hours: 6  },
  {name: "SE WES MNSHOP"         , value: "SE WES MNSHOP"         , hours: 0  },
]

// "SAFTY": 2hrs
// "PEC": 8Hrs
// "FORKLIFT": 3Hrs
// "OVERHEAD CRANE": 10hrs
