EVE.calculatePitch = function (note) {
    'use strict';
    // TODO Needs EVE.fine added (+) after note at some point...
    var pitch = EVE.keyboard.octaveShift * 1200 + parseFloat(note);

    // Need to use the dataset here (and above...)

    return EVE.setPitch(pitch);
};

EVE.calculatePitch.debug = true;

EVE.keyboard.scope.addEventListener('mousedown', EVE.calculatePitch);
EVE.keyboard.scope.addEventListener('touchstart', EVE.calculatePitch);
