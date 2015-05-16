window.AudioContext = window.AudioContext || window.webkitAudioContext;

var EVE = {
    synth: new AudioContext()
};

EVE.synth.start = function () {
    'use strict';
    var i;

    for (i = 0; i < EVE.oscillators.length; i += 1) {
        EVE.oscillators[i].start(0);
    }
};
