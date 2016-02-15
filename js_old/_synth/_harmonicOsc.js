EVE.harmonicOsc = {
    debug: true,
    scope: document.getElementById('harmonics'),
    inputs: document.querySelectorAll('#harmonics input'),
    update: function (e) {
        'use strict';
        var p;

        if (e.target && e.target.dataset && e.target.dataset.program) {
            p = e.target.dataset.program;
        }

        if (EVE.harmonicOsc.debug && console) {
            console.log(p, EVE.program[p]);
        }

        EVE.harmonicOsc[p].vca.gain.setValueAtTime(EVE.program[p], EVE.now());
    }
};

(function buildHarmonicOsc() {
    'use strict';
    var i,
        osc;

    // Mixer
    EVE.harmonicOsc.mixer = EVE.synth.createGain();
    EVE.harmonicOsc.mixer.gain.value = -1;

    for (i = 1; i <= 8; i += 1) {
        osc = 'osc' + i;
        // Oscillators
        EVE.harmonicOsc[osc] = EVE.synth.createOscillator();
        EVE.harmonicOsc[osc].frequency.value = EVE.config.masterFreq * i;
        EVE.harmonicOsc[osc].type = 'sine';

        // VCAs
        EVE.harmonicOsc[osc].vca = EVE.synth.createGain();
        EVE.harmonicOsc[osc].vca.gain.value = EVE.program[osc];

        // Connect each oscillator to its VCA
        EVE.harmonicOsc[osc].connect(EVE.harmonicOsc[osc].vca);

        // Connect each VCA to the mixer
        EVE.harmonicOsc[osc].vca.connect(EVE.harmonicOsc.mixer);

        // Connect the mixer to the master VCA
        EVE.harmonicOsc.mixer.connect(EVE.vca);
    }
}());


EVE.harmonicOsc.scope.addEventListener('update_harmonic_osc', EVE.harmonicOsc.update);

EVE.update_harmonic_osc = new CustomEvent('update_harmonic_osc', {bubbles: true});
