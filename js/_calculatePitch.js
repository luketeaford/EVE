EVE = (function (module) {
    'use strict';

    var keyboard = document.getElementById('keyboard');

    module.calculatePitch = function (event, note) {
        var n = note === 0 ? 0 : note || event.target.dataset.noteValue,
            pitch = module.performance.octaveShift * 1200 + parseFloat(n);

        module.performance.pitch = pitch;
        return module.setPitch(pitch);
    };

    keyboard.addEventListener('mousedown', module.calculatePitch);
    keyboard.addEventListener('touchstart', module.calculatePitch);

    return module;
}(EVE));
