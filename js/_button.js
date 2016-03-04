EVE = (function (module) {
    'use strict';

    var buttons = document.querySelectorAll('input[type=radio]'),
        debug = false,
        i;

    module.button = {
        press: function (e) {
            var prog = this.name,
                update = 'update' + e.path[2].dataset.update;

            if (module.preset[prog] !== this.value) {
                // Prevents numbers being stored as strings
                if (typeof this.value === 'string' && !isNaN(this.value - 1)) {
                    module.preset[prog] = parseFloat(this.value);
                } else {
                    module.preset[prog] = this.value;
                }
            }

            if (debug && console) {
                console.log('Updating', update);
            }

            // Broadcast change
            this.dispatchEvent(module.events[update]);

            return;
        }
    };

    for (i = 0; i < buttons.length; i += 1) {
        buttons[i].addEventListener('change', module.button.press);
    }

    return module;
}(EVE));
