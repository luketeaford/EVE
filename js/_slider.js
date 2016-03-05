EVE = (function (module) {
    'use strict';

    var debug = true,
        i,
        inputs = document.querySelectorAll('input[type=range]'),
        updateMethods = {
            'harmonic-oscillator': 'updateharmonicoscillator',
            'timbre-env': 'updatetimbreenv',
            'vca': 'updatevca',
            'lfo1': 'updatelfo1',
            'lfo2': 'updatelfo2',
            'performance': 'updateperformance'
        };


    module.slider = {

        grab: function (e) {
            var program = this.dataset.program,
                update = updateMethods[e.path[2].id],
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
