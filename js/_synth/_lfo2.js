EVE.lfo2 = {};

(function buildLfo2() {
    'use strict';
    var i;

    EVE.lfo2 = EVE.synth.createOscillator();
    EVE.lfo2.frequency.value = EVE.program.lfo2_rate;
    EVE.lfo2.type = EVE.program.lfo2_type;

    // VCAs
    EVE.lfo2_amp = EVE.synth.createGain();
    EVE.lfo2_amp.gain.value = EVE.program.lfo2_amp;
    EVE.lfo2_pitch = EVE.synth.createGain();
    EVE.lfo2_pitch.gain.value = EVE.program.lfo2_pitch;

    // Connect LFOs to VCAs
    EVE.lfo2.connect(EVE.lfo2_amp);
    EVE.lfo2.connect(EVE.lfo2_pitch);

    // VCA to amp
    EVE.lfo2_amp.connect(EVE.vca.gain);

    // VCA to pitch
    for (i = 1; i < EVE.config.harmonics; i += 1) {
        EVE.lfo2_pitch.connect(EVE.harmonicOsc['osc' + i].frequency);
    }

    // LFO 2 modulates LFO 1?!
    // Probably in the wrong place because this connection can be toggled
    if (EVE.program.lfo1_track) {
        EVE.lfo2_pitch.connect(EVE.lfo1.frequency);
    }
}());
