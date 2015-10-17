//File js/views/ProfileView.js
define ([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'models/User',
    'views/GroupCalenderView',
    'mycss!css/profile.css',
    'text!templates/profile.html'
], function($, _, Backbone, Bootstrap, User, groupCal,profilecss, profileTemplate) {
    var ProfileView = groupCal.extend({
        el: '#content',
        events: {
            "click .createNewGroup": "navigateGroup",
            "click .createNewEvent": "navigateEvent",
            "click .editGroup": "editGroup",
            "click .editEvent": "editEvent"
        },

        initialize: function() {
            //Initialize header view
            that = this;
            $.when(
                this.setUserEventCalendar(),
                this.setGroupData()
                ).then(
                function( status ) {
                    console.log( status + ", things are going well" );
                    that.render();
                },
                function( status ) {
                    alert( status + ", you fail this time" );
                },
                function( status ) {
                    $( "body" ).append( status );
                }
            );
        },

        render: function() {
            //console.log("Initialize schedule viewprofile.html
            var template = _.template(profileTemplate);
            //console.log(this.getEventCollection());
            //console.log(this.getGroupCollection());
            if (Parse.User.current()) {
                template = _.template(profileTemplate, {
                    user: Parse.User.current().get("display_name"),
                    events: this.getEventCollection(),
                    groups: this.getGroupCollection()
                });
            }
            this.$el.html(template);
        },

        navigateGroup: function() {
            this.cleanup();
            Backbone.history.navigate("/createGroup", true);
        },

        navigateEvent: function() {
            this.cleanup();
            Backbone.history.navigate("/createSchedule", true);
        },

        cleanup: function() {
            this.undelegateEvents();
            //$(this.el).empty();
        },

        editGroup: function(e) {
            this.cleanup();
            var target = $(e.target);
            Backbone.history.navigate("/groups/" + target.data("obj"), true);
        },

        editEvent: function(e) {
            this.cleanup();
            var target = $(e.target);
            Backbone.history.navigate("/schedules/" + target.data("objid"), true);
        }
    });

    return ProfileView;
});