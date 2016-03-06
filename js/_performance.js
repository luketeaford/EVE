// TODO If glide is 1 when preset is loaded, it would be longer than the
// tolerable maximum. Fix this!
EVE = (function (module) {
    'use strict';
    var debug = true,
        glide = document.getElementById('glide'),
        lights = document.querySelectorAll('#performance [data-light]');

    module.performance = {
        octaveShift: 0,

        shiftOctave: function (direction) {
            var i = 0,
                oct = module.performance.octaveShift,
                shift = this.dataset ? this.dataset.shift : direction;

            console.log('DIRECTION:', direction);
            console.log('SHIFT:', shift);

            if ((oct > -2 && shift < 0) || (oct < 2 && shift > 0)) {
                module.performance.octaveShift = oct + parseFloat(shift);
                for (i = 0; i < lights.length; i += 1) {
                    lights[i].dataset.light =
                        i === module.performance.octaveShift + 2 ?
                                'on' :
                                'off';
                }
            }

            return;
        },

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
