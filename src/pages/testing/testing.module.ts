import { NgModule                         } from '@angular/core'                 ;
import { HttpClient                       } from '@angular/common/http'          ;
import { IonicPageModule                  } from 'ionic-angular'                 ;
import { TestingPage                      } from './testing'                     ;

@NgModule({
  declarations: [
    TestingPage,
  ],
  imports: [
    IonicPageModule.forChild(TestingPage),
  ],
  exports: [
    TestingPage,
  ]
})
export class TestingPageModule {}
