// TODO module.lfo2.max is better as 139 than 40...
EVE = (function (module) {
    'use strict';

    var debug = false,
        i;

    module.lfo2 = module.createOscillator();
    module.lfo2.frequency.value = module.preset.lfo2_rate;
    module.lfo2.type = module.preset.lfo2_type;

    // VCAs
    module.lfo2_amp = module.createGain();
    module.lfo2_amp.gain.value = module.preset.lfo2_amp;
    module.lfo2_pitch = module.createGain();
    module.lfo2_pitch.gain.value = module.preset.lfo2_pitch;
    module.lfo2_vca = module.createGain();
    module.lfo2_vca.gain.value = 0;

    // Connect LFO to its VCA
    module.lfo2.connect(module.lfo2_vca);

    // Connect LFO VCA to its pitch and amp VCAs
    module.lfo2_vca.connect(module.lfo2_amp);
    module.lfo2_vca.connect(module.lfo2_pitch);

    // VCA to amp
    module.lfo2_amp.connect(module.harmonicOscillator.mixer.gain);

    // VCA to pitch
    for (i = 1; i <= 8; i += 1) {
        module.lfo2_pitch.connect(module.harmonicOscillator['osc' + i].frequency);
    }

    if (module.preset.lfo1_track) {
        module.lfo2_pitch.connect(module.lfo1.frequency);
    }

    module.lfo2.scope = document.getElementById('lfo2');
    module.lfo2.sine = document.getElementById('lfo2-sin');
    module.lfo2.square = document.getElementById('lfo2-sqr');
    module.lfo2.saw = document.getElementById('lfo2-saw');
    module.lfo2.tri = document.getElementById('lfo2-tri');
    module.lfo2.rate = document.getElementById('lfo2-rate');
    module.lfo2.amp = document.getElementById('lfo2-amp');
    module.lfo2.pitch = document.getElementById('lfo2-pitch');
    module.lfo2.delay = document.getElementById('lfo2-delay');
    module.lfo2.attack = document.getElementById('lfo2-attack');
    module.lfo2.release = document.getElementById('lfo2-release');
    module.lfo2.gain = document.getElementById('lfo2-gain');

    module.lfo2.gateOff = function () {
        // Prevent decay from acting like second attack
        module.lfo2_vca.gain.cancelScheduledValues(module.now());

        // Set starting point
        module.lfo2_vca.gain.setValueAtTime(module.lfo2_vca.gain.value, module.now());

        // Release
        module.lfo2_vca.gain.setTargetAtTime(module.preset.lfo2_g, module.now(), module.preset.lfo2_r);
        return;
    };

    module.lfo2.gateOn = function () {
        // Reset
        module.lfo2_vca.gain.cancelScheduledValues(0);

        // Set starting point
        module.lfo2_vca.gain.setTargetAtTime(module.preset.lfo2_g, module.now(), 0.1);

        // Attack with delay
        module.lfo2_vca.gain.setTargetAtTime(1, module.now() + module.preset.lfo2_delay * module.config.egMax, module.preset.lfo2_a * module.config.egMax + module.config.egMin);

        return;
    };

    module.lfo2.update = function (e) {
        var p;

        if (e.target && e.target.dataset && e.target.dataset.program) {
            p = e.target.dataset.program;
        }

        if (debug && console) {
            console.log(p, module.preset[p]);
        }

        switch (p) {
        case 'lfo2_amp':
            module.lfo2_amp.gain.setValueAtTime(module.preset.lfo2_amp, module.now());
            break;
        case 'lfo2_g':
            module.lfo2_vca.gain.setValueAtTime(module.preset.lfo2_g, module.now());
            break;
        case 'lfo2_pitch':
            module.lfo2_pitch.gain.setValueAtTime(module.preset.lfo2_pitch * module.config.lfo2Max, module.now());
            break;
        case 'lfo2_rate':
            module.lfo2.frequency.setValueAtTime(module.preset.lfo2_rate * module.config.lfo2Max, module.now());
            break;
        case 'lfo2_type':
            module.lfo2.type = module.preset.lfo2_type;
            break;
        default:
            if (debug && console) {
                console.log('Unhandled LFO 2 update change');
            }
        }
    };

    // BIND EVENTS
    document.addEventListener('updatelfo2', module.lfo2.update);
    document.addEventListener('gateon', module.lfo2.gateOn);
    document.addEventListener('gateoff', module.lfo2.gateOff);

    return module;
}(EVE));
