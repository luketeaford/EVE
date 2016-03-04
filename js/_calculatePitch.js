EVE = (function (module) {
    'use strict';

    var keyboard = document.getElementById('keyboard');

    module.calculatePitch = function (note) {
        var n = note.target ? note.target.dataset.noteValue : note,
            pitch = module.keyboard.octaveShift * 1200 + parseFloat(n) + module.preset.fine * module.config.fineTuneRange;

        return module.setPitch(pitch);
    };

    module.testPitch = function (foo) {
        console.log('Foo is', foo);
        return;
    };

    // BIND EVENTS
    keyboard.addEventListener('mousedown', module.calculatePitch);
    keyboard.addEventListener('touchstart', module.calculatePitch);

    // EXPERIMENT
    document.addEventListener('testpitch', module.testPitch);

    return module;
}(EVE));
