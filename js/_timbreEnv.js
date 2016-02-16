EVE = (function (module) {
    'use strict';
    var debug = false;

    module.timbreEnv = {
        attack: document.getElementById('timbre-a'),
        decay: document.getElementById('timbre-d'),
        sustain: document.getElementById('timbre-s'),
        release: document.getElementById('timbre-r'),

        gateOff: function () {
            if (debug && console) {
                console.log('Timbre envelope gate on');
            }
            return;
        },

        gateOn: function () {
            if (debug && console) {
                console.log('Timbre envelope gate off!');
            }
            return;
        },

        update: function (e) {
            var p;

            if (e.target && e.target.dataset && e.target.dataset.program) {
                p = e.target.dataset.program;
            }

            // DEBUG
            if (debug && console) {
                console.log(p, module.preset[p]);
            }
        }
    };

    document.addEventListener('updatetimbreenv', module.timbreEnv.update);
    document.addEventListener('gateon', module.timbreEnv.gateOn);
    document.addEventListener('gateoff', module.timbreEnv.gateOff);

    return module;
}(EVE));
