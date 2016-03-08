EVE = (function (module) {
    'use strict';
    var debug = true,
        glide = document.getElementById('glide'),
        lights = document.querySelectorAll('#octave-shift [data-light]'),
        octaveShift = document.getElementById('octave-shift');

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

        update: function () {
            var p;

            if (event.target && event.target.dataset && event.target.dataset.program) {
                p = event.target.dataset.program;
            } else {
                console.log('Something wrong with performance');
            }

            if (debug && console) {
                console.log(p, module.preset[p]);
            }

            console.log('Updating performance');

            return;
        },

        load: function () {
            glide.value = module.preset.glide;

            return;
        }
    };


    document.addEventListener('loadpreset', module.performance.load);
    document.addEventListener('updateperformance', module.performance.update);

    octaveShift.addEventListener('click', module.performance.shiftOctave);
    octaveShift.addEventListener('touchend', module.performance.shiftOctave);

    return module;
}(EVE));
