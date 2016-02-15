// TODO Here, 'prog' is used instead of 'p'. And it's really a 'parameter' or something.
EVE = (function (module) {
    'use strict';

    var i,
        inputs = document.querySelectorAll('input[type=range]');

    module.slider = {
        debug: true,

        grab: function () {
            var prog = this.dataset.program,
                update = 'update' + this.parentElement.parentElement.parentElement.dataset.update,
                x = this.dataset.curve === 'lin' ? 1 : this.value;

            // Update program
            module.preset[prog] = this.value * x;

            if (module.slider.debug && console) {
                console.log('Updating', update);
            }

            // Broadcast change
            this.dispatchEvent(module.events[update]);
        }
    };

    for (i = 0; i < inputs.length; i += 1) {
        inputs[i].addEventListener('input', module.slider.grab);
    }

    return module;
}(EVE));
