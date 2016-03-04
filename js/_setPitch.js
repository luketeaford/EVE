EVE = (function (module) {
    'use strict';
    module.setPitch = function (pitch) {
        var i;

        for (i = 1; i <= 8; i += 1) {
            module.harmonicOscillator['osc' + i].detune.setTargetAtTime(pitch, module.now(), module.preset.glide);
        }

        if (module.preset.lfo1_range >= 440) {
            module.lfo1.detune.setValueAtTime(pitch, module.now(), module.preset.glide);
        }

        return;
    };

    return module;
}(EVE));
