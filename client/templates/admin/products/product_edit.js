Template.productEdit.created = function() {
    Session.set('productEditErrors', {});
}

Template.productEdit.helpers({
    errorMessage: function(field) {
        return Session.get('productEditErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('productEditErrors')[field] ? 'has-error' : '';
    }
});

Template.productEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var product = {
            name: $(e.target).find('[name=name]').val(),
            origin: $(e.target).find('[name=origin]').val(),
            description: $(e.target).find('[name=description]').val()
        };

        var errors = validateProduct(product);
        if (errors.name || errors.origin) {
            return Session.set('productEditErrors', errors);
        }

        Meteor.call('productUpdate', this._id, product, function(error, result) {
           // display the error to the user and abort
            if (error) {
                return throwError(error.reason);
            }

            Router.go('productPage', {_id: result._id});  
        });
    }
});