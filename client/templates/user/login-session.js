var KEY_PREFIX = "Meteor.loginButtons.";

Accounts.loginButtonsSession = {
    set: function(key, value) {
        if (_.contains(['errorMessage', 'infoMessage'], key))
            throw new Error("Don't set errorMessage or infoMessage directly. Instead, use errorMessage() or infoMessage().");

        this._set(key, value);
    },
    _set: function(key, value) {
        Session.set(KEY_PREFIX + key, value);
    },
    get: function(key) {
        return Session.get(KEY_PREFIX + key);
    },
    closeDropdown: function () {
        this.set('inSignupFlow', false);
        this.set('inForgotPasswordFlow', false);
        this.set('inResetPasswordFlow', false);
        this.set('resetPassword', false);
        this.resetMessages();
    },
    infoMessage: function(message) {
        this._set("errorMessage", null);
        this._set("infoMessage", message);
    },
    errorMessage: function(message) {
        this._set("errorMessage", message);
        this._set("infoMessage", null);
    },
    resetMessages: function() {
        this._set('infoMessage', null);
        this._set('errorMessage', null);
    }
}