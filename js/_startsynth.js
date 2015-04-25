EVE.startSynth = function startSynth() {
    'use strict';
    var i;
    for (i = 0; i < EVE.config.harmonics; i += 1) {
        EVE.harmonicOscs[i].start(0);
    }
    EVE.startSynth = function startSynth() {
        console.warn('startSynth already called');
        return 'Synth can only be started once';
    };
    return true;
};
