export enum DBNAME {
  'OnSiteXUSR' = 0,
  'OnSiteXDOC' = 1
}

export var DBINDX: number;

export const DBPATH = 'http://192.168.0.140/5984/';

export var DBURL = DBPATH + DBNAME[DBINDX];


