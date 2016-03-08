EVE = (function (module) {
    'use strict';

    module.button = {
        press: function () {
            var prog,
                update,
                value;

            if (event.target.type === 'radio') {
                prog = event.target.name;
                update = 'update' + event.path[2].dataset.update;
                value = event.target.value;

                if (module.preset[prog] !== value) {
                    // Prevent numbers being stored as strings
                    if (typeof value === 'string' && !isNaN(value - 1)) {
                        module.preset[prog] = parseFloat(value);
                    } else {
                        module.preset[prog] = value;
                    }
                }

                event.target.dispatchEvent(module.events[update]);
            }

            return;
        }
    };

    document.addEventListener('change', module.button.press);

    return module;
}(EVE));
