EVE.slider = {
    grab: function () {
        'use strict';
        var prog = this.dataset.program,
            x = this.dataset.curve === 'lin' ? 1 : this.value;

        // Update program
        EVE.program[prog] = this.value * x;

        // Broadcast change
        this.dispatchEvent(EVE.events.update);

    },

    update: function (e) {
        'use strict';
        var p = e.target.dataset.program;

        switch (p) {
        // Harmonic Oscillators
        case 'osc1':
        case 'osc2':
        case 'osc3':
        case 'osc4':
        case 'osc5':
        case 'osc6':
        case 'osc7':
        case 'osc8':
            EVE[p + '_vca'].gain.setValueAtTime(EVE.program[p], EVE.now());
            break;
        case 'vca_g':
            EVE.vca.gain.setValueAtTime(EVE.program.vca_g, EVE.now());
            break;
        case 'lfo1':
        case 'lfo2':
        case 'lfo3':
        case 'lfo4':
        case 'lfo5':
        case 'lfo6':
        case 'lfo7':
        case 'lfo8':
            // TODO probably don't need switch statement...
            EVE[p].gain.setValueAtTime(EVE.program[p], EVE.now());
            break;
        }
    }
};

(function bindSliders() {
    'use strict';
    var inputs = document.querySelectorAll('input[type=range]'),
        i;

    for (i = 0; i < inputs.length; i += 1) {
        inputs[i].addEventListener('input', EVE.slider.grab);
    }

}());
