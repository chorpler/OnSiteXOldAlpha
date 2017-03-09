
C:\_s\A2\OnSiteX
λ ionic start --help
(node:268) fs: re-evaluating native module sources is not supported. If you are using the graceful-fs module, please update it to a more recent version.

```json
//   _             _
//  (_)           (_)
//  _  ___  _ __  _  ___
//  | |/ _ \| '_ \| |/ __|
//  | | (_) | | | | | (__
//  |_|\___/|_| |_|_|\___|  CLI v2.1.13
//
//  =======================
```

```ini
ionic start OnSiteXI sidemenu --skip-npm -s -v
ionic start OnSiteConsoleX sidemenu --skip-npm -s -v
ionic start Schedule sidemenu --skip-npm -s -v

ionic run browser -l -s -c

  start [options] <PATH> [template] .............  Starts a new Ionic project in the specified PATH
                                                   [options] any flags for the command
                                                   <PATH> directory for the new project
                                                   [template] Starter templates can either come from a named template,
  (ex: tabs, sidemenu, blank),
  a Github repo, a Codepen url, or a local directory.
  Codepen url, ex: http://codepen.io/ionic/pen/odqCz
  Defaults to Ionic "tabs" starter template
        [--appname|-a]  .........................  Human readable name for the app (Use quotes around the name)

        [--id|-i]  ..............................  Package name for <widget id> config, ex: com.mycompany.myapp

        [--skip-npm]  ...........................  Skip npm package installation

        [--no-cordova|-w]  ......................  Create a basic structure without Cordova requirements

        [--sass|-s]  ............................  Setup the project to use Sass CSS precompiling

        [--list|-l]  ............................  List starter templates available

        [--io-app-id]  ..........................  The Ionic.io app ID to use

        [--template|-t]  ........................  Project starter template

        [--v2|-v]  ..............................  Start a Ionic v2 project

        [--zip-file|-z]  ........................  URL to download zipfile for starter template

  serve [options] ...............................  Start a local development server for app dev/testing
        [--consolelogs|-c]  .....................  Print app console logs to Ionic CLI

        [--serverlogs|-s]  ......................  Print dev server logs to Ionic CLI

        [--port|-p]  ............................  Dev server HTTP port (8100 default)

        [--livereload-port|-r]  .................  Live Reload port (35729 default)

        [--nobrowser|-b]  .......................  Disable launching a browser

        [--nolivereload|-d]  ....................  Do not start live reload

        [--noproxy|-x]  .........................  Do not add proxies

        [--address]  ............................  Use specific address or return with failure

        [--all|-a]  .............................  Have the server listen on all addresses (0.0.0.0)

        [--browser|-w]  .........................  Specifies the browser to use (safari, firefox, chrome)

        [--browseroption|-o]  ...................  Specifies a path to open to (/#/tab/dash)

        [--lab|-l]  .............................  Test your apps on multiple screen sizes and platform types

        [--nogulp]  .............................  Disable running gulp during serve

        [--platform|-t]  ........................  Start serve with a specific platform (ios/android)

  setup [sass] ..................................  Configure the project with a build tool (beta)
                                                   [sass] Setup the project to use Sass CSS precompiling
  generate ......................................  Generate pages and components
           [--list]  ............................  List available generators

           [--includeSpec]  .....................  Create test spec basic to pages, components, directives, pipes and providers

           [--skipScss]  ........................  Not create scss for components and pages

           [--componentsDir]  ...................  Path directory target is created component

           [--directivesDir]  ...................  Path directory target is created directive

           [--pagesDir]  ........................  Path directory target is created page

           [--pipesDir]  ........................  Path directory target is created pipe

           [--providersDir]  ....................  Path directory target is created provider

           [--templateDir]  .....................  Path directory templates custom to pages, components, directives, pipes and providers

  platform <PLATFORM> [options] .................  Add platform target for building an Ionic app
           [--noresources|-r]  ..................  Do not add default Ionic icons and splash screen resources

           [--nosave|-e]  .......................  Do not save the platform to the package.json file

  run <PLATFORM> [options] ......................  Run an Ionic project on a connected device
      [--livereload|-l]  ........................  Live reload app dev files from the device (beta)

      [--address]  ..............................  Use specific address (livereload req.)

      [--port|-p]  ..............................  Dev server HTTP port (8100 default, livereload req.)

      [--livereload-port|-r]  ...................  Live Reload port (35729 default, livereload req.)

      [--consolelogs|-c]  .......................  Print app console logs to Ionic CLI (livereload req.)

      [--serverlogs|-s]  ........................  Print dev server logs to Ionic CLI (livereload req.)

      [--debug|--release]  ......................

      [--device|--emulator|--target=FOO]

  emulate <PLATFORM> [options] ..................  Emulate an Ionic project on a simulator or emulator
          [--livereload|-l]  ....................  Live reload app dev files from the device (beta)

          [--address]  ..........................  Use specific address (livereload req.)

          [--port|-p]  ..........................  Dev server HTTP port (8100 default, livereload req.)

          [--livereload-port|-r]  ...............  Live Reload port (35729 default, livereload req.)

          [--consolelogs|-c]  ...................  Print app console logs to Ionic CLI (livereload req.)

          [--serverlogs|-s]  ....................  Print dev server logs to Ionic CLI (livereload req.)

          [--debug|--release]  ..................

          [--device|--emulator|--target=FOO]

  build <PLATFORM> [options] ....................  Build (prepare + compile) an Ionic project for a given platform.

        [--nohooks|-n]  .........................  Do not add default Ionic hooks for Cordova

  plugin add [options] <SPEC> ...................  Add a Cordova plugin
                                                   <SPEC> Can be a plugin ID, a local path, or a git URL.
         [--searchpath <directory>]  ............  When looking up plugins by ID, look in this directory
  and subdirectories first for the plugin before
  looking it up in the registry.

         [--nosave|-e]  .........................  Do not save the plugin to the package.json file

  resources .....................................  Automatically create icon and splash screen resources (beta)
                        Put your images in the ./resources directory, named splash or icon.
                        Accepted file types are .png, .ai, and .psd.
                        Icons should be 192x192 px without rounded corners.
                        Splashscreens should be 2208x2208 px, with the image centered in the middle.

            [--icon|-i]  ........................  Generate icon resources

            [--splash|-s]  ......................  Generate splash screen resources

  upload ........................................  Upload an app to your Ionic account
         [--email|-e]  ..........................  Ionic account email

         [--password|-p]  .......................  Ionic account password

         [--note]  ..............................  The note to signify the upload

         [--deploy <channel_tag>]  ..............  Deploys the upload to the given channel. Defaults to the Dev channel

  share <EMAIL> .................................  Share an app with a client, co-worker, friend, or customer
                                                   <EMAIL> The email to share the app with
  lib [options] [update] ........................  Gets Ionic library version or updates the Ionic library
                                                   [update] Updates the Ionic Framework in www/lib/ionic
      [--version|-v]  ...........................  Specific Ionic version
  Otherwise it defaults to the latest version

  login .........................................  Login to your Ionic account
        [--email|-e]  ...........................  Ionic account email

        [--password|-p]  ........................  Ionic account password

  io <command> ..................................  Integrate your app with Ionic Cloud services
                                                   <command> init
  security <command> [options] ..................  Store your app's credentials for the Ionic Cloud
                                                   <command> profiles list, profiles add "<name>", credentials android, or credentials ios
           [--profile <tag>]  ...................  (credentials <platform>) Specify the profile on which these credentials are saved

           [--keystore|-s <path>]  ..............  (credentials android) Specify the location of your keystore file

           [--keystore-password|-p <password>]  .  (credentials android) Specify your keystore password (exclude for prompt)

           [--key-alias|-k <alias>]  ............  (credentials android) Specify your key alias for this app

           [--key-password|-w <password>]  ......  (credentials android) Specify your key password for this app (exclude for prompt)

           [--cert|-c <path>]  ..................  (credentials ios) Specify the location of your .p12 file

           [--cert-password|-p <password>]  .....  (credentials ios) Specify your certificate password (exclude for prompt)

           [--provisioning-profile|-r <path>]  ..  (credentials ios) Specify the location of your .mobileprovision file

  push ..........................................  Upload APNS and GCM credentials to Ionic Push
       [--ios-dev-cert]  ........................  Upload your development .p12 file to Ionic Push

       [--ios-prod-cert]  .......................  Upload your production .p12 file to Ionic Push

       [--production-mode=y,n]  .................  Tell Ionic Push to use production (y) or sandbox (n) APNS servers

       [--google-api-key <your-gcm-api-key>]  ...  Set your app's GCM API key on Ionic Push

  package <command> [options] ...................  Use Ionic Package to build your app
                                                   <command> build android, build ios, list, info, or download
          [--release]  ..........................  (build <platform>) Mark this build as a release

          [--profile|-p <tag>]  .................  (build <platform>) Specify the Security Profile to use with this build

          [--noresources]  ......................  (build <platform>) Do not generate icon and splash screen resources during this build

          [--destination|-d <path>]  ............  (download) Specify the destination directory to download your packaged app.

  config <command> [key] [value] ................  Set configuration variables for your ionic app
                                                   <command> set, unset, build, or info
                                                   [key] The key to set
                                                   [value] The value to set
  service add [options] <SPEC> ..................  Add an Ionic service package and install any required plugins
                                                   <SPEC> Can be a service name or a git url
  add [name] ....................................  Add an Ion, bower component, or addon to the project
                                                   [name] The name of the ion, bower component, or addon you wish to install
  remove [name] .................................  Remove an Ion, bower component, or addon from the project
                                                   [name] The name of the Ion, bower component, or addon you wish to remove
  list ..........................................  List Ions, bower components, or addons in the project
  info ..........................................  List information about the users runtime environment
  help [command] ................................  Provides help for a certain command
                                                   [command] The command you desire help with
  link [appId] ..................................  Sets your Ionic App ID for your project
                                                   [appId] The app ID you wish to set for this project
       [--reset|-r]  ............................  This will reset the Ionic App ID

  hooks [add|remove|permissions|perm] ...........  Manage your Ionic Cordova hooks
                                                   [add|remove|permissions|perm] Add, remove, or modify permissions on the default Ionic Cordova hooks
  state <COMMAND> ...............................  Saves or restores state of your Ionic Application using the package.json file
                                                   <COMMAND> [ save | restore | clear | reset ]
        [save]  .................................  Save the platforms and plugins into package.json

        [restore]  ..............................  Restore the platforms and plugins from package.json

        [clear]  ................................  Clear the package.json of cordovaPlugins and cordovaPlatforms, as well as clear out the platforms and plugins folders

        [reset]  ................................  Clear out the platforms and plugins directories, and reinstall plugins and platforms

        [--plugins]  ............................  Only do operations with plugins

        [--platforms]  ..........................  Only do operations with platforms

  docs <TOPIC> ..................................  Opens up the documentation for Ionic
                                                   <TOPIC> the topic to view help documentation for. Use "ls" to view all topics
```

