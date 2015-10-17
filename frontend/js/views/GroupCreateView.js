//File js/views/GroupCreateView.js
define ([
    'jquery',
    'underscore',
    'backbone',
    'pubsub',
    'bootstrap',
    'collections/FriendCollection',
    'mycss!css/group.css',
    'text!templates/groupCreate.html',
    'text!templates/friendlist.html'
], function($, _, Backbone, PubSub, Bootstrap, FriendCollection, groupscss, groupCreateTemplate, friendTemplate) {
    var GroupCreateView = Backbone.View.extend({
        el: '#content',
        that: this,
        collection: FriendCollection,
        arrFriend: new Array(),

        events: {
            "click .createGroup": "createGroup",
            "keydown #friend-filter": "filterFriend",
            "click #friendlist input": "addFriend"
        },

        initialize: function() {
            that = this;
            this.collection = new FriendCollection();
            this.arrFriend = new Array();
            PubSub.bind('cu:fbfetch', this.render, this);
        },

        render: function() {
            var that = this;
            this.$el.html(groupCreateTemplate);
            if(this.collection.length !== 0) {
                //console.log("FriendCollection");
                this.collection.each(function( item, index ) {
                    var template = _.template(friendTemplate, {item: item});
                    that.$el.find("#friendlist").append(template);
                });
            } else {
                console.log("Empty Collection");
            }
        },

        addFriend: function(e) {
            var target = $(e.target),
                uid = target.parents("li").data("uid");
            if (target.is(":checked")) {
                this.arrFriend.push(uid);
            } else {
                var index = $.inArray(uid, this.arrFriend);
                if(index > -1) {
                    console.log(index);
                    this.arrFriend.splice(index, 1);
                }
            }
            //console.log(this.arrFriend);
        },

        createGroup: function() {
            var groupName = this.$el.find("#groupName").val();
                listFriend = this.arrFriend;
            if (groupName === "") {
                alert("Please add a group name before you create a group");
                return;
            }
            if (listFriend.length === 0) {
                alert("Please choose list of friend adding to your group");
            }
            FB.ui({
                method: 'apprequests',
                title: 'Catch Up With Me!',
                message: 'Join my Catch Up group',
                to: listFriend.join(",")
                //filters: [{name: 'Suggested', user_ids: this.arrFriend}]
            }, function(e) {
                //console.log(e);
                //Creating parse table
                var Group = Parse.Object.extend("Group");
                var group = new Group();
                console.log(listFriend);
                group.set("name", groupName);
                // current user will also be added to the group
                listFriend.push(parseInt(Parse.User.current().attributes.authData.facebook.id, 10));
                group.set("friendlist", listFriend);
                group.save(null, {
                    success: function(group) {
                        var groupList = Parse.User.current().get("groupList");
                        //console.log(groupList);
                        groupList.push(group.id);
                        Parse.User.current().set("groupList", groupList);
                        Parse.User.current().save(null, {
                            success: function(user) {
                            }
                        });
                        Backbone.history.navigate("/createSchedule", true); //Navigating use back to profile back
                    },
                    error: function() {
                        alert("Experiencing technical difficulty. Please try again!");
                    }
                });
            });
        },

        cleanup: function() {
            this.undelegateEvents();
            $(this.el).empty();
        },

        filterFriend: function() {
            var value = this.$el.find("#friend-filter").val();
            $("#friendlist").html(""); //Clear out
            this.collection.each(function(item, index) {
                if(item.get("name").toLowerCase().indexOf(value.toLowerCase()) > -1) {
                    var template = _.template(friendTemplate, {item: item});
                    $("#friendlist").append(template);
                }
            });
        }
    });

    return GroupCreateView;
});