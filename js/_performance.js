// TODO If glide is 1 when preset is loaded, it would be longer than the
// tolerable maximum. Fix this!
EVE = (function (module) {
    'use strict';
    var debug = true,
        glide = document.getElementById('glide');

    module.performance = {

        update: function (e) {
            var p;

            if (e.target && e.target.dataset && e.target.dataset.program) {
                p = e.target.dataset.program;
            }

            if (debug && console) {
                console.log(p, module.preset[p]);
            }

            switch (p) {
            case 'fine':
                this.dispatchEvent(module.events.testpitch);
                module.adjustFineTune();
                break;
            case 'glide':
                module.preset.glide = module.preset.glide * module.config.glideMax + module.config.glideMin;
                break;
            }

            return;
        },

        load: function () {
            glide.value = module.preset.glide;

            return;
        }
    };

    document.addEventListener('updateperformance', module.performance.update);
    document.addEventListener('loadpreset', module.performance.load);

    return module;
}(EVE));
