EVE = (function (module) {
    'use strict';
    var debug = true,
        glide = document.getElementById('glide'),
        lights = document.querySelectorAll('#octave-shift [data-light]');

    module.performance = {
        octaveShift: 0,

        shiftOctave: function (direction) {
            var i,
                oct,
                shift;

            if (event.target.dataset.shift || event.type === 'keypress') {
                oct = module.performance.octaveShift;
                shift = event.target.dataset.shift || direction;

                if ((oct > -2 && shift < 0) || (oct < 2 && shift > 0)) {
                    module.performance.octaveShift = oct + parseFloat(shift);
                    for (i = 0; i < lights.length; i += 1) {
                        lights[i].dataset.light =
                            i === module.performance.octaveShift + 2 ?
                                    'on' :
                                    'off';
                    }
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
