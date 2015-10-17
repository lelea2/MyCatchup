define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var Schedule = Backbone.Model.extend({
        default: {
            "name": "Default Name",
            "groupName": "Default Group Name",
            "fbIds": new Array(),
            "date": "",
            "time": "",
            "location": "",
            "details": ""
        },
        deferObj: new $.Deferred(),

        initialize: function(objId) {
            var that = this;
            $.when(
                this.getDataFromParse(objId)
            ).then(
                function(params) {
                    //that.set("name", "testing");
                    //that.save();
                }
            );
        },

        getDataFromParse: function(objId) {
            //console.log(objId);
            this.deferObj = new $.Deferred();
            var that = this;
            var CalendarData = Parse.Object.extend("CalenderData"),
                query = new Parse.Query(CalendarData);
            query.get(objId, {
                success: function(calendarData) {
                    //The object was retrieved successfully.
                    //console.log(calendarData);
                    that.deferObj.resolve({calendar: calendarData});
                },
                error: function(object, error) {
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and description.
                    console.log("Something is going wrong!");
                }
            });
        }
    });

    return Schedule;
});