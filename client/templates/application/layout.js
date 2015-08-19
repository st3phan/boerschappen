Template.registerHelper("setTitle", function() {
    if (typeof arguments[1] === 'object') {
        var subtitle = _.map(arguments[1], function(val) {
            return val;
        }).join(' / ');
    }

    Session.set("documentTitle", arguments[0]);

    if (arguments[1].length) {
        Session.set("documentSubTitle", subtitle || arguments[1]);
    } else {
        Session.set('documentSubTitle', false)
    }
});
