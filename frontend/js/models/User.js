define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var User = Backbone.Model.extend({
        defaults: {
            userId: "",
            name: "",
            prefixlink: "https://graph.facebook.com/"
        }
    });

    return User;
});

//Getting FB friends
//http://www.script-tutorials.com/facebook-api-get-friends-list/
