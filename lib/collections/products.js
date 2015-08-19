Products = new Mongo.Collection('products');

validateProduct = function (product) {
    var errors = {};
    if (!product.name)
        errors.name = "Vul a.u.b. een naam in.";
    if (!product.origin)
        errors.origin = "Vul a.u.b. een herkomst in.";
    return errors;
}

Meteor.methods({
    productInsert: function(productAttributes) {
        check(Meteor.userId(), String);
        check(productAttributes, {
            name: String,
            origin: String,
            description: String
        });

        productAttributes = _.extend(productAttributes, {
            submitted: new Date().getTime()
        });

        var errors = validateProduct(productAttributes);
        if (errors.name || errors.origin) {
            throw new Meteor.Error('invalid-product', "Please provide a name and the origin of the product");
        }

        var productId = Products.insert(productAttributes);

        return {
            _id: productId
        };
    },
    productUpdate: function(productId, productAttributes) {
        check(Meteor.userId(), String);
        check(productAttributes, {
            name: String,
            origin: String,
            description: String
        });

        var errors = validateProduct(productAttributes);
        if (errors.name || errors.origin) {
            throw new Meteor.Error('invalid-product', "Please provide a name and the origin of the product");
        }
        
        Products.update(productId, { $set: productAttributes });

        return {
            _id: productId
        };
    }
});