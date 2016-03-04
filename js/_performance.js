// TODO What would happen if glide is 1 when preset is loaded? it would be longer than the tolerable maximum?
EVE = (function (module) {
    'use strict';
    var debug = true;

    module.performance = {
        fine: document.getElementById('fine'),
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
        },

        load: function () {
            module.performance.fine.value = module.preset.fine;
            module.performance.glide.value = module.preset.glide;
        }
    };

    document.addEventListener('updateperformance', module.performance.update);
    document.addEventListener('loadpreset', module.performance.load);

    return module;
}(EVE));
