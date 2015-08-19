Template.header.helpers({
    documentTitle: function() {
        return Session.get("documentTitle");
    },
    documentSubTitle: function() {
        return Session.get("documentSubTitle");
    }
});

Template.header.events({
    'click #back': function(e, template) {
        e.preventDefault();
        history.go(-1);
    }
});