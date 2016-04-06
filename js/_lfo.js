EVE = (function (module) {
    'use strict';

    module.lfo = {
        togglePitchTracking: function (lfo) {

            if (module.config.trackedOscs.indexOf(module[lfo]) === -1) {
                module.config.trackedOscs.push(module[lfo]);
            } else {
                module.config.trackedOscs.splice(module.config.trackedOscs.indexOf(module[lfo]));
            }

            return;
        }
    };

    return module;
}(EVE));
