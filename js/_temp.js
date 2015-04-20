EVE.customEvents = function customEvents() {
    'use strict';
    EVE.press = new CustomEvent('press', {
        bubbles: true
    });
};

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
        console.log('Set note to', e.target.dataset.noteValue);
    });
}());
