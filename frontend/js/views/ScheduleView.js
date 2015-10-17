//File js/views/ScheduleView.js
define ([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'mycss!css/currentschedule.css',
    'text!templates/currentSchedule.html'
], function($, _, Backbone, Bootstrap, currentschedulecss,  scheduleTemplate ) {
    var ScheduleView = Backbone.View.extend({
        el: '#content',
        events: {
            "click .join": "syncCalendar",
            "click .maybe": "syncCalendar",
            "click .sorry": "noSync"
        },
        eventId: null,
        eventData: null,
        that: this,

        initialize: function(params) {
            //Initialize header view
            //console.log(params);
            that = this;
            $("body").addClass("currSchedule");
            if (params && params.objId) {
                //this.model = new Schedule(params.objId);
                //console.log(this.model);
                this.eventId = params.objId;
                this.render(params.objId);
            }
        },

        render: function(objId) {
            //console.log(objId);
            var EventData = Parse.Object.extend("Event"),
                query = new Parse.Query(EventData);
            query.get(objId, {
                success: function(eventData) {
                    //The object was retrieved successfully.
                    //console.log(calendarData);
                    //console.log(eventData);
                    that.eventData = eventData.attributes;
                    var weekday = ["Sunday", "Monday", "Tuesday", "Wedbesday", "Thursday", "Friday", "Saturday"];
                    var mnth = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                    var st = eventData.attributes.startTime;
                    var en = eventData.attributes.endTime;
                    var startDate = weekday[st.getDay()] + ", " + mnth[st.getMonth()] + " " + st.getDate();
                    var time = st.getHours() + ":" + st.getMinutes() + " - " + en.getHours() + ":" + en.getMinutes();


                    var template = _.template(scheduleTemplate, {schedule: eventData.attributes, startDate: startDate, time: time});
                    that.$el.html(template);
                },
                error: function(object, error) {
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and description.
                    console.log("Something is going wrong!");
                }
            });
        },

        noSync: function() {
            alert("Ok we will not sync this event to your calendar");
        },

        syncCalendar: function() {
            gapi.client.setApiKey("AIzaSyC8A4FNeij1EkNhJbwBukdWYEuRjybFjM4");
            var clientId = '313810830523.apps.googleusercontent.com',
                scopes = 'https://www.googleapis.com/auth/calendar';
            gapi.auth.authorize(
                {client_id: clientId, scope: scopes, immediate: false},
                this.handleAuthResult);
        },

        handleAuthResult: function (authResult) {
             var resource = {
                "summary": that.eventData.name,
                "location": that.eventData.location.address,
                "start": {
                    "dateTime": that.eventData.startTime
                },
                "end": {
                    "dateTime": that.eventData.endTime
                }
            };
            if(authResult) {
                gapi.client.load('calendar', 'v3', function() {
                    var request = gapi.client.calendar.events.insert({
                        'calendarId': 'primary',
                        'resource': resource
                    });
                    request.execute(function(resp) {
                        console.log(resp);
                        if(resp) {
                            alert("Sync to Google Calendar Succesffuly!");
                        }
                    });
                });
            }
        }
    });

    return ScheduleView;
});