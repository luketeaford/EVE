EVE.startSynth = function startSynth() {
    'use strict';
    var i;

    for (i = 0; i < EVE.config.harmonics; i += 1) {
        EVE.harmonicOscs[i].start(0);
    }

    EVE.lfo.start(0);

    document.removeEventListener('click', startSynth);
    document.removeEventListener('dblclick', startSynth);
    document.removeEventListener('keydown', startSynth);
    document.removeEventListener('touchstart', startSynth);
    document.removeEventListener('wheel', startSynth);

    EVE.startSynth = function startSynth() {
        console.warn('Synth can only be started once');
        return true;
    };
};

document.addEventListener('click', EVE.startSynth);
document.addEventListener('dblclick', EVE.startSynth);
document.addEventListener('keydown', EVE.startSynth);
document.addEventListener('touchstart', EVE.startSynth);
document.addEventListener('wheel', EVE.startSynth);
