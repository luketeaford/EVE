EVE = (function (module) {
    'use strict';
    var bugzone = document.getElementById('bugzone'),
        debug = false,
        glide = document.querySelector('[data-program=glide]'),
        lights = document.querySelectorAll('#octave-shift [data-light]'),
        octaveShift = document.getElementById('octave-shift'),
        ribbon = document.getElementById('ribbon');

    module.performance = {
        octaveShift: 0,
        pitch: 0,
        pitchBend: 0,

        bendPitch: function () {
            var bend = module.performance.pitchBend,
                i,
                pitch = module.performance.pitch,
                t = module.currentTime,
                x = bend + pitch,
                y = module.config.pitchBendSlew;

            for (i = 0; i < module.config.trackedOscs.length; i += 1) {
                module.config.trackedOscs[i].detune.setTargetAtTime(x, t, y);
            }
            return;
        },

        ribbon: function (event) {
            var x = event.pageX - ribbon.size;

            event.preventDefault();

            module.performance.pitchBend = x * module.config.ribbonBendRange / module.config.ribbonBendRange;

            bugzone.innerText = 'X is ' + module.performance.pitchBend;

            document.dispatchEvent(module.events.pitchbend);

            return;
        },

        shiftOctave: function (event, direction) {
            var i,
                oct = module.performance.octaveShift,
                shift = direction || event.target.dataset.shift;

            if (shift) {
                if ((oct > -2 && shift < 0) || (oct < 2 && shift > 0)) {
                    module.performance.octaveShift += parseFloat(shift);
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

        startRibbon: function (event) {
            event.preventDefault();

            bugzone.style.backgroundColor = '#0f0';

            event.target.addEventListener('mousemove', module.performance.ribbon);

            event.target.addEventListener('touchmove', module.performance.ribbon);

            event.target.style.cursor = 'col-resize';

            ribbon.size = (ribbon.offsetWidth - 1) / 2;

            return;
        },

        stopRibbon: function (event) {
            event.preventDefault();

            bugzone.style.backgroundColor = '';

            event.target.removeEventListener('mousemove', module.performance.ribbon);

            event.target.removeEventListener('touchmove', module.performance.ribbon);

            event.target.style.cursor = '';

            return;
        },

        update: function (event) {
            var program = event.target.dataset.program;

            if (debug && console) {
                console.log(program, module.preset[program]);
            }

            return;
        },

        load: function () {
            glide.value = module.preset.glide;
            return;
        }
    };


    document.addEventListener('loadpreset', module.performance.load);
    document.addEventListener('pitchbend', module.performance.bendPitch);
    document.addEventListener('updateperformance', module.performance.update);

    octaveShift.addEventListener('click', module.performance.shiftOctave);
    octaveShift.addEventListener('touchend', module.performance.shiftOctave);

    // EXPERIMENT
    ribbon.addEventListener('mousedown', module.performance.startRibbon);
    ribbon.addEventListener('mouseup', module.performance.stopRibbon);
    ribbon.addEventListener('touchstart', module.performance.startRibbon);
    ribbon.addEventListener('touchend', module.performance.stopRibbon);

    return module;
}(EVE));
