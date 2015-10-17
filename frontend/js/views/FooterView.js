//File js/views/HeaderView.js
define ([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'text!templates/footer.html',
    'mycss!css/footer.css',
], function($, _, Backbone, Bootstrap, footerTemplate, footercss) {
    var FooterView = Backbone.View.extend({
        el: '#footer',

        initialize: function(params) {
            //console.log(params);
            if (params && (!params.display)) {
                this.$el.empty();
            } else {
                this.render();
            }
        },

        render: function() {
            var template = _.template(footerTemplate);
            this.$el.html(template);
        }
    });

    return FooterView;

});