EVE = (function (module) {
    'use strict';
    var debug = false;

    module.timbreEg = {
        inputs: document.querySelectorAll('#timbre-eg input'),

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

    // BIND EVENTS
    document.addEventListener('updatetimbreeg', module.timbreEg.update);

    return module;
}(EVE));
