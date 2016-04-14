EVE = (function (module) {
    'use strict';
    var debug = true;

    module.router = {
        clean: function () {
            var hash = window.location.hash.replace('#', '');
            history.pushState('', document.title, hash);
        },
        test: function (event) {
            console.log(event);
        }
    };

    if (debug && console) {
        console.log('Router loaded');
    }

    window.addEventListener('hashchange', module.router.clean);

    return module;
}(EVE));
