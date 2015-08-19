SSR.compileTemplate('register', Assets.getText('register.html'));
SSR.compileTemplate('resetPassword', Assets.getText('reset_password.html'));

Accounts.emailTemplates.siteName = "Boerschappen";
Accounts.emailTemplates.from = "Boerschappen <info@boerschappen.nl>";
Accounts.emailTemplates.resetPassword.subject = function (user) {
    return "Wachtwoord resetten";
};
Accounts.emailTemplates.resetPassword.html = function (user, url) {
    return SSR.render("resetPassword", {
        name: user.profile.name,
        absoluteUrl: Meteor.absoluteUrl('', {replaceLocalhost: true}),
        url: url
    });
};

Accounts.onCreateUser(function(options, user) {
    // We're enforcing at least an empty profile object to avoid needing to check
    // for its existence later.
    user.profile = options.profile ? options.profile : {};

    // Template are in the /private folder
    var html = SSR.render("register", {
        name: options.profile.name,
        username: user.emails[0].address,
        absoluteUrl: Meteor.absoluteUrl('', {replaceLocalhost: true})
    });

    // we wait for Meteor to create the user before sending an email
    Meteor.setTimeout(function() {
        Email.send({
            from: Accounts.emailTemplates.from,
            to: user.emails[0].address,
            subject: "Welkom bij boerschappen",
            html: html
        });
    }, 2 * 1000);

    return user;
});


// Accounts.validateLoginAttempt(function(info){
//     if(info.user && info.user.emails && !info.user.emails[0].verified) {
//         throw new Meteor.Error(100002, 'E-mailadres niet bevestigd.');
//     }
//     return true;
// });

// Accounts.onCreateUser(function(options, user) {
//     // user.profile = {};

//     // // we wait for Meteor to create the user before sending an email
//     // Meteor.setTimeout(function() {
//     //     Accounts.sendVerificationEmail(user._id);
//     // }, 2 * 1000);

//     // return user;

//     console.log(user);


//     // var html = SSR.render("emailText", {username: user.profile.name});

//     // Email.send({
//     //     from: "Boerschappen <info@boerschappen.nl>",
//     //     to: "john.doe@gmail.com",
//     //     subject: "Any subject...",
//     //     html: html
//     // });
// });