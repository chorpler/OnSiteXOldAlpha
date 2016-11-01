##### package.json

```json
{
  "name": "onsitex",
  "description": "OnSiteX: PouchDB Angular2 NodeJS Ionic CouchDB; a PANIC Stack App",
  "author": "Michael Bates",
  "homepage": "https://github.com/starmobiledevelopers/OnSiteX/",
  "private": true,
  "license": "UNLICENSED",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/starmobiledevelopers/OnSiteX.git"
  },
  "scripts": {
    "build": "ionic-app-scripts build",
    "watch": "ionic-app-scripts watch",
    "serve:before": "watch",
    "emulate:before": "build",
    "deploy:before": "build",
    "build:before": "build",
    "run:before": "build"
  },
  "cordovaPlugins": [
    "cordova-plugin-whitelist",
    "cordova-plugin-console",
    "cordova-plugin-statusbar",
    "cordova-plugin-device",
    "cordova-plugin-splashscreen",
    "ionic-plugin-keyboard"
  ],
  "dependencies": {
    "@angular/common": "2.1.2",
    "@angular/compiler": "2.1.2",
    "@angular/compiler-cli": "2.1.2",
    "@angular/core": "2.1.2",
    "@angular/forms": "2.1.2",
    "@angular/http": "2.1.2",
    "@angular/platform-browser": "2.1.2",
    "@angular/platform-browser-dynamic": "2.1.2",
    "@angular/platform-server": "2.1.2",
    "@ionic/storage": "1.1.6",
    "ionic-angular": "2.0.0-rc.1",
    "ionic-native": "2.2.6",
    "ionicons": "3.0.0",
    "moment": "2.15.2",
    "moment-timezone": "^0.5.7",
    "node-sass": "^3.10.1",
    "pouchdb": "^6.0.7",
    "rxjs": "^5.0.0-rc.1",
    "zone.js": "^0.6.26"
  },
  "devDependencies": {
    "@ionic/app-scripts": "^0.0.39",
    "@types/moment-timezone": "^0.2.32",
    "@types/pouchdb": "^5.4.28",
    "tslint": "^4.0.0-dev.0",
    "typescript": "^2.1.0-dev.20161028"
  }
}
```

##### tslint.json

```json
{
  "rules": {
    "no-duplicate-variable": true,
    "no-unused-variable": [
      false
    ]
  },
  "rulesDirectory": [
    "node_modules/tslint-eslint-rules/dist/rules"
  ]
}
```

##### tsconfig.json

```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "declaration": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "lib": [
      "dom",
      "es2015"
    ],
    "module": "es2015",
    "moduleResolution": "node",
    "target": "es5"
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ],
  "compileOnSave": false
}
```

##### ionic.config.json

```json
{
  "name": "OnSiteX",
  "app_id": "",
  "v2": true,
  "typescript": true
}
```

##### config.xml

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<widget id="" version="0.0.1" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
  <name>OnSiteX                                                                                           </name>
  <description>SESA OnSite                                                                         </description>
  <author email="michael.a.bates@gmail.com" href="https://sesaonsite.com/">Bald Builders LLC            </author>
  <content src="index.html"/>
  <access origin="*"/>
  <allow-intent href="http://*/*"   />
  <allow-intent href="https://*/*"  />
  <allow-intent href="tel:*"        />
  <allow-intent href="sms:*"        />
  <allow-intent href="mailto:*"     />
  <allow-intent href="geo:*"        />
  <platform   name="android">
    <allow-intent href="market:*"   />
  </platform>
  <platform   name="ios">
    <allow-intent href="itms:*"     />
    <allow-intent href="itms-apps:*"/>
  </platform>
  <feature    name="StatusBar">
    <param    name="ios-package" onload="true"   value="CDVStatusBar"/>
  </feature>
  <preference name="webviewbounce"               value="false"       />
  <preference name="UIWebViewBounce"             value="false"       />
  <preference name="DisallowOverscroll"          value="true"        />
  <preference name="android-minSdkVersion"       value="16"          />
  <preference name="BackupWebStorage"            value="none"        />
  <preference name="SplashScreenDelay"           value="0"           />
  <preference name="FadeSplashScreen"            value="false"       />
  <preference name="FadeSplashScreenDuration"    value="0"           />
  <preference name="SplashScreenBackgroundColor" value="0xFFFFFFFF"  />
  <plugin     name="cordova-plugin-device"       spec="~1.1.3"       />
  <plugin     name="cordova-plugin-console"      spec="~1.0.4"       />
  <plugin     name="cordova-plugin-whitelist"    spec="~1.3.0"       />
  <plugin     name="cordova-plugin-splashscreen" spec="~4.0.0"       />
  <plugin     name="cordova-plugin-statusbar"    spec="~2.2.0"       />
  <plugin     name="ionic-plugin-keyboard"       spec="~2.2.1"       />
</widget>
```

##### .editorconfig

```ini
# EditorConfig helps developers define and maintain consistent coding styles between different editors and IDEs
# editorconfig.org

root = true

[*]
indent_style = space
indent_size = 2

# We recommend you to keep these unchanged
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```


##### SCSS/CSS auto-prefixer settings
`C:\A2\_UX\OnSiteX\node_modules\@ionic\app-scripts\config\sass.config.js`

```js
  autoprefixer: {
    browsers: [
      'Chrome >= 54',
      'Firefox >= 49',
      'Safari >=10,'
      'Edge >= 14',
      'iOS >= 10',
      'Android >= 53',
      'Edge >= 14'
    ],
    cascade: false
  },
```
