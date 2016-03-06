EVE = (function (module) {
    'use strict';

    module.button = {
        press: function (e) {
            var prog,
                update,
                value;

            if (e.target.type === 'radio') {
                prog = e.target.name;
                update = 'update' + e.path[2].dataset.update;
                value = e.target.value;

                if (module.preset[prog] !== value) {
                    // Prevent numbers being stored as strings
                    if (typeof value === 'string' && !isNaN(value - 1)) {
                        module.preset[prog] = parseFloat(value);
                    } else {
                        module.preset[prog] = value;
                    }
                }

                e.target.dispatchEvent(module.events[update]);
            }

            return;
        }
    };

    document.addEventListener('change', module.button.press);

    return module;
}(EVE));
