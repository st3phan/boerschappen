Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading'
});

Router.route('/sign-in', {
    name: 'loginButtons',
    fastRender: true
});

Router.route('/', {
    name: 'home',
    waitOn: function() {
        return Meteor.subscribe('events');
    },
    data: function() {
        return Events.find({}, {
            sort: {
                dates: -1
            }
        });
    },
    fastRender: true
});

Router.route('/event/:_id', {
    name: 'eventPage',
    waitOn: function() {
        return [
            Meteor.subscribe('event', this.params._id),
            Meteor.subscribe('products'),
            Meteor.subscribe('comments'),
            Meteor.subscribe('votes')
        ];
    },
    data: function() {
        return Events.findOne(this.params._id);
    },
    fastRender: true
});

Router.route('/products', {
    name: 'productsPage',
    waitOn: function() {
        return [
            Meteor.subscribe('products')
        ];
    },
    data: function() {
        return Products.find();
    },
    fastRender: true
});

Router.route('/product/:_id', {
    name: 'productPage',
    waitOn: function() {
        return Meteor.subscribe('product', this.params._id);
    },
    data: function() {
        return Products.findOne(this.params._id);
    },
    fastRender: true
});

Router.route('/announcements', {
    name: 'announcements',
    waitOn: function() {

    },
    data: function() {

    },
    fastRender: true
});

// Admin routes
// ----------------------------------------

Router.route('/admin/products', {
    name: 'adminProducts',
    waitOn: function() {
        return Meteor.subscribe('products');
    },
    data: function() {
        return Products.find();
    },
    fastRender: true
});

Router.route('/admin/events', {
    name: 'adminEvents',
    waitOn: function() {
        return Meteor.subscribe('events');
    },
    data: function() {
        return Events.find();
    },
    fastRender: true
});

Router.route('/admin/', {
    name: 'admin',
    fastRender: true
});

Router.route('/admin/product/submit', {
    name: 'productSubmit',
    fastRender: true
});

Router.route('/admin/product/:_id/edit', {
    name: 'productEdit',
    waitOn: function() { 
        return [
            Meteor.subscribe('product', this.params._id)
        ]
    },
    data: function() {
        return Products.findOne(this.params._id);
    },
    fastRender: true
});

Router.route('/admin/event/submit', {
    name: 'eventSubmit',
    waitOn: function() {
        return [
            Meteor.subscribe('products')
        ]
    },
    fastRender: true
});

Router.route('/admin/event/:_id/edit', {
    name: 'eventEdit',
    waitOn: function() { 
        return [
            Meteor.subscribe('products'),
            Meteor.subscribe('event', this.params._id)
        ]
    },
    data: function() {
        return Events.findOne(this.params._id);
    },
    fastRender: true
});

// Actions
// ----------------------------------------

var onBeforeActions = {
    // Check credentials
    adminRequired: function() {
        var loggedInUser = Meteor.user();
        if (!loggedInUser) {
            if (Meteor.loggingIn()) {
                this.render(this.loadingTemplate);
            } else {
                this.render('accessDenied');
            }
        } else {
            if (!Roles.userIsInRole(loggedInUser, ['admin'])) {
                this.render('accessDenied');
            } else {
                this.next();
            }
        }
    },
    checkResetPasswordToken: function() {
        if (Accounts._resetPasswordToken) {
            Router.go('loginButtons');
        }
        this.next();
    }
};

var onAfterActions = {
    // Reset scroll
    resetScroll: function () {
        $('html').scrollTop(0);
    },
    // Toggle the back button
    toggleBackButton: function() {
        if (Router.current().route.getName() == 'home') {
            $('#back').hide();
        } else {
            $('#back').show();
        }
    }
};

if(Meteor.isClient) {
    Router.onAfterAction(onAfterActions.resetScroll);
    Router.onAfterAction(onAfterActions.toggleBackButton);
}

Router.onBeforeAction(onBeforeActions.adminRequired, {
    only: [
        'admin',
        'adminEvents',
        'adminProducts',
        'eventSubmit',
        'eventEdit',
        'productSubmit',
        'productEdit'
    ]
});

Router.onBeforeAction(onBeforeActions.checkResetPasswordToken, {
    only: [
        'home'
    ]
});