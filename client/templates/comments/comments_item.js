Template.commentItem.helpers({
    submittedText: function() {
        return moment(this.submitted.toString()).fromNow();
    }
});