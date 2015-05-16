//TODO Refactor this
EVE.calculatePitch = function (note) {
    'use strict';
    var oscs = EVE.harmonicOscs,
        i;

    if (EVE.program.lfo_tracking === 'true') {
        oscs.push(EVE.lfo);
    }

    for (i = 0; i < oscs.length; i += 1) {
        oscs[i].detune.setValueAtTime(note, EVE.synth.currentTime);
    }

    return;
};
