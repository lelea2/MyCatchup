// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
  'router' // Request router.js
], function($, _, Backbone, AppRouter) {
    var initialize = function() {
        //Start Backbone history
        //I don't want to include hash tag in my URL, therefore, include pushState===true
        //http://stackoverflow.com/questions/7310230/backbone-routes-without-hashes
        // Pass in our Router module and call it's initialize function
        var appRouter = new AppRouter();
        appRouter.initialize();
        //Backbone.history.start({pushState: true, root: "/mycatchup/frontend/"});
        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});

//http://backbonetutorials.com/organizing-backbone-using-modules/