// TODO: WRITE DATA-ATTRIBUTES TO THE BODY I GUESS
// TODO: RENAME HEADER TO NAVIGATION OR SOMETHING
EVE = (function (module) {
    'use strict';
    var nav = document.querySelector('nav'),
        main = document.querySelector('main'),
        navMap = {
            'edit': 'showEdit',
            'config': 'showConfig'
        };

    module.header = {
        navigate: function (event) {
            var x;

            if (event.target) {
                x = navMap[event.target.value];
                //body.dataset[x] = 'true';
                main.dataset.visible = event.target.value;
            }
        }
    };

    nav.addEventListener('click', module.header.navigate);

    return module;
}(EVE));
