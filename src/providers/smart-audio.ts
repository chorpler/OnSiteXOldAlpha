import { Injectable  } from '@angular/core'              ;
import { Platform    } from 'ionic-angular'              ;
import { NativeAudio } from '@ionic-native/native-audio' ;
import { Preferences } from './preferences'              ;
import { Log         } from '../config/config.functions' ;

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

  public preload(key, asset) {
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
      if (!found) {
        this.sounds.push(audio);
        this.nativeAudio.preloadSimple(key, asset).catch(err => {
          Log.l(`preload(): Error preloading asset ${asset} with key ${key}.`);
          Log.e(err);
        });
      }
    }
  }

  public play(key) {
    if(this.prefs.USER.audio) {
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

  public playForcibly(key) {
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
