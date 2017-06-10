// Ionic Variables and Theming. For more info, please see:
// http://ionicframework.com/docs/v2/theming/
$font-path: "../assets/fonts";

@import "ionic.globals";


// Shared Variables
// --------------------------------------------------
// To customize the look and feel of this app, you can override
// the Sass variables found in Ionic's source scss files.
// To view all the possible Ionic variables, see:
// http://ionicframework.com/docs/v2/theming/overriding-ionic-variables/




// Named Color Variables
// --------------------------------------------------
// Named colors makes it easy to reuse colors on various components.
// It's highly recommended to change the default colors
// to match your app's branding. Ionic uses a Sass map of
// colors so you can add, rename and remove colors as needed.
// The "primary" color is the only required color in the map.

$colors: (
  primary:    #387ef5,
  secondary:  #ffc900,
  danger:     #f53d3d,
  light:      #fefefe,
  dark:       #353535,
  med-dark:   #565656,
  favorite:   #11c1f3,
  splash:     #10CF9B
);


// App iOS Variables
// --------------------------------------------------
// iOS only Sass variables can go here




// App Material Design Variables
// --------------------------------------------------
// Material Design only Sass variables can go here




// App Windows Variables
// --------------------------------------------------
// Windows only Sass variables can go here




// App Theme
// --------------------------------------------------
// Ionic apps can have different themes applied, which can
// then be future customized. This import comes last
// so that the above variables are used and Ionic's
// default are overridden.



// Dark Theme
// ----------------------------------

$text-color:                                #ffffff                  !default;
$link-color:                                color($colors, light)    !default;
$background-color:                          color($colors, primary)  !default;
$subdued-text-color:                        #666  !default;

$font-family-base:                          "Lato" !default;
$font-size-base:                            14px  !default; // 1.4rem == 14px

$content-padding:                           16px  !default;
$content-margin:                            16px  !default;

$toolbar-background:                        #606060  !default; // rgb(  96,  96,  96)
$toolbar-border-color:                      color($colors, favorite)  !default;
$toolbar-text-color:                        $text-color  !default;
$toolbar-active-color:                      $link-color  !default;
$toolbar-inactive-color:                    #8c8c8c  !default;

$list-text-color:                           $text-color  !default;
$list-background-color:                     color($colors, med-dark)  !default;
$list-border-color:                         #000  !default;


$colors-ios: (
  primary:    #387ef5,
  secondary:  #ffc900,
  danger:     #f53d3d,
  light:      #fefefe,
  dark:       #303030,
  favorite:   #11c1f3,
  splash:     #10CF9B
);

$colors-md: (
  primary:    #387ef5,
  secondary:  #ffc900,
  danger:     #f53d3d,
  light:      #fefefe,
  dark:       #303030,
  favorite:   #11c1f3,
  splash:     #10CF9B
);

$colors-wp: (
  primary:    #387ef5,
  secondary:  #ffc900,
  danger:     #f53d3d,
  light:      #fefefe,
  dark:       #303030,
  favorite:   #11c1f3,
  splash:     #10CF9B
);
@import "ionic.theme.default";

// Ionicons
// --------------------------------------------------
// The premium icon font for Ionic. For more info, please see:
// http://ionicframework.com/docs/v2/ionicons/

@import "ionic.ionicons";


// Fonts
// --------------------------------------------------

@import "roboto";
@import "noto-sans";
