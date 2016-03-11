EVE = (function (module) {
    'use strict';
    module.setPitch = function (pitch) {
        var glide = module.preset.glide * module.config.glideMax + module.config.glideMin,
            i;

        for (i = 1; i <= 8; i += 1) {
            module.harmonicOscillator['osc' + i].detune.setTargetAtTime(pitch, module.now(), glide);
        }

        if (module.preset.lfo1_range === 'track') {
            module.lfo1.detune.setTargetAtTime(pitch, module.now(), glide);
        }

        return;
    };

    return module;
}(EVE));
