// server/smtp.js
Meteor.startup(function() {
    var smtp = {
        username: 'xxxxx@gmail.com',
        password: 'xxxxx',
        server:   'smtp.gmail.com',
        port: 587
    }

    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port+'/';
});
