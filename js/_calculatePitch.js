EVE = (function (module) {
    'use strict';

    var keyboard = document.getElementById('keyboard');

    module.calculatePitch = function (note) {
        var n = event.target.dataset.noteValue || note,
            pitch = module.performance.octaveShift * 1200 + parseFloat(n);

        return module.setPitch(pitch);
    };

    keyboard.addEventListener('mousedown', module.calculatePitch);
    keyboard.addEventListener('touchstart', module.calculatePitch);

    return module;
}(EVE));
