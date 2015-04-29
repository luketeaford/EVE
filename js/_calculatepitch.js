EVE.calculatePitch = function (note) {
    'use strict';
    var i;

    for (i = 0; i < EVE.config.harmonics; i += 1) {
        EVE.harmonicOscs[i].detune.setValueAtTime(note, EVE.synth.currentTime);
    }
    return;
};
