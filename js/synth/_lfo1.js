(function buildLfo1() {
    'use strict';
    EVE.lfo1 = EVE.synth.createOscillator();
    EVE.lfo1.frequency.setValueAtTime(EVE.program.lfo1_rate, EVE.now());
    EVE.lfo1.type = EVE.program.lfo1_type;
    EVE.oscillators.push(EVE.lfo1);
}());

(function buildLfo1Vcas() {
    'use strict';
    var i,
        osc,
        lfo;
    for (i = 1; i <= EVE.config.harmonics; i += 1) {
        osc = 'osc' + i;
        lfo = osc + '_lfo';
        EVE[lfo] = EVE.synth.createGain();
        EVE[lfo].gain.setValueAtTime(EVE.program[lfo], EVE.now());
    }
}());

(function connectLfo1() {
    'use strict';
    var i,
        osc,
        lfo,
        vca;
    for (i = 1; i <= EVE.config.harmonics; i += 1) {
        osc = 'osc' + i;
        lfo = osc + '_lfo';
        vca = osc + '_vca';
        EVE.lfo1.connect(EVE[lfo]);
        EVE[lfo].connect(EVE[vca].gain);
    }
}());
