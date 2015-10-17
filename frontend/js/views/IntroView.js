//File js/views/IntroView.js
define ([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'models/User',
    'mycss!css/intro.css',
    'text!templates/intro.html'
], function($, _, Backbone, Bootstrap, User, introcss, introTemplate) {
    var IntroView = Backbone.View.extend({
        el: '#content',
        that: this,
        model: User,
        gPromise: new $.Deferred(),

        events: {
            'click button.facebook-reg': 'fbRegister',
            'click button.googleSync': 'googleCalendarSync'
        },

        initialize: function() {
            that = this;
            this.render();
        },

        render: function() {
            that = this;
            var currentUser = Parse.User.current();
            if (currentUser) { //Already log in the app
                this.$el.html(""); //Clear out intro
                this.googleCalendarSync();
                Backbone.history.navigate("/profile", true); //reload Backbone way
            } else {
                $("body").addClass("facebook");
                this.$el.html(introTemplate);
            }
        },

        fbRegister: function() {
            Parse.FacebookUtils.logIn(null, {
                success: function(user) {
                    //console.log(user);
                    if (!user.existed()) { //First time using app
                        //console.log("User signed up and logged in through Facebook!");
                        //Saving display name, email, group and event list as an array for first time logged in user
                        FB.api('/me', function(response) {
                            user.set("display_name", response.name);
                            user.set("display_email", response.email);
                            user.set("groupList", new Array());
                            user.set("eventList", new Array());
                            user.save();
                        });
                        $("body").removeClass("facebook")
                                .addClass("google");
                        that.$el.find(".step1").addClass("hidden");
                        that.$el.find(".step2").removeClass("hidden");
                    } else { //User already exist in Parse table
                        //console.log("User logged in through Facebook!");
                        $("body").removeClass("facebook");
                        that.googleCalendarSync();
                        that.$el.html(""); //Clear out intro
                        Backbone.history.navigate("/profile", true); //reload Backbone way
                    }
                },
                error: function(user, error) {
                    console.log("User cancelled the Facebook login or did not fully authorize.");
                }
            });
        },

        /**Google Calendar sync... Require logging in with google account **/
        googleCalendarSync: function() {
            this.gPromise = new jQuery.Deferred();

            gapi.client.setApiKey("AIzaSyC8A4FNeij1EkNhJbwBukdWYEuRjybFjM4");
            var clientId = '313810830523.apps.googleusercontent.com',
                scopes = 'https://www.googleapis.com/auth/calendar';
            gapi.auth.authorize(
                {client_id: clientId, scope: scopes, immediate: false},
                this.handleAuthResult);
            return this.gPromise.promise();
        },

        handleAuthResult: function(authResult) {
            that = this;
            gPromise = new $.Deferred();
            if (authResult) {
                gapi.client.load('calendar', 'v3', function() {
                    var request = gapi.client.calendar.events.list({
                        'calendarId': 'primary',
                        'singleEvents': true, /* required to use timeMin */
                        'timeMin': '2013-10-31T00:00:00.000Z',
                        'timeMax': '2015-10-31T00:00:00.000Z'
                    });
                    request.execute(function(resp) {
                        // store all data in Parse
                        var entry = [];
                        for (var i = 0; i < resp.items.length; i++) {
                            entry.push({
                                summary: resp.items[i].summary,
                                start: resp.items[i].start,
                                end: resp.items[i].end
                            });
                            
                            //console.log(resp.items[i].summary);
                            //console.l og(resp.items[i].start.dateTime);
                            //console.log(resp.items[i].end.dateTime);
                        }
                        var calObj = Parse.Object.extend('CalenderData');
                        //Verify we have data for user
                        var query = new Parse.Query(calObj);
                        query.equalTo('uid', Parse.User.current().attributes.authData.facebook.id);
                        
                        query.find({
                            success: function(entries) {
                                ///console.log(888);
                                if(entries.length === 0) {
                                    // Create parse object to store calander data                        
                                    var calEntry = new calObj();
                                    calEntry.set("owner", Parse.User.current());
                                    calEntry.set("uid", Parse.User.current().attributes.authData.facebook.id);
                                  
                                } else {
                                    calEntry = entries[0];
                                }
                                
                                calEntry.set("entries", entry);
                                calEntry.save(null, {
                                    success: function(obj) {
                                        //console.log(obj);
                                        gPromise.resolve('ay');
                                    }
                                });  
                            }
                        });
                        $("body").removeClass("google");
                       // that.$el.html(""); //Clear out intro
                        Backbone.history.navigate("/createSchedule", true); //reload Backbone way, creating group for first time user
                    });
                });
            }
        },

        //Utility function to get url parameter value by name
        //http://stackoverflow.com/questions/9501690/javascript-documentation-on-getparameterbyname
        getParameterByName: function(name) {
            name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
            var regexS = "[\\?&]"+name+"=([^&#]*)";
            var regex = new RegExp( regexS );
            var results = regex.exec( window.location.href );
            if ( results == null ) return "";
            return decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    });

    return IntroView;
});

//Enable FB in local host
//http://ankurm.com/using-localhost-for-facebook-app-development/