// Try creating a custom event for history state change
// Dispatch that event and listen for it on window

(function documentReady() {
    'use strict';

    // Set up templates
    navTemplate();

    // Set up synth
    EVE.buildSynth();
    EVE.startSynth();

    // Actually belongs in this function
    //EVE.keyboard = document.getElementById('keyboard');

    //EVE.keyboard.addEventListener('mousedown', EVE.gateOn);
    //EVE.keyboard.addEventListener('mouseup', EVE.gateOff);

    // Custom events testing
    //EVE.keyboard.addEventListener('press', function (e) {
    //    console.log('Set note via custom event to', e.target.dataset.noteValue);
    //});
}());
