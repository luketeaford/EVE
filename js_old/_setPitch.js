EVE.setPitch = function (pitch) {
    'use strict';
    var i;

    for (i = 1; i <= 8; i += 1) {
        EVE.harmonicOsc['osc' + i].detune.setTargetAtTime(pitch, EVE.now(), EVE.program.glide);
    }

    if (EVE.program.lfo1_range >= 440) {
        EVE.lfo1.detune.setValueAtTime(pitch, EVE.now(), EVE.program.glide);
    }

};

EVE.setPitch.debug = true;
