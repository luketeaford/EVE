EVE = (function (module) {
    'use strict';
    var debug = false;

    module.performance = {
        glide: document.getElementById('glide'),

        update: function (e) {
            var p;

            if (e.target && e.target.dataset && e.target.dataset.program) {
                p = e.target.dataset.program;
            }

            if (debug && console) {
                console.log(p, module.preset[p]);
            }

            switch (p) {
            case 'glide':
                module.preset.glide = module.preset.glide * module.config.glideMax + module.config.glideMin;
                break;
            }
        }
    };

    // BIND EVENTS
    document.addEventListener('updateperformance', module.performance.update);

    return module;
}(EVE));
