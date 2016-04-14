EVE = (function (module) {
    'use strict';

    var updateMethods = {
        'lfo1': 'updatelfo1',
        'lfo2': 'updatelfo2'
    };

    module.button = {
        press: function (event) {
            var program,
                update,
                x;

            if (event.target.type === 'radio') {
                program = event.target.name;
                update = updateMethods[event.target.parentElement.parentElement.id];
                x = event.target.value;

                if (module.preset[program] !== x) {
                    // Prevent numbers being stored as strings
                    if (typeof x === 'string' && !isNaN(x - 1)) {
                        module.preset[program] = parseFloat(x);
                    } else {
                        module.preset[program] = x;
                    }
                }

                return event.target.dispatchEvent(module.events[update]);
            }

            return;
        }
    };

    document.addEventListener('change', module.button.press);

    return module;
}(EVE));
