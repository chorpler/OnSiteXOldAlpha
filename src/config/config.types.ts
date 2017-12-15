export interface Tab {
  name: string;
  fullName: string;
  icon: string;
  waiting?: boolean;
  active?: boolean;
  show: boolean;
  role: string,
}

// export enum Pages {
//   'OnSiteHome'      = 0,
//   'Report'          = 1,
//   'ReportHistory'   = 2,
//   'Report History'  = 2,
//   'Flagged Reports' = 2,
//   'Reports Flagged' = 2,
//   'ReportsFlagged'  = 2,
//   'FlaggedReports'  = 2,
//   'User'            = 3,
//   'MessageList'     = 4,
//   'Message List'    = 4,
//   'Settings'        = 5,
//   'DevPage'         = 6,
// }

export enum Pages {
  'OnSiteHome'      = 0,
  'Report'          = 1,
  'Flagged Reports' = 1,
  'Reports Flagged' = 1,
  'ReportsFlagged'  = 1,
  'FlaggedReports'  = 1,
  'ReportHistory'   = 2,
  'Report History'  = 2,
  'User'            = 3,
  'Message List'    = 4,
  'MessageList'     = 4,
  'Settings'        = 5,
  'DevPage'         = 6,
  'Message'         = 7,
  'Comment'         = 8,
  'Fancy Select'    = 9,
}

export enum Icons {
  'box-check-no'   = 0,
  'box-check-yes'  = 1,
  'flag-blank'     = 2,
  'flag-checkered' = 3,
  'unknown'        = 4,
}
