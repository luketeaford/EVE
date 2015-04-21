EVE.customEvents = function customEvents() {
    'use strict';
    // Would be cool to store the custom events in an object
    EVE.press = new CustomEvent('press', {
        bubbles: true
    });

    EVE.navigate = new CustomEvent('navigate', {
        bubbles: true
    });

};

// Try creating a custom event for history state change
// Dispatch that event and listen for it on window

(function documentReady() {
    'use strict';

    // SET UP
    EVE.buildSynth();
    EVE.startSynth();
    EVE.customEvents();

    // Actually belongs in this function
    EVE.keyboard = document.getElementById('keyboard');

    EVE.keyboard.addEventListener('mousedown', EVE.gateOn);
    EVE.keyboard.addEventListener('mouseup', EVE.gateOff);

    // Custom events testing
    EVE.keyboard.addEventListener('press', function (e) {
        console.log('Set note via custom event to', e.target.dataset.noteValue);
    });
}());
