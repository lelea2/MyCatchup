({
    baseUrl: '../js',
    mainConfigFile: '../js/main.js',
    name: '../js/main',
    main: ["../js/lib/css.js", "../js/css-build.js", "../js/normalize.js", "js/main.js"],
    out: '../js/concatenated-uglified-nolicense.js',
    preserveLicenseComments: false
})