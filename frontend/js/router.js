//Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'views/HeaderView',
    'views/IntroView',
    'views/FooterView',
    'views/GroupCreateView',
    'views/ScheduleCreateView',
    'views/ProfileView',
    'views/GroupView',
    'views/ScheduleView'
], function($, _, Backbone, Bootstrap, HeaderView, IntroView, FooterView, GroupCreateView, ScheduleCreateView, ProfileView, GroupView, ScheduleView) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            "": "defaultRoute",
            "profile": "profileRoute",
            "schedules/:query": "scheduleRoute",
            "groups/:query": "groupRoute",
            "createSchedule": "createScheduleRoute",
            "createGroup": "createGroupRoute"
        },

        defaultRoute: function() {
            //Lazy load file when needed
            var footerView = new FooterView(),
                introView = new IntroView();
        },

        profileRoute: function() {
            var headerView = new HeaderView(),
                profileView = new ProfileView(),
                footerView = new FooterView({display: false});
        },

        scheduleRoute: function(query) {
            var headerView = new HeaderView(),
                scheduleView = new ScheduleView({objId: query}),
                footerView = new FooterView({display: false});
        },

        groupRoute: function(query) {
            var headerView = new HeaderView(),
                groupView = new GroupView({groupId: query}),
                footerView = new FooterView({display: false});
        },

        createScheduleRoute: function() {
            var headerView = new HeaderView(),
                createScheduleView = new ScheduleCreateView(),
                footerView = new FooterView({display: false});
        },

        createGroupRoute: function() {
            var headerView = new HeaderView(),
                groupcreateView = new GroupCreateView(),
                footerView = new FooterView({display: false});
        }
    });

    return AppRouter;
});