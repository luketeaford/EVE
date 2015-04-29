// Try creating a custom event for history state change
// Dispatch that event and listen for it on window
(function documentReady() {
    'use strict';

    // Set up templates
    navTemplate();

    // Set up synth
    EVE.buildSynth();
    EVE.buildScope();

    document.addEventListener('update', EVE.slider.update);

}());
