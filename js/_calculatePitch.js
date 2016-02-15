// TODO pitch needs a fine tune added (+) after n
EVE = (function (module) {
    'use strict';

    EVE.calculatePitch = function (note) {
        var n = note.target ? note.target.dataset.noteValue : note,
            pitch = module.keyboard.octaveShift * 1200 + parseFloat(n);

        return module.setPitch(pitch);
    };

    module.calculatePitch.debug = true;

    //module.keyboard.addEventListener('mousedown', module.calculatePitch);
    //module.keyboard.addEventListener('touchstart', module.calculatePitch);

    return module;
}(EVE));
