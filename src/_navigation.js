EVE = (function (module) {
    'use strict';
    var main = document.querySelector('main');

    module.navigation = document.querySelector('nav');

    module.navigate = function (event) {
        if (event.target) {
            main.dataset.visible = event.target.value;
        }
    };

    module.navigation.addEventListener('click', module.navigate);

    return module;
}(EVE));
