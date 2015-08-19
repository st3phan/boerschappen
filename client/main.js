Meteor.startup( function () {
    // prepend svg sprite map to body
    // so this will work in IE>10 too
    $.get('img/svg/sprite/sprite.svg', function(data) {
        var $div = $('<div></div>').hide().append(data);
        $('body').prepend($div);
    }, 'html');
});