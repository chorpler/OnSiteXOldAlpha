
# A better Example

### Imported Stuff
Here are the two imports so that the code below make sense:

```ts
// src/config/config.interface.techassignment.ts

export interface Assignment {
  "clntCmpny" : string;
  "locPrimry" : string; 
  "locScndry" : string;
  "userClass" : string; 
  "pyrlClass" : string;
}
```


```ts
// src/config/config.constants.class.ts
import { Assignment } from './config.interface.techassignment';


export const Assignments = [
  {"clntCmpny": "HALLIBURTON", "locPrimry": "BROWNFIELD" , "locScndry": "PMPSHOP", "userClass": "M-TECH", "pyrlClass": "BILLABLE"  },
  {"clntCmpny": "HALLIBURTON", "locPrimry": "BROWNFIELD" , "locScndry": "MAIN"   , "userClass": "E-TECH", "pyrlClass": "BILLABLE"  },
  {"clntCmpny": "HALLIBURTON", "locPrimry": "ODESSA BASE", "locScndry": "MAIN"   , "userClass": "E-TECH", "pyrlClass": "BILLABLE"  },
  {"clntCmpny": "HALLIBURTON", "locPrimry": "ODESSA BASE", "locScndry": "MAIN"   , "userClass": "M-TECH", "pyrlClass": "BILLABLE"  },
  {"clntCmpny": "HALLIBURTON", "locPrimry": "ODESSA BASE", "locScndry": "MAIN"   , "userClass": "TOPPER", "pyrlClass": "BILLABLE"  },
  {"clntCmpny": "KEANE"      , "locPrimry": "SHAWNEE"    , "locScndry": "MAIN"   , "userClass": "M-TECH", "pyrlClass": "BILLABLE"  },
  {"clntCmpny": "KEANE"      , "locPrimry": "SPRINGTOWN" , "locScndry": "MAIN"   , "userClass": "E-TECH", "pyrlClass": "BILLABLE"  },
  {"clntCmpny": "KEANE"      , "locPrimry": "SPRINGTOWN" , "locScndry": "MAIN"   , "userClass": "M-TECH", "pyrlClass": "BILLABLE"  },
  {"clntCmpny": "SESA"       , "locPrimry": "WESLACO"    , "locScndry": "SHOP"   , "userClass": "M-TECH", "pyrlClass": "EXPNSLABOR"},
  {"clntCmpny": "SESA"       , "locPrimry": "WESLACO"    , "locScndry": "OFFICE" , "userClass": "ADMIN" , "pyrlClass": "EXPNSLABOR"},
  {"clntCmpny": "SESA"       , "locPrimry": "LAS CUATAS" , "locScndry": "MAIN"   , "userClass": "M-TECH", "pyrlClass": "EXPNSLABOR"}
  ]

```

## Example

```ts
import { Component                } from '@angular/core'                                ;
import { NavController, NavParams } from 'ionic-angular'                                ;
import { Assignment               } from '../../config/config.interface.techassignment' ;
import { Assignments              } from '../../config/config.constants.class'          ;


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage {
  title      : string        = 'Settings' ;
  assignments: Assignment[ ] = Assignments;
  assignment : Assignment                 ;
  techSelect : string                     ;


  constructor( public navCtrl: NavController, public navParams: NavParams ) { }

  ionViewDidLoad(a: Assignment) {
    a = this.assignment;
    console.log('ionViewDidLoad SettingsPage');
    console.log('Number of Assignments: ' + this.assignments.length)
    for(let i = 0; i < this.assignments.length; i++) {
      a = this.assignments[i];
      this.techSelect =
        a.clntCmpny + ' ' +
        a.locPrimry + ' ' +
        a.locScndry + ' ' +
        a.userClass;
      console.log(this.techSelect );
    }
  }
}
/*
console:
12/29/16 4:38 PM  ionViewDidLoad SettingsPage            settings.ts:36
12/29/16 4:38 PM  Number of Assignments: 11              settings.ts:37
12/29/16 4:38 PM  HALLIBURTON BROWNFIELD PMPSHOP M-TECH  settings.ts:45
12/29/16 4:38 PM  HALLIBURTON BROWNFIELD MAIN E-TECH     settings.ts:45
12/29/16 4:38 PM  HALLIBURTON ODESSA BASE MAIN E-TECH    settings.ts:45
12/29/16 4:38 PM  HALLIBURTON ODESSA BASE MAIN M-TECH    settings.ts:45
12/29/16 4:38 PM  HALLIBURTON ODESSA BASE MAIN TOPPER    settings.ts:45
12/29/16 4:38 PM  KEANE SHAWNEE MAIN M-TECH              settings.ts:45
12/29/16 4:38 PM  KEANE SPRINGTOWN MAIN E-TECH           settings.ts:45
12/29/16 4:38 PM  KEANE SPRINGTOWN MAIN M-TECH           settings.ts:45
12/29/16 4:38 PM  SESA WESLACO SHOP M-TECH               settings.ts:45
12/29/16 4:38 PM  SESA WESLACO OFFICE ADMIN              settings.ts:45
12/29/16 4:38 PM  SESA LAS CUATAS MAIN M-TECH            settings.ts:45
*/
```