```ini
  _             _
 (_)           (_)
  _  ___  _ __  _  ___
 | |/ _ \| '_ \| |/ __|
 | | (_) | | | | | (__
 |_|\___/|_| |_|_|\___|  CLI v2.2.1

=======================

ionic start --skip-npm --sass --v2 -t sidemenu -a ionic2templatestart

start [options] <PATH> [template] .............  Starts a new Ionic project in the specified PATH
                                                 [options] any flags for the command
                                                 <PATH> directory for the new project
                                                 [template] Starter templates can either come from a named template,
(ex: tabs, sidemenu, blank),
a Github repo, a Codepen url, or a local directory.
Codepen url, ex: http://codepen.io/ionic/pen/odqCz
Defaults to Ionic "tabs" starter template
      [--appname|-a]  .........................  Human readable name for the app (Use quotes around the name)

      [--id|-i]  ..............................  Package name for <widget id> config, ex: com.mycompany.myapp

      [--skip-npm]  ...........................  Skip npm package installation

      [--no-cordova|-w]  ......................  Create a basic structure without Cordova requirements

      [--sass|-s]  ............................  Setup the project to use Sass CSS precompiling

      [--list|-l]  ............................  List starter templates available

      [--io-app-id]  ..........................  The Ionic.io app ID to use

      [--template|-t]  ........................  Project starter template

      [--v2|-v]  ..............................  Start a Ionic v2 project

      [--zip-file|-z]  ........................  URL to download zipfile for starter template

serve [options] ...............................  Start a local development server for app dev/testing
      [--consolelogs|-c]  .....................  Print app console logs to Ionic CLI

      [--serverlogs|-s]  ......................  Print dev server logs to Ionic CLI

      [--port|-p]  ............................  Dev server HTTP port (8100 default)

      [--livereload-port|-r]  .................  Live Reload port (35729 default)

      [--nobrowser|-b]  .......................  Disable launching a browser

      [--nolivereload|-d]  ....................  Do not start live reload

      [--noproxy|-x]  .........................  Do not add proxies

      [--address]  ............................  Use specific address or return with failure

      [--all|-a]  .............................  Have the server listen on all addresses (0.0.0.0)

      [--browser|-w]  .........................  Specifies the browser to use (safari, firefox, chrome)

      [--browseroption|-o]  ...................  Specifies a path to open to (/#/tab/dash)

      [--lab|-l]  .............................  Test your apps on multiple screen sizes and platform types

      [--nogulp]  .............................  Disable running gulp during serve

      [--platform|-t]  ........................  Start serve with a specific platform (ios/android)

setup [sass] ..................................  Configure the project with a build tool (beta)
                                                 [sass] Setup the project to use Sass CSS precompiling
generate ......................................  Generate pages and components
         [--list]  ............................  List available generators

         [--includeSpec]  .....................  Create test spec basic to pages, components, directives, pipes and providers

         [--skipScss]  ........................  Not create scss for components and pages

         [--componentsDir]  ...................  Path directory target is created component

         [--directivesDir]  ...................  Path directory target is created directive

         [--pagesDir]  ........................  Path directory target is created page

         [--pipesDir]  ........................  Path directory target is created pipe

         [--providersDir]  ....................  Path directory target is created provider

         [--templateDir]  .....................  Path directory templates custom to pages, components, directives, pipes and providers

platform <PLATFORM> [options] .................  Add platform target for building an Ionic app
         [--noresources|-r]  ..................  Do not add default Ionic icons and splash screen resources

         [--nosave|-e]  .......................  Do not save the platform to the package.json file

run <PLATFORM> [options] ......................  Run an Ionic project on a connected device
    [--livereload|-l]  ........................  Live reload app dev files from the device (beta)

    [--address]  ..............................  Use specific address (livereload req.)

    [--port|-p]  ..............................  Dev server HTTP port (8100 default, livereload req.)

    [--livereload-port|-r]  ...................  Live Reload port (35729 default, livereload req.)

    [--consolelogs|-c]  .......................  Print app console logs to Ionic CLI (livereload req.)

    [--serverlogs|-s]  ........................  Print dev server logs to Ionic CLI (livereload req.)

    [--debug|--release]  ......................

    [--device|--emulator|--target=FOO]

emulate <PLATFORM> [options] ..................  Emulate an Ionic project on a simulator or emulator
        [--livereload|-l]  ....................  Live reload app dev files from the device (beta)

        [--address]  ..........................  Use specific address (livereload req.)

        [--port|-p]  ..........................  Dev server HTTP port (8100 default, livereload req.)

        [--livereload-port|-r]  ...............  Live Reload port (35729 default, livereload req.)

        [--consolelogs|-c]  ...................  Print app console logs to Ionic CLI (livereload req.)

        [--serverlogs|-s]  ....................  Print dev server logs to Ionic CLI (livereload req.)

        [--debug|--release]  ..................

        [--device|--emulator|--target=FOO]

build <PLATFORM> [options] ....................  Build (prepare + compile) an Ionic project for a given platform.

      [--nohooks|-n]  .........................  Do not add default Ionic hooks for Cordova

plugin add [options] <SPEC> ...................  Add a Cordova plugin
                                                 <SPEC> Can be a plugin ID, a local path, or a git URL.
       [--searchpath <directory>]  ............  When looking up plugins by ID, look in this directory
and subdirectories first for the plugin before
looking it up in the registry.

       [--nosave|-e]  .........................  Do not save the plugin to the package.json file

resources .....................................  Automatically create icon and splash screen resources (beta)
                      Put your images in the ./resources directory, named splash or icon.
                      Accepted file types are .png, .ai, and .psd.
                      Icons should be 192x192 px without rounded corners.
                      Splashscreens should be 2208x2208 px, with the image centered in the middle.

          [--icon|-i]  ........................  Generate icon resources

          [--splash|-s]  ......................  Generate splash screen resources

upload ........................................  Upload an app to your Ionic account
       [--email|-e]  ..........................  Ionic account email

       [--password|-p]  .......................  Ionic account password

       [--note]  ..............................  The note to signify the upload

       [--deploy <channel_tag>]  ..............  Deploys the upload to the given channel. Defaults to the Dev channel

share <EMAIL> .................................  Share an app with a client, co-worker, friend, or customer
                                                 <EMAIL> The email to share the app with
lib [options] [update] ........................  Gets Ionic library version or updates the Ionic library
                                                 [update] Updates the Ionic Framework in www/lib/ionic
    [--version|-v]  ...........................  Specific Ionic version
Otherwise it defaults to the latest version

login .........................................  Login to your Ionic account
      [--email|-e]  ...........................  Ionic account email

      [--password|-p]  ........................  Ionic account password

io <command> ..................................  Integrate your app with Ionic Cloud services
                                                 <command> init
security <command> [options] ..................  Store your app's credentials for the Ionic Cloud
                                                 <command> profiles list, profiles add "<name>", credentials android, or credentials ios
         [--profile <tag>]  ...................  (credentials <platform>) Specify the profile on which these credentials are saved

         [--keystore|-s <path>]  ..............  (credentials android) Specify the location of your keystore file

         [--keystore-password|-p <password>]  .  (credentials android) Specify your keystore password (exclude for prompt)

         [--key-alias|-k <alias>]  ............  (credentials android) Specify your key alias for this app

         [--key-password|-w <password>]  ......  (credentials android) Specify your key password for this app (exclude for prompt)

         [--cert|-c <path>]  ..................  (credentials ios) Specify the location of your .p12 file

         [--cert-password|-p <password>]  .....  (credentials ios) Specify your certificate password (exclude for prompt)

         [--provisioning-profile|-r <path>]  ..  (credentials ios) Specify the location of your .mobileprovision file

push ..........................................  Upload APNS and GCM credentials to Ionic Push
     [--ios-dev-cert]  ........................  Upload your development .p12 file to Ionic Push

     [--ios-prod-cert]  .......................  Upload your production .p12 file to Ionic Push

     [--production-mode=y,n]  .................  Tell Ionic Push to use production (y) or sandbox (n) APNS servers

     [--google-api-key <your-gcm-api-key>]  ...  Set your app's GCM API key on Ionic Push

package <command> [options] ...................  Use Ionic Package to build your app
                                                 <command> build android, build ios, list, info, or download
        [--release]  ..........................  (build <platform>) Mark this build as a release

        [--profile|-p <tag>]  .................  (build <platform>) Specify the Security Profile to use with this build

        [--noresources]  ......................  (build <platform>) Do not generate icon and splash screen resources during this build

        [--destination|-d <path>]  ............  (download) Specify the destination directory to download your packaged app.

config <command> [key] [value] ................  Set configuration variables for your ionic app
                                                 <command> set, unset, build, or info
                                                 [key] The key to set
                                                 [value] The value to set
service add [options] <SPEC> ..................  Add an Ionic service package and install any required plugins
                                                 <SPEC> Can be a service name or a git url
add [name] ....................................  Add an Ion, bower component, or addon to the project
                                                 [name] The name of the ion, bower component, or addon you wish to install
remove [name] .................................  Remove an Ion, bower component, or addon from the project
                                                 [name] The name of the Ion, bower component, or addon you wish to remove
list ..........................................  List Ions, bower components, or addons in the project
info ..........................................  List information about the users runtime environment
help [command] ................................  Provides help for a certain command
                                                 [command] The command you desire help with
link [appId] ..................................  Sets your Ionic App ID for your project
                                                 [appId] The app ID you wish to set for this project
     [--reset|-r]  ............................  This will reset the Ionic App ID

hooks [add|remove|permissions|perm] ...........  Manage your Ionic Cordova hooks
                                                 [add|remove|permissions|perm] Add, remove, or modify permissions on the default Ionic Cordova hooks
state <COMMAND> ...............................  Saves or restores state of your Ionic Application using the package.json file
                                                 <COMMAND> [ save | restore | clear | reset ]
      [save]  .................................  Save the platforms and plugins into package.json

      [restore]  ..............................  Restore the platforms and plugins from package.json

      [clear]  ................................  Clear the package.json of cordovaPlugins and cordovaPlatforms, as well as clear out the platforms and plugins folders

      [reset]  ................................  Clear out the platforms and plugins directories, and reinstall plugins and platforms

      [--plugins]  ............................  Only do operations with plugins

      [--platforms]  ..........................  Only do operations with platforms

docs <TOPIC> ..................................  Opens up the documentation for Ionic
                                                 <TOPIC> the topic to view help documentation for. Use "ls" to view all topics
```
