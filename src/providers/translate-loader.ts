import { Subject         } from 'rxjs/Subject'            ;
import { Observable      } from 'rxjs/Observable'         ;
import { Injectable      } from '@angular/core'           ;
import { HttpClient      } from '@angular/common/http'    ;
import { TranslateLoader } from '@ngx-translate/core'     ;
import { Log, JSON5      } from 'onsitex-domain' ;

@Injectable()
export class JSON5TranslateLoader implements TranslateLoader {
  constructor(public http:HttpClient) {
  }
  public getTranslation(lang:string, prefx?:string):Observable<any> {
    // return Observable.of({KEY: 'value'});
    return Observable.of(this.loadFiles(lang, prefx));
  }

  public async loadFiles(lang:string, prefx?:string) {
    try {
      let prefix = prefx ? prefx : "";
      if(prefix) {
        let len = prefix.length;
        if(prefix[len - 1] !== '/') {
          prefix += "/";
        }
      }
      let langFile = prefix + lang + ".json5";
      let json5file = await this.http.get(langFile, {responseType: 'text'}).toPromise();
      let outfile = this.convertJSON5(json5file);
      return outfile;
    } catch(err) {
      Log.l(`loadFiles(): Error loading JSON5 '${lang}' file(s) via HTTP.`);
      Log.e(err);
      throw new Error(err);
    }
  }

  public convertJSON5(json5:any):Promise<any> {
    return new Promise(resolve => {
      let json = JSON5.parse(json5);
      resolve(json);
    });
  }


}
