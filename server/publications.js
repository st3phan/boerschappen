Meteor.publish('events', function() {
    return Events.find({});
});

Meteor.publish('event', function(id) {
    return Events.find(id);
});

Meteor.publish('products', function() {
    return Products.find({});
});

Meteor.publish('product', function(id) {
    return Products.find(id);
});

Meteor.publish('votes', function() {
    return Votes.find({});
});

Meteor.publish('comments', function() {
    return Comments.find({});
});