EVE = (function (module) {
    'use strict';
    var debug = false,
        i,
        lfo,
        lfoRangeButtons = {
            'low': document.getElementById('lfo1-low'),
            'middle': document.getElementById('lfo1-middle'),
            'high': document.getElementById('lfo1-high'),
            'track': document.getElementById('lfo1-track')
        },
        lfoRanges = {
            'low': 27.5,
            'middle': 110,
            'high': 440,
            'track': 1760
        },
        osc,
        oscInputs = document.querySelectorAll('#lfo1 [data-program^=osc]'),
        rate = document.getElementById('lfo1-rate');

    // The LFO itself
    module.lfo1 = module.createOscillator();
    module.lfo1.frequency.value = module.preset.lfo1_rate;
    module.lfo1.type = module.preset.lfo1_type;

    // LFO 1 VCAs
    for (i = 1; i <= 8; i += 1) {
        osc = 'osc' + i;
        lfo = osc + '_lfo';
        module[lfo] = module.createGain();
        module[lfo].gain.value = module.preset[lfo];
        // Connect LFO 1 to each LFO VCA
        module.lfo1.connect(module[lfo]);
        // Connect to harmonic oscillator VCAs
        module[lfo].connect(module.harmonicOscillator[osc].vca.gain);
    }

    module.lfo1.sine = document.getElementById('lfo1-sin');
    module.lfo1.square = document.getElementById('lfo1-sqr');
    module.lfo1.triangle = document.getElementById('lfo1-tri');
    module.lfo1.sawtooth = document.getElementById('lfo1-saw');


    module.lfo1.update = function (event) {
        var program = event.target.dataset.program;

        switch (program) {
        case 'lfo1_type':
            module.lfo1.type = module.preset.lfo1_type;
            break;
        case 'lfo1_range':
        case 'lfo1_rate':
            module.lfo1.frequency.setValueAtTime(module.preset.lfo1_rate * lfoRanges[module.preset.lfo1_range], module.now());
            break;
        case 'osc1_lfo':
        case 'osc2_lfo':
        case 'osc3_lfo':
        case 'osc4_lfo':
        case 'osc5_lfo':
        case 'osc6_lfo':
        case 'osc7_lfo':
        case 'osc8_lfo':
            module[program].gain.setValueAtTime(module.preset[program], module.now());
            break;
        default:
            if (debug && console) {
                console.log('Unhandled LFO 1 update change');
            }
        }

        return;
    };

    module.lfo1.load = function () {
        module.lfo1.frequency.setValueAtTime(module.preset.lfo1_rate * lfoRanges[module.preset.lfo1_range], module.now());
        for (i = 1; i <= 8; i += 1) {
            osc = 'osc' + i + '_lfo';
            module[osc].gain.setValueAtTime(module.preset[osc], module.now());
            oscInputs[i - 1].value = module.preset[osc];
        }
        module.lfo1.type = module.preset.lfo1_type;
        module.lfo1[module.preset.lfo1_type].checked = true;
        lfoRangeButtons[module.preset.lfo1_range].checked = true;
        rate.value = Math.sqrt(module.preset.lfo1_rate);
        return;
    };

    document.addEventListener('updatelfo1', module.lfo1.update);
    document.addEventListener('loadpreset', module.lfo1.load);

    return module;
}(EVE));
