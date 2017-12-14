export interface Tab {
  name: string;
  fullName: string;
  icon: string;
  waiting?: boolean;
  active?: boolean;
}

export enum Pages {
  'OnSiteHome'     = 0,
  'Report'         = 1,
  'ReportHistory'  = 2,
  'Report History' = 2,
  'User'           = 3,
  'MessageList'    = 4,
  'Message List'   = 4,
  'Settings'       = 5,
  'DevPage'        = 6,
}

export enum Icons {
  'box-check-no'   = 0,
  'box-check-yes'  = 1,
  'flag-blank'     = 2,
  'flag-checkered' = 3,
  'unknown'        = 4,
}
