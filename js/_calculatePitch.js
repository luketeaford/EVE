EVE = (function (module) {
    'use strict';

    var keyboard = document.getElementById('keyboard');

    module.calculatePitch = function (note) {
        var n = note.target ? note.target.dataset.noteValue : note,
            pitch = module.performance.octaveShift * 1200 + parseFloat(n);

        return module.setPitch(pitch);
    };

    // BIND EVENTS
    keyboard.addEventListener('mousedown', module.calculatePitch);
    keyboard.addEventListener('touchstart', module.calculatePitch);

    return module;
}(EVE));
