(function initialize() {
    'use strict';

    function startSynth() {
        var i;

        // Harmonic Oscillator
        for (i = 1; i <= 8; i += 1) {
            EVE.harmonicOsc['osc' + i].start(0);
        }

        // LFO 1
        EVE.lfo1.start(0);

        // LFO 2
        EVE.lfo2.start(0);

        document.removeEventListener('click', startSynth);
        document.removeEventListener('dblclick', startSynth);
        document.removeEventListener('keydown', startSynth);
        document.removeEventListener('touchend', startSynth);
        document.removeEventListener('wheel', startSynth);
    }

    document.addEventListener('click', startSynth);
    document.addEventListener('dblclick', startSynth);
    document.addEventListener('keydown', startSynth);
    document.addEventListener('touchend', startSynth);
    document.addEventListener('wheel', startSynth);
}());
