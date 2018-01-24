import { Subject         } from 'rxjs/Subject'         ;
import { Subscription    } from 'rxjs/Subscription'    ;
import { Observable      } from 'rxjs/Observable'      ;
import { Injectable      } from '@angular/core'        ;
import { HttpClient      } from '@angular/common/http' ;
import { TranslateLoader } from '@ngx-translate/core'  ;
import { Log, JSON5      } from 'onsitex-domain'       ;

export function createTranslateLoader(http:HttpClient) {
  return new JSON5TranslateLoader(http);
}

export class JSON5TranslateLoader implements TranslateLoader {
  private fileContents:Subject<any>;
  constructor(public http:HttpClient) {
  }
  public getTranslation(lang:string, prefx?:string):Observable<any> {
    let prefix = prefx ? prefx : './assets/i18n/';
    if(prefix.slice(-1) !== '/') {
      prefix += '/';
    }
    return this.loadFiles(lang,prefix);
  }

  public loadFiles(lang:string, prefx?:string):Observable<any> {
    let prefix = prefx ? prefx : "";
    let langFile = prefix + lang + ".json5";
    let jsonFile = prefix + lang + ".json";
    return Observable.create(observer => {
      this.http.get(langFile, {responseType: 'text'}).subscribe(
        data => {
          let outfile = this.convertJSON5(data);
          Log.l(`JSON5TranslateLoader: load of '${langFile}':\n`, outfile);
          observer.next(outfile);
          observer.complete();
        },
        error => {
          this.http.get(jsonFile).subscribe((data:Response) => {
            observer.next(data);
            observer.complete();
          });
        }
      );
    });
  }

  public convertJSON5(json5:any):any {
    let json = JSON5.parse(json5);
    return json;
  }
}
