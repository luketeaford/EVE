EVE.lfo1 = {};

(function buildLfo1() {
    'use strict';
    var i,
        osc,
        lfo;
//        vca;
    // The LFO itself
    EVE.lfo1 = EVE.synth.createOscillator();
    EVE.lfo1.frequency.value = EVE.program.lfo1_rate;
    EVE.lfo1.type = EVE.program.lfo1_type;
    // LFO 1 VCAs
    for (i = 1; i <= EVE.config.harmonics; i += 1) {
        osc = 'osc' + i;
        lfo = osc + '_lfo';
//        vca = osc + '_vca';
        EVE[lfo] = EVE.synth.createGain();
        EVE[lfo].gain.value = EVE.program[lfo];
        // Connect LFO 1 to each LFO VCA
        EVE.lfo1.connect(EVE[lfo]);
        // Connect to harmonic oscillator VCAs
        EVE[lfo].connect(EVE.harmonicOsc[osc].vca.gain);
    }
}());
