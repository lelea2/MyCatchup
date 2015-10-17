/**
 * https://gist.github.com/asciidisco/3986542
 */
define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var PubSub = {};
    _.extend(PubSub, Backbone.Events);
    return PubSub;
});