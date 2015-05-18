(function buildLfo2() {
    'use strict';
    EVE.lfo2 = EVE.synth.createOscillator();
    EVE.lfo2.frequency.setValueAtTime(EVE.program.lfo2_rate, EVE.now());
    EVE.lfo2.type = EVE.program.lfo2_type;
    EVE.oscillators.push(EVE.lfo2);
}());

(function buildLfo2Vcas() {
    'use strict';
    EVE.lfo2_amp = EVE.synth.createGain();
    EVE.lfo2_amp.gain.setValueAtTime(EVE.program.lfo2_amp, EVE.now());
    EVE.lfo2_pitch = EVE.synth.createGain();
    EVE.lfo2_pitch.gain.setValueAtTime(EVE.program.lfo2_pitch, EVE.now());
}());

(function connectLfo2() {
    'use strict';
    var i;
    // Oscillators to VCAs
    EVE.lfo2.connect(EVE.lfo2_amp);
    EVE.lfo2.connect(EVE.lfo2_pitch);
    // VCA to amp
    EVE.lfo2_amp.connect(EVE.vca.gain);
    // VCA to pitch
    for (i = 1; i <= EVE.config.harmonics; i += 1) {
        EVE.lfo2_pitch.connect(EVE['osc' + i].frequency);
    }
    EVE.lfo2_pitch.connect(EVE.lfo1.frequency);
}());
