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
  { name: 'OnSiteHome'      , fullName: 'OnSite Home'        , show: true  , role: 'user', icon: 'ios-home-outline'     , waiting: false, active: false, } ,
  { name: 'Flagged Reports' , fullName: 'Flagged Reports'    , show: true  , role: 'user', icon: 'ios-document-outline' , waiting: false, active: false, } ,
  { name: 'ReportHistory'   , fullName: 'Report History'     , show: true  , role: 'user', icon: 'ios-folder-outline'   , waiting: false, active: false, } ,
  { name: 'User'            , fullName: 'User'               , show: true  , role: 'user', icon: 'ios-contact-outline'  , waiting: false, active: false, } ,
  { name: 'Message List'    , fullName: 'Messages'           , show: true  , role: 'user', icon: 'ios-text-outline'     , waiting: false, active: false, } ,
  { name: 'Settings'        , fullName: 'Settings'           , show: true  , role: 'user', icon: 'ios-settings-outline' , waiting: false, active: false, } ,
  { name: 'DevPage'         , fullName: 'Developer Settings' , show: true  , role: 'dev' , icon: 'md-options'           , waiting: false, active: false, } ,
  { name: 'Report View'     , fullName: 'Work Report'        , show: false , role: 'user', icon: 'ios-document-outline' , waiting: false, active: false, } ,
  { name: 'Message'         , fullName: 'Message'            , show: false , role: 'user', icon: 'ios-text-outline'     , waiting: false, active: false, } ,
  { name: 'Comment'         , fullName: 'Comment'            , show: false , role: 'user', icon: 'ios-text-outline'     , waiting: false, active: false, } ,
  { name: 'Fancy Select'    , fullName: 'Fancy Select'       , show: false , role: 'user', icon: 'ios-text-outline'     , waiting: false, active: false, } ,
  { name: 'Testing'         , fullName: 'Testing'            , show: false , role: 'user', icon: 'ios-text-outline'     , waiting: false, active: false, } ,
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
  public currentTab:number = 0;
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
          this.currentTab = i;
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

  public setPageLoaded(tab?:number) {
    let tabCount = this.tabInfo.length;
    for(let i = 0; i < tabCount; i++) {
      // this.hidden[i] = true;
      this.setHidden(i, true);
    }
    if(tab !== undefined) {
      this.setActive(tab);
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

  public handleSwipe(event?:any) {
    Log.l("handleSwipe(): Event is:\n", event);
    let swipe = event;
    let dX = event.deltaX, dY = event.deltaY;
    if(dX > 0) {
      /* Swipe right, move left */
      Log.l("handleSwipe(): attempting to move left...");
      this.moveLeft();
    } else if(dX < 0) {
      /* Swipe left, move right */
      Log.l("handleSwipe(): attempting to move right...");
      this.moveRight();
    }
    // if(swipe.direction === 2) {
    //   /* Swipe left, so move right */
    //   this.moveRight();
    // } else if(swipe.direction === 4) {
    //   /* Swipe right, so move left */
    //   this.moveLeft();
    // }
  }

  public moveLeft() {
    let tab = this.currentTab;
    switch (tab) {
      case Pages.OnSiteHome: /* Can't move left, do nothing */ break;
      case Pages.Report: this.goToPage('OnSiteHome'); break;
      case Pages.ReportHistory: this.goToPage('Report'); break;
      case Pages.User: this.goToPage('ReportHistory'); break;
      case Pages.MessageList: this.goToPage('User'); break;
      case Pages.Settings: this.goToPage('Message List'); break;
      case Pages.DevPage: this.goToPage('Settings'); break;
      default:
        break;
    }
  }

  public moveRight() {
    let tab = this.currentTab;
    switch (tab) {
      case Pages.OnSiteHome: this.goToPage('Report'); break;
      case Pages.Report: this.goToPage('ReportHistory'); break;
      case Pages.ReportHistory: this.goToPage('User'); break;
      case Pages.User: this.goToPage('Message List'); break;
      case Pages.MessageList: this.goToPage('Settings'); break;
      case Pages.Settings: if(this.ud.isDeveloper()) { this.goToPage('DevPage') } else { /* Can't move right, do nothing */ }; break;
      case Pages.DevPage: /* Can't move right, do nothing */ break;
      default:
        break;
    }
  }



}
