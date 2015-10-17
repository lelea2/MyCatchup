define([
    'jquery',
    'underscore',
    'backbone',
    'pubsub',
    'models/Friend'
], function($, _, Backbone, PubSub, Friend){
    var FriendCollection = Backbone.Collection.extend({
        model: Friend,

        that: this,

        initialize: function() {
            this.parse();
        },

        parse: function() {
            that = this;
            //Get FB friend, need to get FB token first
            if(Parse.User.current()) {
                //console.log(response.authResponse.accessToken);
                FB.api('/me/friends', function(response) {
                    //console.log(response);
                    var friend_data = response.data.sort(that.sortMethod);
                    //console.log(friend_data.length);
                    for (var i = 0; i < friend_data.length; i++) {
                        //console.log(friend_data[i].id);
                        //console.log(friend_data[i].name);
                        //console.log('https://graph.facebook.com/' + friend_data[i].id + '/picture');
                        //console.log(friend_data[i].email);
                        that.push(friend_data[i]);
                    }
                    //console.log(that.models);
                    PubSub.trigger("cu:fbfetch");
                    //def.resolve();
                });
            } else {
                console.log("Not logging in, could not getting friendslist");
            }
        },

        //Sort name by alphabetical order
        sortMethod: function(a, b) {
            var x = a.name.toLowerCase(),
                y = b.name.toLowerCase();
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
    });

    return FriendCollection;
});