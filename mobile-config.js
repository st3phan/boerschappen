App.info({
    name: 'Boerschappen',
    description: 'Een wekelijkse boodschappenbox in Breda met pure en seizoensgebonden producten van de lokale boer.',
    version: '0.0.1'
});

App.icons({
    'iphone': 'resources/icons/icon-60.png',
    'iphone_2x': 'resources/icons/icon-60@2x.png'
});

App.launchScreens({
    'iphone': 'resources/splash/Default~iphone.png',
    'iphone_2x': 'resources/splash/Default@2x~iphone.png',
    'iphone5': 'resources/splash/Default-568h@2x~iphone.png'
});

App.setPreference('StatusBarOverlaysWebView', 'false');
App.setPreference('StatusBarBackgroundColor', '#000000');