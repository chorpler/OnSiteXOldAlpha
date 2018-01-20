import { NgModule                } from '@angular/core'   ;
import { MULTI_PICKER_DIRECTIVES } from './directives'    ;
import { CommonModule            } from '@angular/common' ;

@NgModule({
    exports: [
      MULTI_PICKER_DIRECTIVES,
      CommonModule
    ],
    declarations: [MULTI_PICKER_DIRECTIVES],
    imports: [
      CommonModule
    ]
})
export class MultiPickerModule {

}
