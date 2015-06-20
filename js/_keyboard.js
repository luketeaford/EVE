EVE.keyboard = {
    debug: true,
    scope: document.getElementById('keyboard'),
    test: function (e) {
        'use strict';
        console.log(e.which);
    },
    touch: function (e) {
        'use strict';
        console.log('Keyboard touched', e);
    }
};

(function bindEvents() {
    'use strict';
    document.addEventListener('keypress', EVE.keyboard.test);
}());
