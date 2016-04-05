EVE = (function (module) {
    'use strict';
    module.setPitch = function (pitch) {
        var glide = module.preset.glide * module.config.glideMax + module.config.glideMin,
            i;

        for (i = 0; i < module.config.trackedOscs.length; i += 1) {
            module.config.trackedOscs[i].detune.setTargetAtTime(pitch, module.currentTime, glide);
        }
    };

    return module;
}(EVE));
