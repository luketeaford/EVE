EVE.startSynth = function startSynth() {
    'use strict';
    var i;
    console.log('Start synth called');
    for (i = 0; i < EVE.config.harmonics; i += 1) {
        EVE.harmonicOscs[i].start(0);
    }
    EVE.startSynth = function startSynth() {
        console.warn('startSynth already called');
        return true;
    };
    return true;
};
