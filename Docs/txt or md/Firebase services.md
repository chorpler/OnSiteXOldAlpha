## iOS
  ##### Swift
  ```Swift
  import UIKit
  import Firebase
  @UIApplicationMain
  class AppDelegate: UIResponder, UIApplicationDelegate {
  
    var window: UIWindow?
  
    func application(_ application: UIApplication,
      didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?)
      -> Bool {
      <pre><b>FirebaseApp.configure()</b></pre>
      return true
    }
  }
  ```

##### Objective-C
  ```Objective-C
  @import UIKit;
  @import Firebase;
  
  @implementation AppDelegate
  
  - (BOOL)application:(UIApplication *)application
      didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [FIRApp configure];
    return YES;
  }
  ```

## Android
  The Google services plugin for Gradle loads the google-services.json file you just downloaded. Modify your build.gradle files to use the plugin.
  
  ##### Project-level build.gradle (<project>/build.gradle):
  ```
  buildscript {
    dependencies {
      // Add this line
      classpath 'com.google.gms:google-services:3.1.0'
    }
  }
  ```
  
  ##### App-level build.gradle (<project>/<app-module>/build.gradle):
  ```
  ...
  // Add to the bottom of the file
  apply plugin: 'com.google.gms.google-services'
  ```

## config.xml
```XML
    <plugin name="phonegap-plugin-push" spec="^1.10.5">
        <variable name="SENDER_ID" value="915660787055" />
    </plugin>
```