// TODO oscInputs is kind of a confusing name and it's a bad selector
EVE = (function (module) {
    'use strict';
    var debug = false,
        i,
        lfo,
        osc,
        oscInputs = document.querySelectorAll('#lfo1 .js-osc'),
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
    module.lfo1.low = document.getElementById('lfo1-low');
    module.lfo1.mid = document.getElementById('lfo1-mid');
    module.lfo1.high = document.getElementById('lfo1-high');
    module.lfo1.track = document.getElementById('lfo1-track');

    module.lfo1.update = function (e) {
        var p;

        if (e.target && e.target.dataset && e.target.dataset.program) {
            p = e.target.dataset.program;
        }

        switch (p) {
        case 'lfo1_type':
            module.lfo1.type = module.preset.lfo1_type;
            break;
        case 'lfo1_range':
        case 'lfo1_rate':
            module.lfo1.frequency.setValueAtTime(module.preset.lfo1_rate * module.preset.lfo1_range, module.now());
            break;
        case 'osc1_lfo':
        case 'osc2_lfo':
        case 'osc3_lfo':
        case 'osc4_lfo':
        case 'osc5_lfo':
        case 'osc6_lfo':
        case 'osc7_lfo':
        case 'osc8_lfo':
            module[p].gain.setValueAtTime(module.preset[p], module.now());
            break;
        default:
            if (debug && console) {
                console.log('Unhandled LFO 1 update change');
            }
        }

        if (debug && console) {
            console.log(p, module.preset[p]);
        }

        return;
    };

    module.lfo1.load = function () {
        var lfo1Ranges = {
            20: 'low',
            40: 'mid',
            80: 'high',
            440: 'track'
        };

        module.lfo1[module.preset.lfo1_type].checked = true;
        module.lfo1[lfo1Ranges[module.preset.lfo1_range]].checked = true;
        rate.value = Math.sqrt(module.preset.lfo1_rate);

        for (i = 1; i < oscInputs.length; i += 1) {
            osc = 'osc' + i + '_lfo';
            oscInputs[i - 1].value = module.preset[osc];
        }

        return;
    };

    // BIND EVENTS
    document.addEventListener('updatelfo1', module.lfo1.update);
    document.addEventListener('loadpreset', module.lfo1.load);

    return module;
}(EVE));
