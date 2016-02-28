// TODO Test these envelopes better
EVE = (function (module) {
    'use strict';
    var debug = false;

    module.vca = module.createGain();
    module.vca.gain.value = module.preset.vca_g;
    module.vca.connect(module.destination);
    module.vca.connect(module.oscilloscope);
    module.vca.attack = document.getElementById('vca-a');
    module.vca.decay = document.getElementById('vca-d');
    module.vca.sustain = document.getElementById('vca-s');
    module.vca.release = document.getElementById('vca-r');

    module.vca.gateOn = function () {
        var peak = module.now() + module.preset.vca_a * module.config.egMax + module.config.egMin;

        // Reset
        module.vca.gain.cancelScheduledValues(0);

        // VCA starting point
        module.vca.gain.setTargetAtTime(module.preset.vca_g, module.now(), 0.1);

        // VCA attack
        module.vca.gain.linearRampToValueAtTime(1, peak);

        // VCA decay
        module.vca.gain.setTargetAtTime(module.preset.vca_s + module.preset.vca_g, peak, module.preset.vca_d * module.config.egMax);

        // DEBUG
        if (debug && console) {
            console.log('Begin attack stage - custom gateOn');
        }
    };

    module.vca.gateOff = function () {
        var vcaPeak = module.vca.gain.value;

        // Prevent decay from acting like second attack
        module.vca.gain.cancelScheduledValues(0);

        // VCA starting point
        module.vca.gain.setValueAtTime(vcaPeak, module.now());

        // VCA release
        module.vca.gain.setTargetAtTime(module.preset.vca_g, module.now(), module.preset.vca_r * module.config.egMax + module.config.egMin);

        // DEBUG
        if (debug && console) {
            console.log('Begin release stage - custom gateOff');
        }
    };

    module.vca.update = function (e) {
        var p;

        if (e.target && e.target.dataset && e.target.dataset.program) {
            p = e.target.dataset.program;
        }

        if (p === 'vca_g') {
            module.vca.gain.setValueAtTime(module.preset.vca_g, module.now());
        }

        // DEBUG
        if (debug && console) {
            console.log(p, module.preset[p]);
        }
    };

    module.vca.load = function () {
        module.vca.attack.value = Math.sqrt(module.preset.vca_a);
        module.vca.decay.value = Math.sqrt(module.preset.vca_d);
        module.vca.sustain.value = module.preset.vca_s;
        module.vca.release.value = Math.sqrt(module.preset.vca_r);
        module.vca.gain.value = Math.sqrt(module.preset.vca_g);
    };

    // BIND EVENTS
    document.addEventListener('updatevca', module.vca.update);
    document.addEventListener('gateon', module.vca.gateOn);
    document.addEventListener('gateoff', module.vca.gateOff);
    document.addEventListener('loadpreset', module.vca.load);

    return module;

}(EVE));
