Template.eventSubmit.created = function() {
    Session.set('eventSubmitErrors', {});
    Session.set('eventSubmitProducts', []);
    Session.set('eventSubmitDates', []);
}

Template.eventSubmit.rendered = function() {
    $('.datepicker').pickadate({
        format: 'dd-mm-yyyy',
        onClose: function() {
            var selectedDates = _.union(_.compact(Session.get('eventSubmitDates')), this.get())
            Session.set('eventSubmitDates', selectedDates);
        }
    });
}

Template.eventSubmit.helpers({
    products: function() {
        return Products.find();
    },
    selectedProducts: function() {
        return Products.find({_id: { $in: Session.get('eventSubmitProducts')}});
    },
    selectedDates: function() {
        return Session.get('eventSubmitDates');
    },
    errorMessage: function(field) {
        return Session.get('eventSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('eventSubmitErrors')[field] ? 'has-error' : '';
    }
});

Template.eventSubmit.events({
    'click form .add-products': function(e) {
        e.preventDefault();
        
        var selectedProducts = $(e.target).parents('form').find('[name=products]').val();
        selectedProducts = _.union(_.compact(Session.get('eventSubmitProducts')), selectedProducts);
        Session.set('eventSubmitProducts', selectedProducts);
    },
    'click form .remove-product': function(e) {
        e.preventDefault();

        var productId = $(e.target).attr('data-product-id');
        var selectedProducts = _.without(Session.get('eventSubmitProducts'), productId);
        Session.set('eventSubmitProducts', selectedProducts);
    },
    'click form .remove-date': function(e) {
        e.preventDefault();

        var date = $(e.target).attr('data-date');
        var selectedDates = _.without(Session.get('eventSubmitDates'), date);
        Session.set('eventSubmitDates', selectedDates);
    },
    'submit form': function(e) {
        e.preventDefault();

        var dates = $(e.target).find('[name="selected_dates[]"]').map(function() {
            return $(this).val();
        }).get();

        var products = $(e.target).find('[name="selected_products[]"]').map(function() {
            return $(this).val();
        }).get();

        var event = {
            title: $(e.target).find('[name=title]').val(),
            dates: dates,
            products: products
        };

        var errors = validateEvent(event);
        if (errors.title || errors.dates || errors.products) {
            return Session.set('eventSubmitErrors', errors);
        }

        Meteor.call('eventInsert', event, function(error, result) {
           // display the error to the user and abort
            if (error) {
                return throwError(error.reason);
            }

            Router.go('eventPage', {_id: result._id});  
        });
    }
});