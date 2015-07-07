EVE.calculatePitch = function (note) {
    'use strict';
    // TODO Needs EVE.fine added (+) after note at some point...
    var pitch = EVE.keyboard.octaveShift * 1200 + parseFloat(note);

    if (EVE.calculatePitch.debug === true && console) {
        console.log('Pitch: ', pitch);
    }

    return EVE.setPitch(pitch);
};

EVE.calculatePitch.debug = true;
