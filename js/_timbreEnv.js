EVE = (function (module) {
    'use strict';
    module.timbreEnv = {
        debug: true,
        attack: document.getElementById('timbre-a'),
        decay: document.getElementById('timbre-d'),
        sustain: document.getElementById('timbre-s'),
        release: document.getElementById('timbre-r'),

        update: function (e) {
            var p;

            if (e.target && e.target.dataset && e.target.dataset.program) {
                p = e.target.dataset.program;
            }

            if (module.timbreEnv.debug && console) {
                console.log(p, module.preset[p]);
            }
        }
    };

    return module;
}(EVE));
