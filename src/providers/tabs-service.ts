// import { elementAt } from 'rxjs/operator/elementAt';
import { Subject                       } from 'rxjs/Subject'            ;
import { Subscription                  } from 'rxjs/Subscription'       ;
import { Observable                    } from 'rxjs/Observable'         ;
import { Injectable                    } from '@angular/core'           ;
import { Events, Platform, App         } from 'ionic-angular'           ;
import { Log, isMoment, moment, Moment } from 'config/config.functions' ;
import { Tab, Pages                    } from 'config/config.types'     ;
import { Preferences                   } from './preferences'           ;
import { UserData                      } from './user-data'             ;

const tabArrayDev:Array<Tab> = [
  { name: 'OnSiteHome'    , fullName: 'OnSite Home'        , icon: 'ios-home-outline'     , waiting: false, active: false, } ,
  { name: 'Report'        , fullName: 'Report'             , icon: 'ios-document-outline' , waiting: false, active: false, } ,
  { name: 'ReportHistory' , fullName: 'Report History'     , icon: 'ios-folder-outline'   , waiting: false, active: false, } ,
  { name: 'User'          , fullName: 'User'               , icon: 'ios-contact-outline'  , waiting: false, active: false, } ,
  { name: 'Message List'  , fullName: 'Messages'           , icon: 'ios-text-outline'     , waiting: false, active: false, } ,
  { name: 'Settings'      , fullName: 'Settings'           , icon: 'ios-settings-outline' , waiting: false, active: false, } ,
  { name: 'DevPage'       , fullName: 'Developer Settings' , icon: 'md-options'           , waiting: false, active: false, } ,
];


@Injectable()
export class TabsService {
  // public tabArray:Array<Tab> = [
  //   { name: 'OnSiteHome'    , fullName: 'OnSite Home'    , icon: 'ios-home-outline'     , waiting: false, active: false, } ,
  //   { name: 'Report'        , fullName: 'Report'         , icon: 'ios-document-outline' , waiting: false, active: false, } ,
  //   { name: 'ReportHistory' , fullName: 'Report History' , icon: 'ios-folder-outline'   , waiting: false, active: false, } ,
  //   { name: 'User'          , fullName: 'User'           , icon: 'ios-contact-outline'  , waiting: false, active: false, } ,
  //   { name: 'Message List'  , fullName: 'Messages'       , icon: 'ios-text-outline'     , waiting: false, active: false, } ,
  //   { name: 'Settings'      , fullName: 'Settings'       , icon: 'ios-settings-outline' , waiting: false, active: false, } ,
  // ];
  // public tabArrayDev:Array<Tab> = [
  //   { name: 'OnSiteHome'    , fullName: 'OnSite Home'        , icon: 'ios-home-outline'     , waiting: false, active: false, } ,
  //   { name: 'Report'        , fullName: 'Report'             , icon: 'ios-document-outline' , waiting: false, active: false, } ,
  //   { name: 'ReportHistory' , fullName: 'Report History'     , icon: 'ios-folder-outline'   , waiting: false, active: false, } ,
  //   { name: 'User'          , fullName: 'User'               , icon: 'ios-contact-outline'  , waiting: false, active: false, } ,
  //   { name: 'Message List'  , fullName: 'Messages'           , icon: 'ios-text-outline'     , waiting: false, active: false, } ,
  //   { name: 'Settings'      , fullName: 'Settings'           , icon: 'ios-settings-outline' , waiting: false, active: false, } ,
  //   { name: 'DevPage'       , fullName: 'Developer Settings' , icon: 'md-options'           , waiting: false, active: false, } ,
  // ];
    // let devTab:Tab = { name: 'DevPage', fullName: 'Developer Settings', icon: 'md-options', waiting: false, active: false };
    // let output = this.tabArray.slice(0);
    // output.push(devTab);
    // return output;
  // }

  public tabArrayDev:Array<Tab> = tabArrayDev.slice(0);

  // public get tabArray():Array<Tab> { return this.tabArrayDev.slice(0, this.tabArrayDev.length - 1); };
  public tabArray:Array<Tab> = this.tabArrayDev.slice(0, this.tabArrayDev.length - 1);

  public get tabInfo():Array<Tab> { return UserData.isDeveloper() ? this.tabArrayDev : this.tabArray; };
  public set tabInfo(value:Array<Tab>) { this.tabArrayDev = value; };

