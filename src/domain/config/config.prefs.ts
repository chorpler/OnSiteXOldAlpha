interface RootObject {
  DB: DB;
  SERVER: SERVER;
  USER: USER;
  DEVELOPER: DEVELOPER;
  CONSOLE: CONSOLE;
}

interface CONSOLE {
  global: Global;
  scheduling: Scheduling;
  payroll: Payroll;
  techshiftreports: Techshiftreports;
  techphones: Techphones;
  pages: Pages;
  pageSizes: PageSizes;
}

interface PageSizes {
  reports: number[];
  reports_other: number[];
  employees: number[];
  jobsites: number[];
}

interface Pages {
  reports: number;
  reports_other: number;
  employees: number;
  jobsites: number;
  techphones: number;
}

interface Techphones {
  autoLayoutTable: boolean;
  tableResizeMode: string;
}

interface Techshiftreports {
  showAllSites: boolean;
  showAllTechs: boolean;
  payroll_periods: number;
}

interface Payroll {
  showColors: boolean;
  showShiftLength: boolean;
  showAlerts: boolean;
  exportUseQuickbooksName: boolean;
  minHoursWhenOn: number;
  maxHoursWhenOff: number;
}

interface Scheduling {
  persistTechChanges: boolean;
  showAllSites: boolean;
  showOffice: boolean;
  allDatesAvailable: boolean;
  lastScheduleUsed: string;
}

interface Global {
  payroll_periods: number;
  loadReports: boolean;
  loadMiscReports: boolean;
  loadOldReports: boolean;
  weekStartDay: number;
  loadEmployees: boolean;
  loadSites: boolean;
}

interface DEVELOPER {
  showDocID: boolean;
  showDocRev: boolean;
  showReportTimes: boolean;
  showReportSite: boolean;
}

interface USER {
  preferencesVersion: number;
  language: string;
  shifts: number;
  payroll_periods: number;
  audio: boolean;
  stayInReports: boolean;
  spinnerSpeed: number;
  messageCheckInterval: number;
}

interface SERVER {
  localAdapter: string;
  server: string;
  port: number;
  protocol: string;
  opts: Opts;
  ropts: Ropts;
  cropts: Cropts;
  repopts: Repopts;
  ajaxOpts: AjaxOpts;
  remoteDBInfo: RemoteDBInfo;
  rdbServer: RdbServer;
}

interface RdbServer {
  protocol: string;
  server: string;
  opts: Ropts;
}

interface RemoteDBInfo {
}

interface AjaxOpts {
  headers: Headers;
}

interface Headers {
  Authorization: string;
}

interface Repopts {
  live: boolean;
  retry: boolean;
  continuous: boolean;
}

interface Cropts {
  adapter: string;
}

interface Ropts {
  adapter: string;
  skipSetup: boolean;
}

interface Opts {
  auto_compaction: boolean;
  adapter: string;
  skipSetup: boolean;
}

interface DB {
  reports: string;
  reports_other: string;
  employees: string;
  config: string;
  jobsites: string;
  scheduling: string;
  invoices: string;
  invoices_be: string;
  invoices_hb: string;
  invoices_kn: string;
  technicians: string;
  messages: string;
  comments: string;
  phoneInfo: string;
  sounds: string;
  login: string;
  preauths: string;
  worksites: string;
  reports_old01: string;
  reports_old02: string;
  reports_old: string[];
}
