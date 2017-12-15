export interface Tab {
  name: string;
  fullName: string;
  icon: string;
  waiting?: boolean;
  active?: boolean;
  show: boolean;
  role: string,
}

export interface SelectString {
  name     : string;
  fullName : string;
  code    ?: string;
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
  'ReportView'      = 1,
  'Report View'     = 1,
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
  'Testing'         = 10,
}

export enum Icons {
  'box-check-no'   = 0,
  'box-check-yes'  = 1,
  'flag-blank'     = 2,
  'flag-checkered' = 3,
  'unknown'        = 4,
}

 export const SVGIcons = {
   'checkboxno'    : `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" version="1.1" preserveAspectRatio="xMidYMid meet" id="box-check-no">\n   <path d="M 45.833333,4.166667 V 45.833333 H 4.1666667 V 4.166667 Z M 50,0 H 0 v 50 h 50 z m -12.5,34.454167 -9.566667,-9.475 9.470834,-9.55625 -2.95,-2.922917 -9.46875,9.560417 L 15.427083,12.595833 12.5,15.522917 22.06875,25.00625 12.595833,34.572917 15.522917,37.5 25.0125,27.925 l 9.564583,9.479167 z" />\n</svg>`,
   'checkboxyes'   : `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" version="1.1" preserveAspectRatio="xMidYMid meet" id="box-check-yes">\n   <path d="M 22.916667,35.416667 12.5,24.377083 l 2.914583,-2.979166 7.445834,7.783333 13.691666,-14.597917 3.03125,2.922917 z m 22.916666,-31.25 V 45.833333 H 4.1666667 V 4.166667 Z M 50,0 H 0 v 50 h 50 z" />\n</svg>`,
   'flagblank'     : `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50" version="1.1" preserveAspectRatio="xMidYMid meet" id="flag-blank">\n   <path d="m 31.657777,6.790993 c -7.466667,0 -7.635555,-4.863905 -16.304444,-4.863905 -4.684444,0 -9.055555,1.646505 -10.9088886,2.846103 V 0 H 0 V 50 H 4.4444444 V 25.078958 C 7.075555,23.702948 11.064444,22.25471 15.384444,22.25471 c 8.186667,0 9.335555,4.62702 16.631111,4.62702 C 36.731111,26.88173 40,24.598447 40,24.598447 V 4.390126 c 0,0 -3.602223,2.400867 -8.342223,2.400867 z m 3.897778,16.034942 c -0.888889,0.347799 -2.131111,0.695571 -3.54,0.695571 -2.16,0 -3.328889,-0.60988 -5.268889,-1.619632 -2.435555,-1.26848 -5.768889,-3.007387 -11.362222,-3.007387 -4.397778,0 -8.244444,1.140786 -10.9399996,2.249668 V 8.56351 C 6.708889,7.048057 10.811111,5.288976 15.353333,5.288976 c 2.962222,0 4.208889,0.737577 6.091111,1.853162 2.146667,1.270155 5.084444,3.010744 10.213333,3.010744 1.393334,0 2.700001,-0.144488 3.897778,-0.374645 z" />\n</svg>`,
   'flagcheckered' : `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" preserveAspectRatio="xMidYMid meet" id="flag-checkered">\n   <path d="m 35.200566,6.315625 c -6.533349,0 -6.681132,-4.5234375 -14.266395,-4.5234375 -4.098888,0 -7.923605,1.53125 -9.545282,2.646875 V 0 H 7.5 v 50 h 3.888889 V 23.323437 C 13.691106,22.04375 17.181394,20.696875 20.961394,20.696875 28.124717,20.696875 29.13,25 35.513606,25 39.639717,25 42.5,22.876562 42.5,22.876562 V 4.0828125 c 0,0 -3.151934,2.2328125 -7.299434,2.2328125 z m 3.41054,8.160938 C 33.911394,17.253125 28.8325,13.945313 26.263894,12.582812 v 5.732813 l 0.0061,0.0016 c -1.471946,-0.435935 -3.198612,-0.74531 -5.308336,-0.74531 -3.848051,0 -7.213888,1.060937 -9.572499,2.092188 V 13.742228 C 15.78331,10.660977 22.17081,10.253165 26.263875,12.582852 V 6.640625 c 1.878328,1.18125 4.448893,2.8 8.93666,2.8 1.219168,0 2.3625,-0.134375 3.410562,-0.3484375 z" />\n</svg>`,
   'unknown'       : `<span class="fake-svg">?</span>`,
 }
