Template.productsList.helpers({
    products: function() {
        return Products.find({
            '_id': { $in: this.products }
        });
    },
    votes: function() {
        var parentData = Template.parentData(1);
        var votes =  Votes.findOne({
            'productId': this._id,
            'eventId': parentData._id
        }) || {};

        votes.total = 0;

        if (votes.upvotes) {
            votes.total += votes.upvotes.length;
        }
        if (votes.downvotes) {
            votes.total += votes.downvotes.length;
        }

        //votes.upvotes = (votes.upvotes) ? (votes.upvotes.length / votes.total) * 100 : '0';
        votes.upvotes = (votes.upvotes) ? votes.upvotes.length : '0';
        //votes.downvotes = (votes.downvotes) ? (votes.downvotes.length / votes.total) * 100 : '0';
        votes.downvotes = (votes.downvotes) ? votes.downvotes.length : '0';

        return votes;
    },
    upvotedClass: function() {
        var parentData = Template.parentData(1);
        var userId = Meteor.userId();
        var votes =  Votes.findOne({
            'productId': this._id,
            'eventId': parentData._id,
            'upvotes.userId': userId
        }, {
            downvotes: 0
        });

        if (votes && userId) {
            return '-voted';
        }
    },
    downvotedClass: function() {
        var parentData = Template.parentData(1);
        var userId = Meteor.userId();
        var votes =  Votes.findOne({
            'productId': this._id,
            'eventId': parentData._id,
            'downvotes.userId': userId
        }, {
            upvotes: 0
        });

        if (votes && userId) {
            return '-voted';
        }
    }
});

Template.productsList.events({
    'click .upvote': function(e, template) {
        e.preventDefault();
        Meteor.call('upvoteEventProduct', template.data._id, this._id);
    },
    'click .downvote': function(e, template) {
        e.preventDefault();
        Meteor.call('downvoteEventProduct', template.data._id, this._id);
    }
});