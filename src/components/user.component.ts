import { Directive                                          }  from  '@angular/core'                   ;
import { USERCLASS, LOCPRIMRY, LOCSCNDRY, CLNTCMPNY         }  from  '../config/user.config.constants' ;
import { PYRLClASS, IDUCLASS, IDLOCPRM, IDLOC2ND, IDCOMPANY }  from  '../config/user.config.constants' ;
import { OSXU                                               }  from  '../config/user.config.user'      ;


@Directive({
  selector: '[user-component]' // Attribute selector
})

export class UserComponent {
      public firstName     : string;
      public lastName      : string;
      public middleName    : string;
      public namePrefix    : string;
      public nameSuffix    : string;
      public email         : string;
      public userClass     : string;
      public locPrimry     : string;
      public locScndry     : string;
      public clntCmpny     : string;
      public pyrlClass     : string;
      public idUClass      : string;
      public idLocPrm      : string;
      public idLoc2nd      : string;
      public idCompany     : string;
      public userClassIndx : number;
      public locPrimryIndx : number;
      public locScndryIndx : number;
      public clntCmpnyIndx : number;
      public pyrlClassIndx : number;
      public idUClassIndx  : string;
      public idLocPrmIndx  : string;
      public idLoc2ndIndx  : string;
      public idCompanyIndx : string;
      public usr           : string;
      public dbDocId       : string;
      public a             : string;
      public b             : string;
      public c             : string;
      public d             : string;
      public usrIdStr      : string;
      public dateStr       : string;

   constructor( private onSiteXUser: OSXU) {
     this.onSiteXUser = this.namePrefix + ' ' +
                        this.firstName  + ' ' +
                        this.middleName + ' ' +
                        this.lastName   + ' ' +
                        this.nameSuffix       ;

     this.usr         = this.lastName   + ', ' +
                        this.namePrefix + ' ' +
                        this.firstName  + ' ' +
                        this.middleName + ' ' +
                        this.nameSuffix       ;

     this.usrIdStr    = this.lastName   +
                        this.namePrefix +
                        this.firstName  +
                        this.middleName +
                        this.nameSuffix ;
   }

// UserComponent methods:
   setuserClass(userClass: string): string { return this.userClass = USERCLASS[ this.userClassIndx ]; }
   setlocPrimry(locPrimry: string): string { return this.locPrimry = LOCPRIMRY[ this.locPrimryIndx ]; }
   setlocScndry(locScndry: string): string { return this.locScndry = LOCSCNDRY[ this.locScndryIndx ]; }
   setclntCmpny(clntCmpny: string): string { return this.clntCmpny = CLNTCMPNY[ this.clntCmpnyIndx ]; }
   setIdUClass(idUClass  : number): number { return this.idUClass  = USERCLASS[ this.idUClassIndx  ]; }
   setIdLocPrm(idLocPrm  : number): number { return this.idLocPrm  = LOCPRIMRY[ this.idLocPrmIndx  ]; }
   setIdLoc2nd(idLoc2nd  : number): number { return this.idLoc2nd  = LOCSCNDRY[ this.idLoc2ndIndx  ]; }
   setIdCompany(idCompany: number): number { return this.idCompany = CLNTCMPNY[ this.idCompanyIndx ]; }

  setdbDocId(usrIdStr: string, a: string, b: string, c: string, d: string): string {
      this.a = this.idUClass.toString();
      this.b = this.idLocPrm.toString();
      this.c = this.idLoc2nd.toString();
      this.d = this.idCompany.toString();
      this.dateStr = new Date().toISOString();
      this.dbDocId = this.usrIdStr + this.a + this.b + this.c + this.d + '_' + this.dateStr;
      return this.dbDocId;
  }

}



