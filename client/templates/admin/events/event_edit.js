    Template.eventEdit.created = function() {
    Session.set('eventEditErrors', {});
    Session.set('eventEditProducts', []);
    Session.set('eventEditDates', []);
}

Template.eventEdit.rendered = function() {

    $('.datepicker').pickadate({
        format: 'dd-mm-yyyy',
        onSet: function() {
            var selectedDates = _.union(_.compact(Session.get('eventEditDates')), this.get())
            Session.set('eventEditDates', selectedDates);
        }
    });

    Session.set('eventEditProducts', this.data.products);
    Session.set('eventEditDates', this.data.dates);
}

Template.eventEdit.helpers({
    products: function() {
        return Products.find({_id: { $nin: Session.get('eventEditProducts') }});
    },
    selectedProducts: function() {
        return Products.find({_id: { $in: Session.get('eventEditProducts')}});
    },
    selectedDates: function() {
        return Session.get('eventEditDates');
    },
    errorMessage: function(field) {
        return Session.get('eventEditErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('eventEditErrors')[field] ? 'has-error' : '';
    }
});

Template.eventEdit.events({
    'click form .datepicker': function(e) {
        e.preventDefault();
    },
    'click form .add-products': function(e) {
        e.preventDefault();
        
        var selectedProducts = $(e.target).parents('form').find('[name=products]').val();
        selectedProducts = _.union(_.compact(Session.get('eventEditProducts')), selectedProducts);
        Session.set('eventEditProducts', selectedProducts);
    },
    'click form .remove-product': function(e) {
        e.preventDefault();

        var productId = $(e.currentTarget).attr('data-product-id');
        var selectedProducts = _.without(Session.get('eventEditProducts'), productId);
        if (confirm('Weet je zeker dat je dit product wilt verwijderen?')) {
            Session.set('eventEditProducts', selectedProducts);
        }
    },
    'click form .remove-date': function(e) {
        e.preventDefault();

        var date = $(e.currentTarget).attr('data-date');
        var selectedDates = _.without(Session.get('eventEditDates'), date);
        if (confirm('Weet je zeker dat je '+date+' wilt verwijderen?')) {
            Session.set('eventEditDates', selectedDates);
        }
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
            return Session.set('eventEditErrors', errors);
        }

        Meteor.call('eventUpdate', this._id, event, function(error, result) {
           // display the error to the user and abort
            if (error) {
                return throwError(error.reason);
            }

            Router.go('eventPage', {_id: result._id});  
        });
    }
});