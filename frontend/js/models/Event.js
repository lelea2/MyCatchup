define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var Event = Backbone.Model.extend({

        initialize: function() {

        },

        syncCalendar: function() {
            var clientId = '313810830523.apps.googleusercontent.com',
                scopes = 'https://www.googleapis.com/auth/calendar';
            gapi.auth.authorize(
                {client_id: clientId, scope: scopes, immediate: false},
                this.handleAuthResult);
            return false;
        },

        handleAuthResult: function() {
            gapi.client.load('calendar', 'v3', function() {
                var request = gapi.client.calendar.events.list({
                    'calendarId': 'primary',
                    'singleEvents': true, /* required to use timeMin */
                    'timeMin': '2013-10-31T00:00:00.000Z'
                });

                request.execute(function(resp) {
                    console.log(resp.items.length);
                    for (var i = 0; i < resp.items.length; i++) {
                        console.log(resp.items[i].summary);
                        console.log(resp.items[i].start.dateTime);
                        console.log(resp.items[i].end.dateTime);
                    }
                });
            });
        }
    });

    return Event;
});

//Google Calendar JS
//http://stackoverflow.com/questions/15914553/get-events-from-a-certain-day-with-the-javascript-google-calendar-api-v3