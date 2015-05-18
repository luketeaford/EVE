(function buildVca() {
    'use strict';
    EVE.vca = EVE.synth.createGain();
    EVE.vca.gain.setValueAtTime(EVE.program.vca_g, EVE.now());
}());

(function connectVca() {
    'use strict';
    EVE.vca.connect(EVE.oscilloscope);
    EVE.vca.connect(EVE.synth.destination);
}());
