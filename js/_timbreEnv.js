EVE = (function (module) {
    'use strict';
    var debug = true,
        inputs = document.getElementsByClassName('js-eg-amt');

    module.timbreEnv = {
        attack: document.getElementById('timbre-a'),
        decay: document.getElementById('timbre-d'),
        sustain: document.getElementById('timbre-s'),
        release: document.getElementById('timbre-r'),

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
                vca.gain.setTargetAtTime(osc + (env * module.preset.timbre_s), peak, module.preset.timbre_d * module.config.egMax);
            }

            if (debug && console) {
                console.log('Timbre envelope on');
            }
            return;
        },

        gateOff: function () {
            var i,
                peak,
                vca;

            for (i = 1; i <= 8; i += 1) {
                vca = module.harmonicOscillator['osc' + i].vca;

                // Prevent decay from acting like second attack
                vca.gain.cancelScheduledValues(module.now());

                // Set starting point
                peak = vca.gain.value;
                vca.gain.setValueAtTime(peak, module.now());

                // Release
                vca.gain.setTargetAtTime(module.preset['osc' + i], module.now(), module.preset.timbre_r);
            }

            if (debug && console) {
                console.log('Timbre envelope off');
            }
            return;
        },

        update: function (e) {
            var p;

            if (e.target && e.target.dataset && e.target.dataset.program) {
                p = e.target.dataset.program;
            }

            // DEBUG
            if (debug && console) {
                console.log(p, module.preset[p]);
            }
            console.log('Why is the timbre envelope update not firing?');
        },

        load: function () {
            var i,
                osc;

            for (i = 1; i <= 8; i += 1) {
                osc = 'osc' + i + '_eg';
                inputs[i - 1].value = module.preset[osc];
            }

            module.timbreEnv.attack.value = Math.sqrt(module.preset.timbre_a);
            module.timbreEnv.decay.value = Math.sqrt(module.preset.timbre_d);
            module.timbreEnv.sustain.value = module.preset.timbre_s;
            module.timbreEnv.release.value = Math.sqrt(module.preset.timbre_r);
        }
    };

    document.addEventListener('updatetimbreenv', module.timbreEnv.update);
    document.addEventListener('gateon', module.timbreEnv.gateOn);
    document.addEventListener('gateoff', module.timbreEnv.gateOff);
    document.addEventListener('loadpreset', module.timbreEnv.load);

    return module;
}(EVE));
