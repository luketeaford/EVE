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
        case 'osc1_lfo':
        case 'osc2_lfo':
        case 'osc3_lfo':
        case 'osc4_lfo':
        case 'osc5_lfo':
        case 'osc6_lfo':
        case 'osc7_lfo':
        case 'osc8_lfo':
        case 'lfo2_amp':
            EVE[p].gain.setValueAtTime(EVE.program[p], EVE.now());
            break;
        case 'lfo1_rate':
            EVE.lfo1.frequency.setValueAtTime(EVE.program.lfo1_rate * EVE.osc1.frequency.value, EVE.now());
            break;
        case 'lfo2_rate':
            EVE.lfo2.frequency.setValueAtTime(EVE.program.lfo2_rate * EVE.osc1.frequency.value, EVE.now());
            break;
        case 'lfo2_pitch':
            EVE.lfo2_pitch.gain.setValueAtTime(EVE.program.lfo2_pitch * 440, EVE.now());
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
