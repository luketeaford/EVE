EVE = (function (module) {
    'use strict';
    var debug = false,
        bugzone = document.getElementById('bugzone'),
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
            var bend,
                i,
                x = event.pageX;

            event.preventDefault();

            switch (module.config.ribbonBehavior) {
            case 'pitch bend':
                bend = ((x - ribbon.origin) / module.config.ribbonBendScale) * module.config.ribbonBendRange + module.performance.pitch;

                for (i = 0; i < module.config.trackedOscs.length; i += 1) {
                    module.config.trackedOscs[i].detune.setTargetAtTime(bend, module.currentTime, module.config.ribbonBendSlew);
                }

                break;
            case 'pitch control':
                module.performance.pitch = module.performance.octaveShift * 1200 + (-2100 + x * ribbon.scale);


                console.log('This is the standard behavior');
                break;
            }


            // The right idea for pitch bend, but I want ribbon control
            //module.performance.pitchBend = bend * module.config.ribbonRange / module.config.ribbonRange;


            // RIBBON CONTROL
            //module.performance.pitch = module.performance.octaveShift * 1200 + (-2100 + x * ribbon.scale);

//            module.setPitch(module.performance.pitch);// Pitch bend

            // for (i = 0; i < module.config.trackedOscs.length; i += 1) {
            //     module.config.trackedOscs[i].detune.setTargetAtTime(module.performance.pitch, module.currentTime, module.config.ribbonControlSlew);
            // }

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

            event.target.addEventListener('mousemove', module.performance.ribbon);

            event.target.addEventListener('touchmove', module.performance.ribbon);

            event.target.style.cursor = 'col-resize';

            // V2 PITCH BEND
            ribbon.origin = event.pageX;
            bugzone.innerText = ribbon.origin;

            // PITCH CONTROL (V1)
            ribbon.size = ribbon.offsetWidth - 1;
            ribbon.scale = ribbon.size / module.config.ribbonControlRange;

            return;
        },

        stopRibbon: function (event) {
            event.preventDefault();

            event.target.removeEventListener('mousemove', module.performance.ribbon);

            event.target.removeEventListener('touchmove', module.performance.ribbon);

            event.target.style.cursor = '';

            module.setPitch(module.performance.pitch);

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
