// TODO Include legato options
EVE.setPitch = function (pitch) {
    'use strict';
    var i;

    // Staccato
    for (i = 1; i <= 8; i += 1) {
        EVE.harmonicOsc['osc' + i].detune.setValueAtTime(pitch, EVE.now());
    }

    if (EVE.program.lfo1_range >= 220) {
        EVE.lfo1.detune.setValueAtTime(pitch, EVE.now());
    }

};

EVE.setPitch.debug = true;
