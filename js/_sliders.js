EVE.slider = {
    grab: function () {
        'use strict';
        var prog = this.dataset.program,
            foolJSLint = 1;

        // Update program
        EVE.program[prog] = this.value * foolJSLint;

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
            // Exponential
            EVE[p + '_vca'].gain.setValueAtTime(EVE.program[p] * EVE.program[p], EVE.now());
            break;
        }
    }
};

(function bindSliders() {
    'use strict';
    var inputs = document.querySelectorAll('input[type=range]'),
        i;
// THE OLD WAY
//    var harmonics = document.getElementById('harmonics'),
//        inputs = harmonics.getElementsByTagName('input'),
//        i;

    for (i = 0; i < inputs.length; i += 1) {
        inputs[i].addEventListener('input', EVE.slider.grab);
    }

    console.log('Sliders bound');

}());
