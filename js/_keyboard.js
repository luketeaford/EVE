EVE.keyboard = {
    debug: true,
    scope: document.getElementById('keyboard'),
    test: function (e) {
        'use strict';
        if (console) {
            console.log(e.which);
        }
    },
    touch: function (e) {
        'use strict';
        if (console) {
            console.log('Keyboard touched', e);
        }
    }
};

(function bindEvents() {
    'use strict';
    document.addEventListener('keypress', EVE.keyboard.test);
}());
