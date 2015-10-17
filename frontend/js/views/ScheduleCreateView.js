//File js/views/ScheduleCreateView.js
define ([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'views/GroupCalenderView',
    'mycss!css/schedule.css',
    'text!templates/scheduleCreate.html'
], function($, _, Backbone, Bootstrap, groupCal, groupscss, scheduleCreateTemplate) {
    var ScheduleCreateView = groupCal.extend({

        currentGroups: null,

        el: '#content',

        params: {
            groupid: null,
            friendsWelcome: $("#friends_welcome").prop("checked"),
            dayOfWeek: null,
            timeOfDay: null,
            duration: null,
            eventName: null,
            eventDetails: null,
            location: null,
            plannedDateTime: null
        },

        events: {
            'click #who-dropdown a': 'processWhoInfoDropDown',
            'click #day-of-week a': 'processDayOfWeekDropDown',
            'click #how-long-dropdown a': 'processHowLongDropDown',
            'click #catchup': 'processCatchup',
            'click .create-group-link': 'createGroupNavigate'
        },

        createGroupNavigate: function(e) {
            e.preventDefault();
            $("#catchup").unbind("click");
            Backbone.history.navigate("/createGroup", true);
        },

        processCatchup: function(event) {
            event.preventDefault();
            //console.log('clicked here');
            // Collect all fields
            allData = {
                groupid: this.params.groupid,
                friendlist: this.params.friendlist,
                uid: Parse.User.current().attributes.authData.facebook.id,
                friendsWelcome: $("#friends_welcome").prop("checked"),
                dayOfWeek: this.params.dayOfWeek,
                timeOfDay: {
                    morning: $("#morning").prop("checked"),
                    brunch: $("#brunch").prop("checked"),
                    lunch: $("#lunch").prop("checked"),
                    afternoon: $("#afternoon").prop("checked"),
                    dinner: $("#dinner").prop("checked"),
                    evening: $("#evening").prop("checked")
                },
                howLong: this.params.duration,
                eventName: $("#eventName").val(),
                eventDetails: $("#eventDescription").val(),
                eventName: $("#eventName").val(),
                location: {
                    name: autocomplete.getPlace().name,
                    address: autocomplete.getPlace().formatted_address,
                }
            };
            //console.log(allData);
            $.when(this.getFirstAvailableTime(allData)).then(function(data){
                //debugger;
                Backbone.history.navigate("/schedules/" + data, true);
            });

            //debugger;
        },

        dateMath: {
            generateDateBlocks: function() {
                var daysToPredict = 14; // Plans 7 days out from current date
                var dayBlocks = [];
                for (i = 0; i < daysToPredict * 48; i++) {
                    dayBlocks[i] = 0; // 0 meaning block is empty, By default all blocks are empty
                }
                return dayBlocks;
            },
        },

        getFirstAvailableTime: function(allData) {
            timeNow = new Date();
            timeNowSeconds = timeNow.getTime() / 1000;
            availablePromise = new jQuery.Deferred();

            var query = new Parse.Query(Parse.Object.extend("Group"));
            query.get(allData.groupid, {
                success: function(data){
                    var frList = []
                    var friendsList = $.each(data.get('friendlist'), function(idx, el){
                        frList.push(el.toString());
                    });

                    var query2 = new Parse.Query(Parse.Object.extend("CalenderData"));

                    query2.containedIn('uid', frList);

                    query2.find({
                        success: function(data) {
                            console.log(data);
                            var dayBlocks = that.dateMath.generateDateBlocks();
                            // each block is 1/2 hour

                            for(i = 0; i < data.length; i++) {
                                // for each entry Fill block
                                var ent = data[i].attributes.entries;
                                for(j = 0; j < ent.length; j ++) {
                                    // Loop over each user event
                                    if(typeof ent[j].start.date == "undefined") {
                                        var startDate = ent[j].start.dateTime;
                                        var endDate = ent[j].end.dateTime;
                                    } else {
                                        var startDate = ent[j].start.date;
                                        var endDate = ent[j].end.date;  
                                    }          
                                    if(startDate.length < 11) {
                                        startDate = startDate + "T00:00:01-08:00";
                                    }

                                    if(endDate.length < 11) {
                                        endDate = endDate + "T23:59:59-08:00";
                                    }

                                    startDate = new Date(startDate);
                                    endDate = new Date(endDate);

                                    startDate = startDate.getTime()/(1000);
                                    endDate = endDate.getTime()/(1000);

                                    eventBlocksStart = Math.floor((startDate - timeNowSeconds) / (60 * 30));
                                    eventBlocksEnd = Math.floor((endDate - timeNowSeconds) / (60 * 30));

                                    if(eventBlocksStart < (14 * 48)) {
                                        for (x = eventBlocksStart; x < eventBlocksEnd ; x ++) {
                                            dayBlocks[x] = 1;
                                        }
                                    }
                                }

                            } // end processing calenderenggements

                            // Process Day of the week

                            var nowDay = timeNow.getDay()

                            if(allData.dayOfWeek == 1) { // Selected Weekday
                                for (n = 0; n < dayBlocks.length; n++) {
                                    var theDayis = (Math.floor(n/48) + nowDay) % 7;
                                    if(theDayis == 0 || theDayis == 5 || theDayis == 6 ) {
                                        dayBlocks[n] = 1;
                                    }
                                }
                            } else if(allData.dayOfWeek == 2) {
                                for (n = 0; n < dayBlocks.length; n++) {
                                    var theDayis = (Math.floor(n/48) + nowDay) % 7;
                                    if(theDayis == 1 || theDayis == 2 || theDayis == 3 ||  theDayis == 4) {
                                        dayBlocks[n] = 1;
                                    }
                                }
                            }

                            // Calculate Block Time

                            for (d = 0; d < dayBlocks.length; d++) {
                                var hourAtBlock = (timeNow.getHours() + (Math.floor(d/2)) ) % 24;
                                if(hourAtBlock >=0 && hourAtBlock < 5) { // block 12PM to 5AM time
                                    dayBlocks[d] = 1;
                                }
                                if(allData.timeOfDay.morning == false && (hourAtBlock >=5 && hourAtBlock <9)) {
                                    dayBlocks[d] = 1;
                                }

                                if(allData.timeOfDay.brunch == false && (hourAtBlock >=9 && hourAtBlock <11)) {
                                    dayBlocks[d] = 1;
                                }
                                if(allData.timeOfDay.lunch == false && (hourAtBlock >=10 && hourAtBlock <13)) {
                                    dayBlocks[d] = 1;
                                }
                                if(allData.timeOfDay.afternoon == false && (hourAtBlock >=13 && hourAtBlock <17)) {
                                    dayBlocks[d] = 1;
                                }
                                if(allData.timeOfDay.dinner == false && (hourAtBlock >=17 && hourAtBlock <21)) {
                                    dayBlocks[d] = 1;
                                }
                                if(allData.timeOfDay.evening == false && (hourAtBlock >=21 && hourAtBlock <24)) {
                                    dayBlocks[d] = 1;
                                }
                            }
                            var emptyBlockFound = null;

                            console.log(1);
                            for(q = 0; q < dayBlocks.length; q++) {
                                if(dayBlocks[q] == 0) {
                                    emptyBlockFound = q;
                                    break;
                                }
                            }

                            console.log(emptyBlockFound);
                            t_time = new Date(timeNow);
                            t_time.setHours(t_time.getHours()+ Math.floor(emptyBlockFound/2) );
                            t_time.setMinutes(0);
                            t_time.setSeconds(0);
                            console.log("Time  = " + t_time.toLocaleFormat() );

                            //// Save data to the Parse CLOUD BABY!!!!!

                            var scheduledEvent = Parse.Object.extend("Event");

                            var sch = new scheduledEvent();

                            sch.set('name', allData.eventName);
                            sch.set('details', allData.eventDetails);
                            sch.set('location', allData.location);
                            sch.set('duration', allData.howLong);
                            sch.set('startTime', t_time);
                            sch.set('groupName', $("#who-label").text());
                            sch.set('groupId', allData.groupid);
                            sch.set('friendlist', allData.friendlist);
                            var e_time = new Date(t_time);
                            e_time.setHours(e_time.getHours()+ allData.howLong);
                            sch.set('endTime', e_time);

                            sch.save(null, {
                                success: function(a) {
                                    availablePromise.resolve(a.id);
                                }
                            });
                        }
                    });
                }
            });
            return availablePromise.promise();
        },

        processWhoInfoDropDown: function(event) {
            this.params.groupid = $(event.target).data('groupid');
            this.params.friendlist = $(event.target).data('friendlist');
            $("#who-label").text($(event.target).text());
            event.preventDefault();
        },

        processDayOfWeekDropDown: function(event) {
            this.params.dayOfWeek = $(event.target).data("day");
            $("#week-label").text($(event.target).text());
            event.preventDefault();
        },

        processHowLongDropDown: function(event) {
            this.params.duration = $(event.target).data("howlong");
            $("#how-long-label").text($(event.target).text());
            event.preventDefault();
        },

        initialize: function() {
            //Initialize header view
            that = this;
            $.when(
                    this.setCalenderData(), 
                    this.setGroupData()
                ).then(
                function( status ) {
                    console.log( status + ", things are going well" );
                    that.render();
                },
                function( status ) {
                    console.log( status + ", you fail this time" );
                },
                function( status ) {
                    $( "body" ).append( status );
                }
            );
        },

        render: function() {
            var template = _.template(scheduleCreateTemplate, {
                user: Parse.User.current().get("display_name"),
                events: this.getEventCollection(),
                groups: this.getGroupCollection()
            });
            this.$el.html(template);

            // Set default Values
            $("li a[data-day='0']").click();
            $("li a[data-howlong='2']").click()

        }
    });

    return ScheduleCreateView;
});