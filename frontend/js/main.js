// Filename: main.js
// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
    //By default, load any module IDs from js/lib
    baseUrl: "js",

    //Remember: only use shim config for non-AMD scripts,
    //scripts that do not already call define(). The shim
    //config will not work correctly if used on AMD scripts,
    //in particular, the exports and init config will not
    //be triggered, and the deps config will be confusing
    //for those cases.
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            //These script dependencies should be loaded before loading backbone.js
            deps: [
                'underscore',
                'jquery'
            ],
            //Once load, user global 'Backbone' as the module value
            exports: 'Backbone'
        },
        'bootstrap': {
            deps: [
                'jquery'
            ],
            exports: 'Bootstrap'
        }
    },

    paths: {
        jquery: 'lib/jquery.min',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone-min',
        pubsub: 'lib/pubsub',
        bootstrap: 'lib/bootstrap.min',
        templates: '../templates', //loading templates file
        css: '../css', //loading css files
        text: 'lib/text',
        mycss: 'lib/css'
    }
});

require([
    // Load our app module and pass it to our definition function
    'app',
], function(App){
    // The "app" dependency is passed in as "App"
    App.initialize();
});

//http://backbonetutorials.com/organizing-backbone-using-modules/
//http://requirejs.org/docs/api.html