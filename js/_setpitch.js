EVE.set_pitch = function (note_value) {
    'use strict';
    var pitch = EVE.octave_shift * 1200 + note_value,
        i,
        oscx;

    // No glide
    for (i = 0; i < 8; i += 1) {
        oscx = 'osc' + (1 + i);
        EVE[oscx].detune.setValueAtTime(pitch, EVE.synth.currentTime);
    }

};
