EVE = (function (module) {
    'use strict';
    var attack = document.querySelector('[data-program=timbre_a]'),
        debug = false,
        decay = document.querySelector('[data-program=timbre_d]'),
        amounts = document.querySelectorAll('#timbre-env [data-program^=osc]'),
        release = document.querySelector('[data-program=timbre_r]'),
        sustain = document.querySelector('[data-program=timbre_s]');

    module.timbreEnv = {

        gateOff: function () {
            var i,
                peak,
                vca;

            for (i = 1; i <= 8; i += 1) {
                vca = module.harmonicOscillator['osc' + i].vca;

                // Prevent decay from acting like second attack
                vca.gain.cancelScheduledValues(0);

                // Set starting point
                peak = vca.gain.value;
                vca.gain.setValueAtTime(peak, module.now());

                // Release
                vca.gain.setTargetAtTime(module.preset['osc' + i], module.now(), module.preset.timbre_r * module.config.egMax + module.config.egMin);
            }

            return;
        },

        gateOn: function () {
            var env,
                i,
                osc,
                peak = module.now() + module.preset.timbre_a * module.config.egMax + module.config.egMin,
                vca;

            for (i = 1; i <= 8; i += 1) {
                env = module.preset['osc' + i + '_eg'];
                osc = module.preset['osc' + i];
                vca = module.harmonicOscillator['osc' + i].vca;

                // Reset
                vca.gain.cancelScheduledValues(0);

                // Starting point
                vca.gain.setTargetAtTime(osc, module.now(), 0.1);

                // Attack
                vca.gain.linearRampToValueAtTime(osc + env, peak);

                // Decay
                vca.gain.setTargetAtTime(osc + (env * module.preset.timbre_s), peak, module.preset.timbre_d * module.config.egMax + module.config.egMin);
            }

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
            var eg = [
                {
                    element: attack,
                    p: module.preset.timbre_a
                },
                {
                    element: decay,
                    p: module.preset.timbre_d
                },
                {
                    element: sustain,
                    p: module.preset.timbre_s
                },
                {
                    element: release,
                    p: module.preset.timbre_r
                }
            ],
                i,
                osc;

            for (i = 1; i <= 8; i += 1) {
                osc = 'osc' + i + '_eg';
                amounts[i - 1].value = module.preset[osc];

                amounts[i - 1].nextElementSibling.style.transform = module.slider.rotate(module.preset[osc]);
            }

            for (i = 0; i < eg.length; i += 1) {
                eg[i].element.value = Math.sqrt(eg[i].p);
                eg[i].element.nextElementSibling.style.transform = module.slider.rotate(eg[i].p);
            }

            return;
        }
    };

    document.addEventListener('updatetimbreenv', module.timbreEnv.update);
    document.addEventListener('gateon', module.timbreEnv.gateOn);
    document.addEventListener('gateoff', module.timbreEnv.gateOff);
    document.addEventListener('loadpreset', module.timbreEnv.load);

    return module;
}(EVE));
