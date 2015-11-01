EVE.timbreEg = {
    debug: true,
    scope: document.getElementById('timbre-eg'),
    update: function (e) {
        'use strict';
        var p;

        if (e.target && e.target.dataset && e.target.dataset.program) {
            p = e.target.dataset.program;
        }

        if (EVE.timbreEg.debug && console) {
            console.log(p, EVE.program[p]);
        }

    }
};

EVE.timbreEg.scope.addEventListener('update_timbre_eg', EVE.timbreEg.update);

EVE.update_timbre_eg = new CustomEvent('update_timbre_eg', {bubbles: true});
