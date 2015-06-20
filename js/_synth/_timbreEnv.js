EVE.timbreEnv = {
    debug: true,
    scope: document.getElementById('timbre-env'),
    update: function (e) {
        'use strict';
        var p = e.target.dataset.program;

        if (EVE.timbreEnv.debug) {
            console.log(p, EVE.program[p]);
        }
    }
};

EVE.timbreEnv.scope.addEventListener('update_timbre_env', EVE.timbreEnv.update);

EVE.update_timbre_env = new CustomEvent('update_timbre_env', {bubbles: true});
