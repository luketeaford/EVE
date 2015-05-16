(function connectSynth() {
    'use strict';

    (function connectHarmonicOscs() {
        var i,
            osc,
            vca;
        for (i = 1; i <= EVE.config.harmonics; i += 1) {
            osc = 'osc' + i;
            vca = osc + '_vca';
            EVE[osc].connect(EVE[vca]);
            EVE[vca].connect(EVE.vca);
        }
    }());

    (function connectLfo1() {
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

    (function connectLfo2() {
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

    (function connectVca() {
        EVE.vca.connect(EVE.oscilloscope);
        EVE.vca.connect(EVE.synth.destination);
    }());

}());
