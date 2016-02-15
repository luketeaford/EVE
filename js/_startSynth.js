EVE = (function (module) {
    'use strict';

    module.startSynth = function () {
        var i;

        for (i = 1; i <= 8; i += 1) {
            module.harmonicOscillator['osc' + i].start(0);
        }

        module.lfo1.start(0);
        module.lfo2.start(0);

        document.removeEventListener('click', module.startSynth);
        document.removeEventListener('keydown', module.startSynth);
        document.removeEventListener('mousedown', module.startSynth);
        document.removeEventListener('touchend', module.startSynth);

        module.startSynth = undefined;

        return;
    };

    document.addEventListener('click', module.startSynth);
    document.addEventListener('keydown', module.startSynth);
    document.addEventListener('mousedown', module.startSynth);
    document.addEventListener('touchend', module.startSynth);

    return module;
}(EVE));
