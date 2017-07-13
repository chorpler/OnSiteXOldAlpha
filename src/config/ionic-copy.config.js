module.exports = {
  // copyAssets: {
  //   src: ['{{SRC}}/assets/**/*'],
  //   dest: '{{WWW}}/assets'
  // }
  // ,
  // copyIndexContent: {
  //   src: ['{{SRC}}/index.html', '{{SRC}}/manifest.json', '{{SRC}}/service-worker.js'],
  //   dest: '{{WWW}}'
  // },
  // copyFonts: {
  //   src: ['{{ROOT}}/node_modules/ionicons/dist/fonts/**/*', '{{ROOT}}/node_modules/ionic-angular/fonts/**/*'],
  //   dest: '{{WWW}}/assets/fonts'
  // },
  // copyPolyfills: {
  //   src: ['{{ROOT}}/node_modules/ionic-angular/polyfills/polyfills.js'],
  //   dest: '{{BUILD}}'
  // },
  // copyTranslations: {
  //   src: [' {{SRC}}/assets/i18n/**/* '],
  //   dest: '{{WWW}}/assets/i18n'
  // }
  // ,
  // copyFontawesomeFonts: {
  //   src: ['{{ROOT}}/node_modules/font-awesome/fonts/**/*'],
  //   dest: '{{WWW}}/assets/fonts'
  // },
  // copyFontawesomeCss: {
  //   src: ['{{ROOT}}/node_modules/font-awesome/css/font-awesome.min.css'],
  //   dest: '{{WWW}}/assets/css'
  // },
  // copyPrimeNGCss: {
  //   src: ['{{ROOT}}/node_modules/primeng/resources/primeng.min.css'],
  //   dest: '{{WWW}}/assets/css'
  // },
  // copyPrimeNGThemeCss: {
  //   src: ['{{ROOT}}/node_modules/primeng/resources/themes/omega/theme.css'],
  //   dest: '{{WWW}}/assets/css'
  // },
  // copyPrimeNGThemeFonts: {
  //   src: ['{{ROOT}}/node_modules/primeng/resources/themes/omega/fonts/*'],
  //   dest: '{{WWW}}/assets/css/fonts'
  // }
  copyIndexContent: {
    src: ['{{SRC}}/index.html', '{{SRC}}/manifest.json', '{{SRC}}/service-worker.js'],
    dest: '{{WWW}}'
  },
  copyFonts: {
    src: ['{{ROOT}}/node_modules/ionicons/dist/fonts/**/*', '{{ROOT}}/node_modules/ionic-angular/fonts/**/*'],
    dest: '{{WWW}}/assets/fonts'
  },
  copyPolyfills: {
    src: ['{{ROOT}}/node_modules/ionic-angular/polyfills/polyfills.js'],
    dest: '{{BUILD}}'
  },
  copySwToolbox: {
    src: ['{{ROOT}}/node_modules/sw-toolbox/sw-toolbox.js'],
    dest: '{{BUILD}}'
  },
  copyTranslations: {
    src: ['{{SRC}}/assets/i18n/*.json'],
    dest: '{{WWW}}/assets/i18n'
  },
  copyClockImages: {
    src: ['{{SRC}}/assets/images/clock/**/*'],
    dest: '{{WWW}}/assets/images/clock'
  },
  copyImages: {
    src: ['{{SRC}}/assets/images/**/*'],
    dest: '{{WWW}}/assets/images'
  },
  copyAudio: {
    src: ['{{SRC}}/assets/audio/**/*'],
    dest: '{{WWW}}/assets/audio'
  }
}
