Template.adminProducts.helpers({
    products: function() {
        return Products.find({}, {
            sort: {
                name: 1
            }
        });
    }
});

Template.adminProducts.events({

});