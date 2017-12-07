module.exports = {
  copyAssets: {
    src: ['{{SRC}}/assets/**/*'],
    dest: '{{WWW}}/assets'
  },
  copyIndexContent: {
    src: ['{{SRC}}/index.html', '{{SRC}}/manifest.json', '{{SRC}}/service-worker.js'],
    dest: '{{WWW}}'
  },
  copyFonts: {
    src: ['{{ROOT}}/node_modules/ionicons/dist/fonts/**/*', '{{ROOT}}/node_modules/ionic-angular/fonts/**/*', '{{SRC}}/assets/fonts/**/*'],
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
  },
  copyGeolocationIcons: {
    src: ['{{SRC}}/assets/icon/OnSiteX_16.png', '{{SRC}}/assets/icon/OnSiteX_64.png'],
    dest: 'platforms/android/res/drawable'
  }
}
