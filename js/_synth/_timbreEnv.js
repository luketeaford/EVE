EVE.timbreEnv = {
    debug: true,
    scope: document.getElementById('timbre-env'),
    attack: document.querySelector('#timbre-a'),
    decay: document.querySelector('#timbre-d'),
    sustain: document.querySelector('#timbre-s'),
    release: document.querySelector('#timbre-r'),
    update: function (e) {
        'use strict';
        var p;

        if (e.target && e.target.dataset && e.target.dataset.program) {
            p = e.target.dataset.program;
        }

        if (EVE.timbreEnv.debug && console) {
            console.log(p, EVE.program[p]);
        }
    }
};

EVE.timbreEnv.scope.addEventListener('update_timbre_env', EVE.timbreEnv.update);

EVE.update_timbre_env = new CustomEvent('update_timbre_env', {bubbles: true});
