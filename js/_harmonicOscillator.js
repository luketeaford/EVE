EVE = (function (module) {
    'use strict';
    var debug = false,
        fine = module.config.fineTune * module.config.fineTuneRange,
        i,
        osc,
        tuning;

    module.harmonicOscillator = {
        inputs: document.querySelectorAll('#harmonic-oscillator input')
    };

    module.harmonicOscillator.mixer = module.createGain();
    module.harmonicOscillator.mixer.gain.value = -1;

    for (i = 1; i <= 8; i += 1) {
        osc = 'osc' + i;
        tuning = module.config.masterFreq + fine;

        // Oscillators
        module.harmonicOscillator[osc] = module.createOscillator();
        module.harmonicOscillator[osc].frequency.value = tuning * i;
        module.harmonicOscillator[osc].type = 'sine';

        // VCAs
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
        var inputs = module.harmonicOscillator.inputs;

        for (i = 1; i <= 8; i += 1) {
            osc = 'osc' + i;

            inputs[i - 1].value = Math.sqrt(module.preset[osc]);
        }

        return;
    };

    document.addEventListener('updateharmonicoscillator', module.harmonicOscillator.update);
    document.addEventListener('loadpreset', module.harmonicOscillator.load);

    return module;
}(EVE));
