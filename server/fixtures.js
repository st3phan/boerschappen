if (Products.find().count() === 0) {
    //Products
    var productId_1 = Products.insert({
        name: 'Runderbiefstuk',
        origin: 'Henk Broeders',
        description: 'Capicola short loin brisket sirloin pork chop, ham bresaola.',
        submitted: new Date().toISOString(),
    });

    var productId_2 = Products.insert({
        name: 'Kipdrumsticks Tante Door',
        origin: 'Kapteijns - Diessen',
        description: 'Fatback doner ham hock tail chuck leberkas ball tip.',
        submitted: new Date().toISOString()
    });

    var productId_3 = Products.insert({
        name: 'Kokkels',
        origin: 'G&B - Yerseke',
        description: 'Leberkas beef ribs tongue t-bone strip steak swine ribeye turkey cow.',
        submitted: new Date().toISOString()
    });

    var productId_4 = Products.insert({
        name: 'Bloemkool',
        origin: 'Oppers - Middelbeers',
        description: 'Kevin andouille capicola, meatloaf venison jowl sausage swine ground round bacon prosciutto rump brisket pork chop.',
        submitted: new Date().toISOString()
    });

    var productId_5 = Products.insert({
        name: 'Prei',
        origin: 'Oppers - Middelbeers',
        description: 'Corned beef rump pork belly beef ribs, turducken meatball ham sausage.',
        submitted: new Date().toISOString()
    });

    // Events
    var eventId_1 = Events.insert({
        title: 'Week 47',
        dates: ['17-11-2014', '20-11-2014'],
        products: [
            productId_1,
            productId_2,
            productId_3,
            productId_4,
            productId_5
        ]
    });

    var eventId_2 = Events.insert({
        title: 'Week 48',
        dates: ['24-11-2014', '27-11-2014'],
        products: [
            productId_1,
            productId_2,
            productId_3
        ]
    });
}

if(!Meteor.users.find().count()) {
    var users = [
        { name:"Stephan", email:"stuiterbal@gmail.com", roles:[]},
        { name:"Boerschappen", email:"st3phan@gmail.com", roles:['admin']}
    ];

    _.each(users, function (user) {
        var id;

        id = Accounts.createUser({
            email: user.email.toLowerCase(),
            password: "test",
            profile: { name: user.name }
        });

        if (user.roles.length > 0) {
            // Need _id of existing user record so this call must come 
            // after `Accounts.createUser` or `Accounts.onCreate`
            Roles.addUsersToRoles(id, user.roles);
        }
    });
}