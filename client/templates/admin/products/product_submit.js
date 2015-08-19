Template.productSubmit.created = function() {
    Session.set('productSubmitErrors', {});
}

Template.productSubmit.helpers({
    errorMessage: function(field) {
        return Session.get('productSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('productSubmitErrors')[field] ? 'has-error' : '';
    }
});

Template.productSubmit.events({
    'submit form': function(e) {
        e.preventDefault();

        var product = {
            name: $(e.target).find('[name=name]').val(),
            origin: $(e.target).find('[name=origin]').val(),
            description: $(e.target).find('[name=description]').val()
        };

        var errors = validateProduct(product);
        if (errors.name || errors.origin) {
            return Session.set('productSubmitErrors', errors);
        }

        Meteor.call('productInsert', product, function(error, result) {
           // display the error to the user and abort
            if (error) {
                return throwError(error.reason);
            }

            Router.go('productPage', {_id: result._id});  
        });
    }
});