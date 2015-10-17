//File js/views/GroupCalenderView.js
define ([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'models/User'
], function($, _, Backbone, Bootstrap, User) {
    var groupCal = Backbone.View.extend({
        
        CalenderEntries: null,
        EventEntries: null,
        GroupsForUser: null,

        setCalenderData: function() {
            var defPromise = new jQuery.Deferred();
            var currentUserFbId = parseInt(Parse.User.current().attributes.authData.facebook.id, 10);

            // get all groups for that user. 
            var query = new Parse.Query(Parse.Object.extend("CalenderData"));

            query.equalTo("uid", currentUserFbId.toString());
          //  query.containsAll('friendlist', [currentUserFbId]);
            query.find({
                success: function(entries){
                    var calCollection = [];
                    console.log(entries);
                    if(entries.length > 0) {
                        var unProcessedCalCollection = entries[0].get("entries");
                        for(i = 0; i < unProcessedCalCollection.length; i++) {
                            if(typeof unProcessedCalCollection[i].start.date == "undefined") {
                                var startDate = unProcessedCalCollection[i].start.dateTime;
                                var endDate = unProcessedCalCollection[i].end.dateTime;
                            } else {
                                var startDate = unProcessedCalCollection[i].start.date;
                                var endDate = unProcessedCalCollection[i].end.date;  
                            }

                            var allDay = false;           
                            if(startDate.length < 11) {
                                startDate = startDate + "T00:00:01-08:00";
                            }

                            if(endDate.length < 11) {
                                endDate = endDate + "T23:59:59-08:00";
                                allDay = true;
                            }

                            calCollection.push({
                                summary: unProcessedCalCollection[i].summary,
                                startDate: new Date(startDate),
                                endDate: new Date(endDate),
                                allDay: allDay
                            });
                        }
                    }

                    //console.log('back for cal');
                    that.CalenderEntries = calCollection;
                    defPromise.resolve('yay');
                }
            });

            return defPromise.promise();
        },

        setUserEventCalendar: function() {
            var defPromise = new jQuery.Deferred();
            var currentUserFbId = parseInt(Parse.User.current().attributes.authData.facebook.id, 10);

            // get all groups for that user. 
            var query = new Parse.Query(Parse.Object.extend("Event"));

            query.contains("friendlist", currentUserFbId.toString());
            query.find({
                success: function(entries){
                    var eventCollection = [];
                    //console.log(entries);
                    if(entries.length > 0) {
                        for(i = 0; i < entries.length; i++) {
                            //console.log(entries[i]);
                            eventCollection.push({
                                summary: entries[i].attributes.name,
                                startDate: entries[i].attributes.startTime,
                                endDate: entries[i].attributes.endTime,
                                objid: entries[i].id
                            });
                        }
                    }
                    //console.log('back for cal');
                    that.EventEntries = eventCollection;
                    defPromise.resolve('yay');
                }
            });
        },

        setGroupData: function() {
            var defPromise = new jQuery.Deferred();
            var currentUserFbId = parseInt(Parse.User.current().attributes.authData.facebook.id, 10);

            // get all groups for that user. 
            var query = new Parse.Query(Parse.Object.extend("Group"));
            query.containsAll('friendlist', [currentUserFbId]);
            query.find({
                success: function(entries){
                    var groupCollection= [];

                    for (i = 0; i< entries.length; i++) {
                        var data = {
                            objectid: entries[i].id,
                            friendList: entries[i].attributes.friendlist,
                            name: entries[i].attributes.name,
                            stupidbg: "css/lib/img/group" + (i+1) + ".png"
                        }
                        groupCollection.push(data);
                    }
                    that.GroupsForUser = groupCollection;
                    defPromise.resolve('yay');
                }
            });

            return defPromise.promise();

        },

        getEventCollection: function() {
            //console.log(this.CalenderEntries);
            return this.EventEntries;
        },

        getGroupCollection: function() {
            //console.log(this.GroupsForUser);
            return this.GroupsForUser;
        }
    });

    return groupCal;
});