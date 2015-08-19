UI.registerHelper("loginButtons", function() {
    return Template.loginButtons;
});

// for convenience
var loginButtonsSession = Accounts.loginButtonsSession;

// reset password
if (Accounts._resetPasswordToken) {
    loginButtonsSession.set('inResetPasswordFlow', Accounts._resetPasswordToken);
}

Template.loginButtons.toggleDropdown = function() {
    toggleDropdown();
    focusInput();
};

//
// loginButtonLoggedIn template
//

Template.loginButtonsLoggedIn.helpers({
    displayName: function() {
        return displayName();
    }
});

Template.loginButtonsLoggedIn.events({
    'click #logout-link': function(e) {
        e.preventDefault();
        Meteor.logout();
    }
});

//
// loginButtonLoggedOut template
//

Template.loginButtonsLogin.helpers({
    inSignupFlow: function(e) {
        return loginButtonsSession.get('inSignupFlow');
    },
    inLoginFlow: function(e) {
        return !loginButtonsSession.get('inSignupFlow');
    }
});

Template.loginButtonsLoggedOut.helpers({
    inForgotPasswordFlow: function() {
        return loginButtonsSession.get('inForgotPasswordFlow');
    },
    inResetPasswordFlow: function() {
        return loginButtonsSession.get('inResetPasswordFlow');
    },
    isLoading: function() {
        return loginButtonsSession.get('isLoading'); 
    }
});

Template.loginButtons.events({
    'click #signup-link': function(event) {
        event.preventDefault();
        event.stopPropagation();

        loginButtonsSession.resetMessages();

        // store values of fields before switching to the signup form
        var username = trimmedElementValueById('login-username');
        var email = trimmedElementValueById('login-email');
        var usernameOrEmail = trimmedElementValueById('login-username-or-email');

        loginButtonsSession.set('inSignupFlow', true);
        loginButtonsSession.set('inForgotPasswordFlow', false);

        // force the ui to update so that we have the approprate fields to fill in
        Meteor.flush();

        // update new fields with appropriate defaults
        if (username !== null) {
            document.getElementById('login-username').value = username;
        } else if (email !== null) {
            document.getElementById('login-email').value = email;
        } else if (usernameOrEmail !== null) {
            if (usernameOrEmail.indexOf('@') === -1) {
                document.getElementById('login-username').value = usernameOrEmail;
            } else {
                document.getElementById('login-email').value = usernameOrEmail;
            }
        }
    },
    'click #back-to-login-link': function(event) {
        event.preventDefault();
        event.stopPropagation();

        loginButtonsSession.resetMessages();

        var username = trimmedElementValueById('login-username');
        var email = trimmedElementValueById('login-email') || trimmedElementValueById('forgot-password-email'); // Ughh. Standardize on names?

        loginButtonsSession.set('inSignupFlow', false);
        loginButtonsSession.set('inForgotPasswordFlow', false);
        loginButtonsSession.set('inResetPasswordFlow', false);

        // force the ui to update so that we have the approprate fields to fill in
        Meteor.flush();

        if (document.getElementById('login-username')) {
            document.getElementById('login-username').value = username;
        }
        if (document.getElementById('login-email')) {
            document.getElementById('login-email').value = email;
        }
        if (document.getElementById('login-username-or-email')) {
            document.getElementById('login-username-or-email').value = email || username;
        }
    },
    'click #forgot-password-link': function(event) {
        event.preventDefault();
        event.stopPropagation();

        loginButtonsSession.resetMessages();

        // store values of fields before swtiching to the signup form
        var email = trimmedElementValueById('login-email');
        var usernameOrEmail = trimmedElementValueById('login-username-or-email');

        loginButtonsSession.set('inSignupFlow', false);
        loginButtonsSession.set('inForgotPasswordFlow', true);

        // force the ui to update so that we have the approprate fields to fill in
        Meteor.flush();

        // update new fields with appropriate defaults
        if (email !== null) {
            document.getElementById('forgot-password-email').value = email;
        } else if (usernameOrEmail !== null) {
            if (usernameOrEmail.indexOf('@') !== -1) {
                document.getElementById('forgot-password-email').value = usernameOrEmail;
            }
        }
    },
    'click #login-buttons-reset-password': function(event) {
        event.preventDefault();
        event.stopPropagation();
        resetPassword();
    },
    'click #login-buttons-forgot-password': function(event) {
        event.preventDefault();
        event.stopPropagation();
        forgotPassword();
    },
    'click #login-buttons-password': function(event) {
        event.preventDefault();
        event.stopPropagation();
        loginOrSignup();
    }
});

//
// loginButtonsMessage template
//

Template.loginButtonsMessages.helpers({
    errorMessage: function() {
        return loginButtonsSession.get('errorMessage');
    },
    infoMessage: function() {
        return loginButtonsSession.get('infoMessage');
    }
});

//
// helpers
//

var displayName = function() {
    var user = Meteor.user();
    if (!user)
        return '';

    if (user.profile && user.profile.name)
        return user.profile.name;
    if (user.username)
        return user.username;
    if (user.emails && user.emails[0] && user.emails[0].address)
        return user.emails[0].address;

    return '';
};

var validateUsername = function(username) {
    if (username.length >= 3) {
        return true;
    } else {
        loginButtonsSession.errorMessage('(Gebruikers)naam te kort.');
        return false;
    }
};

var validateEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test(email)) {
        return true;
    } else {
        loginButtonsSession.errorMessage('Ongeldig e-mailadres.');
        return false;
    }
};

var validatePassword = function(password) {
    if (password.length >= 6) {
        return true;
    } else {
        loginButtonsSession.errorMessage('Wachtwoord te kort.');
        return false;
    }
};

var elementValueById = function(id) {
    var element = document.getElementById(id);
    if (!element) {
        return null;
    } else {
        return element.value;
    }
};

var trimmedElementValueById = function(id) {
    var element = document.getElementById(id);
    if (!element) {
        return null;
    } else {
        return element.value.replace(/^\s*|\s*$/g, ""); // trim;
    }
};

var matchPasswordAgainIfPresent = function() {
    // notably not trimmed. a password could (?) start or end with a space
    var passwordAgain = elementValueById('login-password-again');
    if (passwordAgain !== null) {
        // notably not trimmed. a password could (?) start or end with a space
        var password = elementValueById('login-password');
        if (password !== passwordAgain) {
            loginButtonsSession.errorMessage('Wachtwoorden komen niet overeen.');
            return false;
        }
    }
    return true;
};

var toggleDropdown = function() {
    $('body').toggleClass('-login-is-visible');
}

var focusInput = function() {
    setTimeout(function() {
        $(".login-form input").first().focus();
    }, 0);
};

var loginOrSignup = function() {
    if (loginButtonsSession.get('inSignupFlow')) {
        signup();
    } else {
        login();
    }
};

var login = function() {
    loginButtonsSession.resetMessages();

    var name = trimmedElementValueById('login-name');
    var username = trimmedElementValueById('login-username');
    var email = trimmedElementValueById('login-email');
    var usernameOrEmail = trimmedElementValueById('login-username-or-email');
    // notably not trimmed. a password could (?) start or end with a space
    var password = elementValueById('login-password');

    var loginSelector;
    if (username !== null) {
        if (!validateUsername(username)) {
            return;
        } else {
            loginSelector = {
                username: username
            };
        }
    } else if (email !== null) {
        if (!validateEmail(email)) {
            return;
        } else {
            loginSelector = {
                email: email.toLowerCase()
            };
        }
    } else if (usernameOrEmail !== null) {
        // Not sure how we should validate this. but this seems good enough (for now),
        // since an email must have at least 3 characters anyways
        if (validateUsername(usernameOrEmail)) {
            return;
        } else {
            loginSelector = usernameOrEmail;
        }
    } else {
        throw new Error("Unexpected -- no element to use as a login user selector");
    }

    Meteor.loginWithPassword(loginSelector, password, function(err, result) {
        if (err) {
            if (err.reason == 'Incorrect password') {
                err.reason = 'Wachwoord onjuist.';
            }
            //Session.set('errorMessage', error.reason || 'Unknown error');
            loginButtonsSession.errorMessage(err.reason || 'Unknown error');
        } else {
            loginButtonsSession.closeDropdown();
        }
    });
};

var signup = function() {
    loginButtonsSession.resetMessages();

    // to be passed to Accounts.createUser
    var options = {};
    // prepare the profile object
    options.profile = {};

    var name = trimmedElementValueById('login-name');
    if (!validateUsername(name)) {
        return;
    } else {
        options.profile.name = name;
    }

    var email = trimmedElementValueById('login-email');
    if (email !== null) {
        if (!validateEmail(email)) {
            return;
        } else {
            options.email = email.toLowerCase();
        }
    }

    // notably not trimmed. a password could (?) start or end with a space
    var password = elementValueById('login-password');
    if (!validatePassword(password)) {
        return;
    } else {
        options.password = password;
    }

    if (!matchPasswordAgainIfPresent()) {
        return;
    }

    console.log(options);

    Accounts.createUser(options, function(error) {
        if (error) {
            if (error.reason == 'Email already exists.') {
                error.reason = 'E-mail wordt al gebruikt.';
            }
            loginButtonsSession.errorMessage(error.reason || 'Unknown error');

        } else {
            loginButtonsSession.closeDropdown();
        }
    });
};

var forgotPassword = function() {
    loginButtonsSession.resetMessages();

    var email = trimmedElementValueById('forgot-password-email');
    if (validateEmail(email)) {
        loginButtonsSession.set('isLoading', true);

        Accounts.forgotPassword({
            email: email
        }, function(error) {
            if (error) {
                loginButtonsSession.errorMessage(error.reason || 'Unknown error');
            } else {
                loginButtonsSession.set('isLoading', false);
                loginButtonsSession.infoMessage('E-mail verzonden.');
            }
        });
    }
};

var resetPassword = function() {
    // notably not trimmed. a password could (?) start or end with a space
    var password = elementValueById('login-password');
    if (!validatePassword(password)) {
        return;
    }

    if (!matchPasswordAgainIfPresent()) {
        return;
    }

    Accounts.resetPassword(loginButtonsSession.get('inResetPasswordFlow'), password, function(err) {
        if (err) {
            loginButtonsSession.errorMessage('Sorry, er is iets misgegaan.');
        } else {
            loginButtonsSession.closeDropdown();
            loginButtonsSession.infoMessage('Web je wachtwoord reset. Welkom terug!');
        }
    });
};