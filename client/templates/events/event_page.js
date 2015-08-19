Template.eventPage.helpers({
    comments: function() {
        return Comments.find({
            eventId: this._id
        }, {
            sort: {
                submitted: 1
            }
        });
    }
});

Template.eventPage.events({
    'click #toggle-comments-submit': function(e, template) {
        e.preventDefault();
        $('#comments-submit').toggle();
    }
});