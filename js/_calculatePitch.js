EVE.calculatePitch = function (note) {
    'use strict';
    // TODO pitch needs EVE.fine added (+) after n at some point...
    var n = note.target ? note.target.dataset.noteValue : note,
        pitch = EVE.keyboard.octaveShift * 1200 + parseFloat(n);

    return EVE.setPitch(pitch);
};

EVE.calculatePitch.debug = true;

EVE.keyboard.scope.addEventListener('mousedown', EVE.calculatePitch);
EVE.keyboard.scope.addEventListener('touchstart', EVE.calculatePitch);
