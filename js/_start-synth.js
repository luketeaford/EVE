(function initialize() {
    'use strict';

    function startSynth() {
        var i;

        for (i = 0; i < EVE.oscillators.length; i += 1) {
            EVE.oscillators[i].start(0);
        }

        document.removeEventListener('click', startSynth);
        document.removeEventListener('dblclick', startSynth);
        document.removeEventListener('keydown', startSynth);
        document.removeEventListener('touchstart', startSynth);
        document.removeEventListener('wheel', startSynth);
    }

    document.addEventListener('click', startSynth);
    document.addEventListener('dblclick', startSynth);
    document.addEventListener('keydown', startSynth);
    document.addEventListener('touchstart', startSynth);
    document.addEventListener('wheel', startSynth);
}());
