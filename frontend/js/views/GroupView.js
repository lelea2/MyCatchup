//File js/views/GroupView.js
define ([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'collections/ScheduleCollection',
    'text!templates/currentGroup.html'
], function($, _, Backbone, Bootstrap, ScheduleCollection, currentGroupTemplate) {
    var GroupView = Backbone.View.extend({
        el: '#content',

        events: {
            
        },

        initialize: function(params) {
            //console.log(params);
            this.render();
        },

        render: function() {
            var template = _.template(currentGroupTemplate);
            this.$el.html(currentGroupTemplate);
        },

    });

    return GroupView;
});