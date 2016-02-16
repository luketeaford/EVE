EVE = (function (module) {
    'use strict';
    var debug = false,
        i,
        osc;

    module.harmonicOscillator = {

        inputs: document.querySelectorAll('#harmonic-oscillator input'),

        update: function (e) {
            var p;

            if (e.target && e.target.dataset && e.target.dataset.program) {
                p = e.target.dataset.program;
            }

            module.harmonicOscillator[p].vca.gain.setValueAtTime(module.preset[p], module.now());

            // DEBUG
            if (debug && console) {
                console.log(p, module.preset[p]);
            }
        }
    };

    // Harmonic oscillator mixer
    module.harmonicOscillator.mixer = module.createGain();
    module.harmonicOscillator.mixer.gain.value = -1;

    for (i = 1; i <= 8; i += 1) {
        osc = 'osc' + i;
        // Oscillators
        module.harmonicOscillator[osc] = module.createOscillator();
        module.harmonicOscillator[osc].frequency.value = module.config.masterFreq * i;
        module.harmonicOscillator[osc].type = 'sine';

        // VCAs
        module.harmonicOscillator[osc].vca = module.createGain();
        module.harmonicOscillator[osc].vca.gain.value = module.preset[osc];

        // Connect each oscillator to its VCA
        module.harmonicOscillator[osc].connect(module.harmonicOscillator[osc].vca);

        // Connect each VCA to the harmonic oscillator mixer
        module.harmonicOscillator[osc].vca.connect(module.harmonicOscillator.mixer);

        // Connect the mixer to the master VCA
        module.harmonicOscillator.mixer.connect(module.vca);
    }

    // EVENT BINDINGS
    document.addEventListener('updateharmonicoscillator', module.harmonicOscillator.update);

    return module;
}(EVE));