in this example I passed `a` as a parameter to `ionViewDidLoad`.  However the first time I wrote it I did not use a parameter; see below

```ts
import { Component                } from '@angular/core'                                ;
import { NavController, NavParams } from 'ionic-angular'                                ;
import { Assignment               } from '../../config/config.interface.techassignment' ;
import { Assignments              } from '../../config/config.constants.class'          ;


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage {
  title             : string         = 'Settings'  ;
  assignments       : Assignment[  ] = Assignments ;
  assignment        : Assignment                   ;
  techSelect        : string                       ;


  constructor( public navCtrl: NavController, 
               public navParams: NavParams ) { }
/**
 * @ionViewDidLoad()
 * @returns: void
 * @event: NavController Lifecycle events ionViewDidLoad
 * @description: Runs when the page has loaded. 
 *   This event only happens once per page being created. 
 *   If a page leaves but is cached, 
 *     then this event will not fire again on a subsequent viewing. 
 *   The ionViewDidLoad event is good place to put your setup code for the page.
 */
  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    console.log('Number of Assignments: ' + this.assignments.length)
    for(let i = 0; i < this.assignments.length; i++) {
      this.assignment = this.assignments[i];
      this.techSelect = 
        this.assignment.clntCmpny + ' ' + 
        this.assignment.locPrimry + ' ' +
        this.assignment.locScndry + ' ' +
        this.assignment.userClass;
      console.log(this.techSelect );
    }
  }
}
/*
console:
  12/29/16 4:21 PM  ionViewDidLoad settingsPage            settings.ts:32
  12/29/16 4:21 PM  Number of Assignments: 11              settings.ts:33
  12/29/16 4:21 PM  HALLIBURTON BROWNFIELD PMPSHOP M-TECH  settings.ts:41
  12/29/16 4:21 PM  HALLIBURTON BROWNFIELD MAIN E-TECH     settings.ts:41
  12/29/16 4:21 PM  HALLIBURTON ODESSA BASE MAIN E-TECH    settings.ts:41
  12/29/16 4:21 PM  HALLIBURTON ODESSA BASE MAIN M-TECH    settings.ts:41
  12/29/16 4:21 PM  HALLIBURTON ODESSA BASE MAIN TOPPER    settings.ts:41
  12/29/16 4:21 PM  KEANE SHAWNEE MAIN M-TECH              settings.ts:41
  12/29/16 4:21 PM  KEANE SPRINGTOWN MAIN E-TECH           settings.ts:41
  12/29/16 4:21 PM  KEANE SPRINGTOWN MAIN M-TECH           settings.ts:41
  12/29/16 4:21 PM  SESA WESLACO SHOP M-TECH               settings.ts:41
  12/29/16 4:21 PM  SESA WESLACO OFFICE ADMIN              settings.ts:41
  12/29/16 4:21 PM  SESA LAS CUATAS MAIN M-TECH            settings.ts:41
*/
```

This also works without passing a parameter to `ionViewDidLoad`.
I only used the parameter `a` above to illustrate my question.
It seems that using (or not) should have a rule.
In this case I really would not use one as in the second example since `ionViewDidLoad` is an ionic event,
and I'm just piggy-backing on the method in order to make sure `this.techSelect` is processed for the page view.

Nevertheless, I don't understand why it is not picky.
I guess I'm really trying to figure out if there is a rule in js which says whether or not a function should declare a parameter,
or if it is completely agnostic about them and that they are there as a tool, or for clarity for someone else workign on the code.