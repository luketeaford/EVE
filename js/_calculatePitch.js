// TODO EVALUATE WHETHER OR NOT THINGS SHOULD BE BOUND TO THE KEYBOARD HERE
// TODO pitch needs a fine tune added (+) after n
EVE = (function (module) {
    'use strict';

    var keyboard = document.getElementById('keyboard');

    module.calculatePitch = function (note) {// This is really the event, right?
        var n = note.target ? note.target.dataset.noteValue : note,
            pitch = module.keyboard.octaveShift * 1200 + parseFloat(n) + module.preset.fine * module.config.fineTuneRange;

        return module.setPitch(pitch);
    };

    // BIND EVENTS
    keyboard.addEventListener('mousedown', module.calculatePitch);
    keyboard.addEventListener('touchstart', module.calculatePitch);

    return module;
}(EVE));
