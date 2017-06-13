export const    REGXMMM = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/ ;
export const    REGXDDD = /(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/                     ;
export const    REGXDAY = /\d{2}(?=\s\d{4}\s)/                                ;
export const   REGXYEAR = /\d{4}(?=\s\d{2}:)/                                 ;
export const   REGXHOUR = /\d{2}(?=:\d{2}:\d{2})/                             ;
export const    REGXMIN = /\d{2}(?=:\d{2}\s)/                                 ;
export const    REGXSEC = /\d{2}(?=\s\D{3}-)/                                 ;
export const   REGXTIME = /\d{2}:\d{2}:\d{2}(?=\s\D{3}-)/                     ;
export const XGMTOFFSET = /\D{3}-\d*(?=\s\()/                                 ;
export const  XTIMEZONE = /\(\D*\s*(?=)/                                      ;

export enum MONTH {
  Jan   =   1,
  Feb   =   2,
  Mar   =   3,
  Apr   =   4,
  May   =   5,
  Jun   =   6,
  Jul   =   7,
  Aug   =   8,
  Sep   =   9,
  Oct   =  10,
  Nov   =  11,
  Dec   =  12
}

export interface OSXD {
  mmm       : string
  ddd       : string
  dayNum    : number
  month     : MONTH
  yrNum     : number
  hour      : number
  minute    : number
  tmStamp   : string
  fullDate  : string
  gmtOffset : string
  tmZone    : string
}

export const UETO = 86400000;
export const EDNO = 25569;
