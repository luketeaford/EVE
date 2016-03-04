EVE = (function (module) {
    'use strict';

    var debug = true,
        i,
        inputs = document.querySelectorAll('input[type=range]');

    module.slider = {

        grab: function (e) {
            var program = this.dataset.program,
                update = 'update' + e.path[2].dataset.update,
                x = this.dataset.curve === 'lin' ? 1 : this.value;

            // Update program
            module.preset[program] = this.value * x;

            if (debug && console) {
                console.log('Updating', update);
            }

            // Broadcast change
            this.dispatchEvent(module.events[update]);

            return;
        }
    };

    for (i = 0; i < inputs.length; i += 1) {
        inputs[i].addEventListener('input', module.slider.grab);
    }

    return module;
}(EVE));
