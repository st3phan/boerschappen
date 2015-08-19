Events = new Mongo.Collection('events');

validateEvent = function (event) {
    var errors = {};
    if (!event.title)
        errors.title = "Vul a.u.b. een titel in";
    if (!event.dates.length)
        errors.dates =  "Selecteer minimaal één datum";
    if (!event.products.length)
        errors.products =  "Selecteer minimaal één product";
    return errors;
}

Meteor.methods({
    eventInsert: function(eventAttributes) {
        check(Meteor.userId(), String);
        check(eventAttributes, {
            title: String,
            dates: Array,
            products: Array
        });

        var errors = validateEvent(eventAttributes);
        if (errors.title || errors.dates || errors.products) {
            throw new Meteor.Error('invalid-event', "You must set a title, date and select at least one product");
        }

        var eventId = Events.insert(eventAttributes);

        return {
            _id: eventId
        };
    },
    eventUpdate: function(eventId, eventAttributes) {
        check(Meteor.userId(), String);
        check(eventId, String);
        check(eventAttributes, {
            title: String,
            dates: Array,
            products: Array
        });

        var errors = validateEvent(eventAttributes);
        if (errors.title || errors.dates || errors.products) {
            throw new Meteor.Error('invalid-event', "You must set a title, date and select at least one product");
        }

        Events.update(eventId, { $set: eventAttributes });

        return {
           _id: eventId
        };
    },
    upvoteEventProduct: function(eventId, productId) {
        check(Meteor.userId(), String);
        check(eventId, String);
        check(productId, String);

        var user = Meteor.user();

        // Remove existing vote
        Votes.update({
            productId: productId,
            eventId: eventId
        }, {
            $pull: { upvotes: { userId: user._id }, downvotes: { userId: user._id }},
        });

        // Add new vote
        Votes.update({
            productId: productId,
            eventId: eventId
        }, {
            $addToSet: { upvotes: { userId: user._id, date: new Date().toISOString() }}
        }, {
            upsert: true
        });
    },
    downvoteEventProduct: function(eventId, productId) {
        check(Meteor.userId(), String);
        check(eventId, String);
        check(productId, String);

        var user = Meteor.user();

        // Remove existing vote
        Votes.update({
            productId: productId,
            eventId: eventId
        }, {
            $pull: { downvotes: { userId: user._id }, upvotes: { userId: user._id }}
        });

        // Add new vote
        Votes.update({
            productId: productId,
            eventId: eventId
        }, {
            $addToSet: { downvotes: { userId: user._id, date: new Date().toISOString() }}
        }, {
            upsert: true
        });
    }
});