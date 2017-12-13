import { Injectable                    } from '@angular/core'           ;
import { Events, Platform, App         } from 'ionic-angular'           ;
import { Log, isMoment, moment, Moment } from 'config/config.functions' ;
import { Preferences                   } from './preferences'           ;

@Injectable()
export class TabsService {
  public hidden:Array<boolean> = [];
  public active:Array<boolean> = [];
  public badges:Array<number> = [];
  public tabInfo:Array<any> = [];
  public disabled:boolean = false;
  constructor() {
    window['onsitetabsservice'] = this;
    Log.l("TabsService constructor called");
  }

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
    } else {
      Log.e("Error setting up tabs: tabInfo is empty or non-existent!");
    }
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



}
