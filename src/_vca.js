EVE = (function (module) {
    'use strict';
    var attack = document.querySelector('[data-program=vca_a]'),
        decay = document.querySelector('[data-program=vca_d]'),
        gain = document.querySelector('[data-program=vca_g]'),
        release = document.querySelector('[data-program=vca_r]'),
        sustain = document.querySelector('[data-program=vca_s]');

    module.vca = module.createGain();
    module.vca.gain.value = module.preset.vca_g;
    module.vca.connect(module.destination);
    module.vca.connect(module.oscilloscope);

    module.vca.gateOff = function () {
        var vcaPeak = module.vca.gain.value;

        // Prevent decay from acting like second attack
        module.vca.gain.cancelScheduledValues(0);

        // VCA starting point
        module.vca.gain.setValueAtTime(vcaPeak, module.now());

        // VCA release
        module.vca.gain.setTargetAtTime(module.preset.vca_g, module.now(), module.preset.vca_r * module.config.egMax + module.config.egMin);

        return;
    };

    module.vca.gateOn = function () {
        var peak = module.now() + module.preset.vca_a * module.config.egMax + module.config.egMin;

        // Reset
        module.vca.gain.cancelScheduledValues(0);

        // VCA starting point
        module.vca.gain.setTargetAtTime(module.preset.vca_g, module.now(), 0.1);

        // VCA attack
        module.vca.gain.linearRampToValueAtTime(1, peak);

        // VCA decay
        module.vca.gain.setTargetAtTime(module.preset.vca_s + module.preset.vca_g, peak, module.preset.vca_d * module.config.egMax + module.config.egMin);

        return;
    };

    module.vca.update = function (event) {
        var program = event.target.dataset.program;

        if (program === 'vca_g') {
            module.vca.gain.setValueAtTime(module.preset.vca_g, module.now());
        }

        return;
    };

    module.vca.load = function () {
        var eg = [
            {
                element: attack,
                p: module.preset.vca_a
            },
            {
                element: decay,
                p: module.preset.vca_d
            },
            {
                element: sustain,
                p: module.preset.vca_s
            },
            {
                element: release,
                p: module.preset.vca_r
            },
            {
                element: gain,
                p: module.preset.vca_g
            }
        ],
            i;

        module.vca.gain.setValueAtTime(module.preset.vca_g, module.now());

        attack.value = Math.sqrt(module.preset.vca_a);
        decay.value = Math.sqrt(module.preset.vca_d);
        sustain.value = module.preset.vca_s;
        release.value = Math.sqrt(module.preset.vca_r);
        gain.value = Math.sqrt(module.preset.vca_g);

        for (i = 0; i < eg.length; i += 1) {
            eg[i].element.nextElementSibling.style.transform = module.slider.rotate(eg[i].p);
        }

        return;
    };

    document.addEventListener('updatevca', module.vca.update);
    document.addEventListener('gateon', module.vca.gateOn);
    document.addEventListener('gateoff', module.vca.gateOff);
    document.addEventListener('loadpreset', module.vca.load);

    return module;

}(EVE));
