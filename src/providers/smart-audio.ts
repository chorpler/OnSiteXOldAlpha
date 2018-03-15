import { Injectable  } from '@angular/core'              ;
import { Platform    } from 'ionic-angular'              ;
import { NativeAudio } from '@ionic-native/native-audio' ;
import { Preferences } from './preferences'              ;
import { Log         } from 'domain/onsitexdomain'             ;

@Injectable()
export class SmartAudio {

  public audioType   : string = 'html5'           ;
  public sounds      : any    = []                ;
  public static PREFS: any    = new Preferences() ;
  public PREFS       : any    = SmartAudio.PREFS  ;
  public prefs       : any    = SmartAudio.PREFS  ;

  constructor(public nativeAudio: NativeAudio, platform: Platform) {
    window['onsiteaudio'] = this;
    if (platform.is('cordova')) {
      this.audioType = 'native';
    }
  }

  public async preload(key, asset) {
    try {
      if (this.audioType === 'html5') {
        let audio = {
          key: key,
          asset: asset,
          type: 'html5'
        };
        let found = false;
        for(let file of this.sounds) {
          if(audio.key === file.key) {
            found = true;
          }
        }
        if(!found) {
          this.sounds.push(audio);
        }
      } else {
        let audio = {
          key: key,
          asset: key,
          type: 'native'
        };
        let found = false;
        for (let file of this.sounds) {
          if (audio.key === file.key) {
            found = true;
          }
        }
        if(!found) {
          try {
            this.sounds.push(audio);
            let res:any = await this.nativeAudio.preloadSimple(key, asset);
            return res;
          } catch(err) {
            Log.l(`preload(): Error preloading asset '${asset}' as key '${key}' even though not found yet.`);
            Log.e(err);
          }
        }
      }
    } catch(err) {
      Log.l(`preload(): Error preloading audio file '${asset}' with key '${key}'.`);
      // Log.e(err);
      // throw new Error(err);
    }
  }

  public async play(key:string) {
    try {
      if(this.prefs.USER.audio) {
        let audio = this.sounds.find((sound) => {
          return sound.key === key;
        });

        if(audio) {
          if(audio.type === 'html5') {
            let audioAsset = new Audio(audio.asset);
            let res:any = await audioAsset.play();
            return res;
          } else {
            let res:any = await this.nativeAudio.play(audio.asset);
            Log.l(`play(): Played sound '${key}' via native audio.\n`, res);
            return res;
          }
        }
      } else {
        Log.l(`play(): Not playing sound '${key}' because user has sounds preference off.`);
      }
    } catch(err) {
      Log.l(`play(): Error playing sound '${key}'.`);
      Log.e(err);
      // throw new Error(err);
    }
  }

  public async playForcibly(key) {
    let audio = this.sounds.find((sound) => {
      return sound.key === key;
    });

    if (audio.type === 'html5') {
      let audioAsset = new Audio(audio.asset);
      audioAsset.play();
    } else {
      this.nativeAudio.play(audio.asset).then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });
    }
  }

}
