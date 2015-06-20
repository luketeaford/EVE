// TODO Refactor this so this function only figures out the pitch, and another
// function is used to actually set the pitch.
EVE.calculatePitch = function (note) {
    'use strict';
    var i;

    for (i = 1; i <= EVE.config.harmonics; i += 1) {
        EVE.harmonicOsc['osc' + i].detune.setValueAtTime(note, EVE.now());
    }
    console.log('note', note);
    return;
};

EVE.setPitch = function (note) {
    'use strict';

    var i;

    for (i = 1; i <= EVE.config.harmonics; i += 1) {
        EVE.harmonicOsc['osc' + i].detune.setValueAtTime(note, EVE.now());
    }

    if (EVE.program.lfo1_track) {
        EVE.lfo1.detune.setValueAtTime(note, EVE.now());
    }

    console.log('Fool JSLint', note);

    return 'Should include portamento and staccato options';
};