  public hidden:Array<boolean> = [];
  public active:Array<boolean> = [];
  public badges:Array<number> = [];
  public disabled:boolean = false;
  public pageSub:Subscription;
  public pageEvent:Subject<any> = new Subject<any>();
  public pageLoadedEvent:Subject<any> = new Subject<any>();
  constructor(public ud:UserData) {
    window['onsitetabsservice'] = this;
    Log.l("TabsService constructor called");
    // this.initializeSubscribers();
    this.setupTabs();
  }

  // public initializePageEvents() {
  //   this.pageEvent.next()
  // }

  public setupTabs() {
    if(this.tabInfo && this.tabInfo.length) {
      this.hidden = [];
      this.active = [];
      this.badges = [];
      for(let tab of this.tabInfo) {
        this.hidden.push(true);
        this.active.push(false);
        this.badges.push(0);
      }
      // if(this.ud.isDeveloper()) {
        this.hidden.push(true);
        this.active.push(false);
        this.badges.push(0);
      // }
    } else {
      Log.e("Error setting up tabs: tabInfo is empty or non-existent!");
    }
  }

  public goToPage(value:number|string, params?:any) {
    Log.l(`TabsService.goToPage('${value}') running...`);
    if(this.isDisabled()) {
      return;
    }
    if(typeof value === 'string') {
      if(value === 'Login') {
        let out:any = {page: value};
        if(params) {
          out.params = params;
        }
        this.pageEvent.next(out);
      } else {
        let name = value;
        let i = this.tabInfo.findIndex((a:any) => a.name === name);
        if(i > -1) {
          this.setHidden(i, false);
          let out:any = {page: value};
          if(params) {
            out.params = params;
          }
          this.pageEvent.next(out);
        } else {
          Log.e(`goToPage('${value}'): Tab called '${value}' not found!`);
        }
      }
    } else if(typeof value === 'number') {
      let tab:Tab = this.tabInfo[value];
      if(tab && tab.name) {
        let name = tab.name;
        this.setHidden(value, false);
        let out:any = {page: value};
        if(params) {
          out.params = params;
        }
        this.pageEvent.next(out);
      } else {
        Log.e(`goToPage('${value}'): Tab ${value} not found!`);
      }
    } else {
      Log.e(`goToPage('${value}'): parameter is not a valid number or string!`);
    }
  }

  public setPageLoaded() {
    let tabCount = this.tabInfo.length;
    for(let i = 0; i < tabCount; i++) {
      // this.hidden[i] = true;
      this.setHidden(i, true);
    }
  }

  public getIcon(idx:number) {
    let tab = this.tabInfo[idx];
    let name = 'md-help';
    if(tab && tab.icon) {
      name = tab.icon;
    }
    let className   =  `ion-${name}`;
    let classes:any = {};
    classes[className] = true;
    return classes;
  }

  public pageLoaded():Observable<any> {
    return this.pageLoadedEvent.asObservable();
  }

  public pageChanged():Observable<any> {
    return this.pageEvent.asObservable();
  }

  public isHidden(idx:number) {
    return this.hidden[idx];
  }

  public setHidden(idx:number, val:boolean) {
    this.hidden[idx] = val;
    this.hidden = this.hidden.slice(0);
    return this.hidden[idx];
  }

  public toggleHidden(idx:number) {
    this.hidden[idx] = !this.hidden[idx];
    this.hidden = this.hidden.slice(0);
    return this.hidden[idx];
  }

  public isActive(idx:number) {
    return this.active[idx];
  }

  public setActive(idx:number) {
    let tabCount = this.tabInfo.length;
    for(let i = 0; i < tabCount; i++) {
      this.active[i] = false;
    }
    this.active[idx] = true;
    return this.active;
  }

  public getBadgeCount(idx:number) {
    if(idx === Pages.MessageList) {
      return this.getUnreadMessageCount();
    } else {
      return this.badges[idx];
    }
  }

  public setBadgeCount(idx:number, count:number) {
    this.badges[idx] = count;
    return this.badges;
  }

  public setTabArray(value:Array<any>) {
    this.tabInfo = value;
    return this.tabInfo;
  }

  public getTabArray() {
    return this.tabInfo;
  }

  public getHiddenArray() {
    return this.hidden;
  }

  public setHiddenArray(value:Array<boolean>) {
    this.hidden = value;
    return this.hidden;
  }

  public isDisabled() {
    return this.disabled;
  }

  public disableTabs() {
    this.disabled = true;
    return this.disabled;
  }

  public enableTabs() {
    this.disabled = false;
    return this.disabled;
  }

  public toggleEnabled() {
    this.disabled = !this.disabled;
    return this.disabled;
  }

  public getUnreadMessageCount() {
    return this.ud.getUnreadMessageCount();
  }

  public decrementMessageBadge() {

  }



}
