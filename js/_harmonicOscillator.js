EVE = (function (module) {
    'use strict';
    var debug = false,
        i,
        osc;

    module.harmonicOscillator = {
        inputs: document.querySelectorAll('#harmonic-oscillator input')
    };

    module.harmonicOscillator.mixer = module.createGain();
    module.harmonicOscillator.mixer.gain.value = -1;

    for (i = 1; i <= 8; i += 1) {
        osc = 'osc' + i;

        // Create oscillators
        module.harmonicOscillator[osc] = module.createOscillator();
        module.harmonicOscillator[osc].frequency.value = module.config.masterFreq * i;
        module.harmonicOscillator[osc].type = 'sine';

        // Add each oscillator to tracked oscillators
        module.config.trackedOscs.push(module.harmonicOscillator[osc]);

        // Create VCAs
        module.harmonicOscillator[osc].vca = module.createGain();
        module.harmonicOscillator[osc].vca.gain.value = module.preset[osc];

        // Connect each oscillator to its VCA
        module.harmonicOscillator[osc].connect(module.harmonicOscillator[osc].vca);

        // Connect each VCA to the harmonic oscillator mixer
        module.harmonicOscillator[osc].vca.connect(module.harmonicOscillator.mixer);
    }

    // Connect the mixer to the master VCA
    module.harmonicOscillator.mixer.connect(module.vca);

    module.harmonicOscillator.update = function (event) {
        var harmonicOsc = module.harmonicOscillator,
            program = event.target.dataset.program;

        harmonicOsc[program].vca.gain.setValueAtTime(module.preset[program], module.now());

        if (debug && console) {
            console.log(program, module.preset[program]);
        }

        return;
    };

    module.harmonicOscillator.load = function () {
        var inputs = module.harmonicOscillator.inputs,
            x;

        for (i = 1; i <= 8; i += 1) {
            osc = 'osc' + i;
            x = Math.sqrt(module.preset[osc]);

            inputs[i - 1].value = x;

            inputs[i - 1].nextElementSibling.style.transform = module.slider.rotate(x);
        }

        return;
    };

    document.addEventListener('updateharmonicoscillator', module.harmonicOscillator.update);
    document.addEventListener('loadpreset', module.harmonicOscillator.load);

    return module;
}(EVE));
