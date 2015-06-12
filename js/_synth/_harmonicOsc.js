EVE.harmonicOsc = {};

(function buildHarmonicOsc() {
    'use strict';
    var i,
        osc;
    for (i = 1; i <= EVE.config.harmonics; i += 1) {
        osc = 'osc' + i;
        // Oscillators
        EVE.harmonicOsc[osc] = EVE.synth.createOscillator();
        EVE.harmonicOsc[osc].frequency.value = EVE.config.masterFreq * i;
        EVE.harmonicOsc[osc].type = 'sine';
        // VCAs
        EVE.harmonicOsc[osc].vca = EVE.synth.createGain();
        EVE.harmonicOsc[osc].vca.gain.value = EVE.program[osc];
        // Connect
        EVE.harmonicOsc[osc].connect(EVE.harmonicOsc[osc].vca);
        // TODO Listen for main VCA connection and then connect to that
        EVE.harmonicOsc[osc].vca.connect(EVE.vca);
    }
}());
