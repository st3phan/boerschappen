Comments = new Mongo.Collection('comments');

Meteor.methods({
    commentInsert: function(commentAttributes) {
        check(this.userId, String);
        check(commentAttributes, {
            eventId: String,
            body: String
        });

        var user = Meteor.user();
        var post = Events.findOne(commentAttributes.eventId);

        if (!post) {
            throw new Meteor.Error('invalid-comment', 'You must comment on an event');
        }
     
        comment = _.extend(commentAttributes, {
            userId: user._id,
            author: user.profile.name,
            submitted: new Date().toISOString()
        });

        // update the post with the number of comments
        // Events.update(comment.eventId, {$inc: {commentsCount: 1}});
            
        comment._id = Comments.insert(comment);
        // now create a notification, informing the user that there's been a comment
        // createCommentNotification(comment);
        return comment._id;
    }
});