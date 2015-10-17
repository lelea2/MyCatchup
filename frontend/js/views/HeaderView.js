//File js/views/HeaderView.js
define ([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'models/User',
    'mycss!css/header.css',
    'text!templates/header.html'
], function($, _, Backbone, Bootstrap, User, headercss, headerTemplate) {
    var HeaderView = Backbone.View.extend({
        el: '#header',
        model: User,
        events: {
            "click #signout": "signOut",
            "click #home": "backHome"
        },

        initialize: function() {
            this.model = new User();
            this.render();
        },

        render: function() {
            //console.log("Rendering header");
            var currentUser = Parse.User.current(),
                template = _.template(headerTemplate, {user: false});
            if (currentUser) {
                this.model.set("userId", currentUser.get("authData").facebook.id);
                this.model.set("name", currentUser.get("display_name"));
                template = _.template(headerTemplate, {user: this.model});
            }
            this.$el.html(template);
        }, 

        signOut: function(e) {
            e.preventDefault();
            Parse.User.logOut();
            setTimeout(function() {
                Backbone.history.navigate("/", true);
                window.location.reload(); //Reloading browser
            }, 2000);
            
        },

        backHome: function(e) {
            e.preventDefault();
            $("body").attr("class", "");
            Backbone.history.navigate("/profile", true);
        }
    });

    return HeaderView;

});