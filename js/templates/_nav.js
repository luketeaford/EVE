EVE.templates = {
    nav: function () {
        'use strict';
        // Obviously none of this is appropriate -- am only playing around
        var nav = document.getElementById('nav'),
            links = nav.getElementsByTagName('a'),
            login;

        login = EVE.has_registered ? 'Sign In' : 'Register';
        login = EVE.user ? 'Hello, ' + EVE.user.username : 'you';
        links[0].innerText = login;
    }
};
