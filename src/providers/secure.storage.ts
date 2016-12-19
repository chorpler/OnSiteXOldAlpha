import { Injectable       } from '@angular/core'   ;
import { SecureStorage    } from 'ionic-native'    ;


@Injectable()
export class OnSiteXStorage {
  
  store : string                                   ;
  item  : string                                   ;
  value : any                                      ;

  constructor(private ss: SecureStorage) {
    console.log('Hello SecureStorage Provider')    ;
  }

  ssCreate(store: string)        : Promise<any>  {
    return this.ss.create(this.store)
      .then( () => console.log('Storage is ready!'),
        error => console.log(error)
      )                                            ;
  }


  ssGet(item: string)            : Promise<any> {
    return this.ss.get(this.item)
      .then(
        data => console.log(data),
        error => console.log(error)
      )                                            ;
  }


  ssSet(item: string, value: any): Promise<any> {
    return this.ss.set(this.item, this.value)
      .then(
        data => console.log(data),
        error => console.log(error)
      )                                            ;
  }


  ssRemove(item: string)         : Promise<any> {
    return this.ss.remove(this.item)
      .then(
        data => console.log(data),
        error => console.log(error)
      )                                            ;
  }
}
