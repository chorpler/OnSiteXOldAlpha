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
  "Standby: HB DUNCAN",
  "Training",
  "Travel",
  "Sick",
  "Vacation"
]

export const TRAININGTYPE = [
  "SAFTY",
  "PEC",
  "FORKLIFT",
  "OVERHEAD CRANE"
]

// "SAFTY": 2hrs
// "PEC": 8Hrs
// "FORKLIFT": 3Hrs
// "OVERHEAD CRANE": 10hrs
