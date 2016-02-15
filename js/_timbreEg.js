EVE = (function (module) {
    'use strict';
    module.timbreEg = {
        debug: true,
        inputs: document.querySelectorAll('#timbre-eg input'),
        update: function (e) {
            var p;

            if (e.target && e.target.dataset && e.target.dataset.program) {
                p = e.target.dataset.program;
            }

            if (module.timbreEg.debug && console) {
                console.log(p, module.preset[p]);
            }
        }
    };

    return module;
}(EVE));
