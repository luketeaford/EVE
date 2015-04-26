// Try creating a custom event for history state change
// Dispatch that event and listen for it on window

(function documentReady() {
    'use strict';

    // Set up templates
    navTemplate();

    // Set up synth
    EVE.buildSynth();
    EVE.buildScope();
    EVE.startSynth();

    // Actually belongs in this function
    EVE.keyboard = document.getElementById('keyboard');

    EVE.keyboard.addEventListener('mousedown', EVE.gateOn);
    EVE.keyboard.addEventListener('mouseup', EVE.gateOff);

    // Custom events testing
    //EVE.keyboard.addEventListener('press', function (e) {
    //    console.log('Set note via custom event to', e.target.dataset.noteValue);
    //});

}());

(function collapsibleModules() {
    'use strict';
    var moduleTitles = document.querySelectorAll('section > h2'),
        i;

    function collapseMenu() {
        if (this.parentElement.dataset.state === 'open') {
            this.parentElement.dataset.state = 'closed';
        } else {
            this.parentElement.dataset.state = 'open';
        }
    }

    for (i = 0; i < moduleTitles.length; i += 1) {
        moduleTitles[i].addEventListener('click', collapseMenu);
    }
}());
