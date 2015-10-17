define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var Friend = Backbone.Model.extend({
        defaults: {
            id: "",
            name: "",
            prefixlink: "https://graph.facebook.com/"
        },

        initialize: function() {

        },
    });

    return Friend;
});