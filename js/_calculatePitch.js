// TODO EVALUATE WHETHER OR NOT THINGS SHOULD BE BOUND TO THE KEYBOARD HERE
// TODO pitch needs a fine tune added (+) after n
EVE = (function (module) {
    'use strict';

    var debug = true,
        keyboard = document.getElementById('keyboard');

    EVE.calculatePitch = function (note) {
        var n = note.target ? note.target.dataset.noteValue : note,
            pitch = module.keyboard.octaveShift * 1200 + parseFloat(n);

        return module.setPitch(pitch);
    };

    // DEBUG
    if (debug && console) {
        console.log('Calculating pitch');
    }

    // BIND EVENTS
    keyboard.addEventListener('mousedown', module.calculatePitch);
    keyboard.addEventListener('touchstart', module.calculatePitch);

    return module;
}(EVE));
