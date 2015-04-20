(function documentReady() {
    'use strict';
    // SET UP
    EVE.buildSynth();
    EVE.startSynth();

    // Actually belongs in this function
    EVE.keyboard = document.getElementById('keyboard');

    EVE.keyboard.addEventListener('mousedown', EVE.gateOn);
    EVE.keyboard.addEventListener('mouseup', EVE.gateOff);
}());
