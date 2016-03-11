EVE = (function (module) {
    'use strict';

    var amp = document.getElementById('lfo2-amp'),
        attack = document.getElementById('lfo2-attack'),
        debug = false,
        delay = document.getElementById('lfo2-delay'),
        gain = document.getElementById('lfo2-gain'),
        i,
        lfo2Types = {
            'sawtooth': document.getElementById('lfo2-saw'),
            'sine': document.getElementById('lfo2-sin'),
            'square': document.getElementById('lfo2-sqr'),
            'triangle': document.getElementById('lfo2-tri')
        },
        negative = document.getElementById('lfo2-negative'),
        pitch = document.getElementById('lfo2-pitch'),
        positive = document.getElementById('lfo2-positive'),
        rate = document.getElementById('lfo2-rate'),
        release = document.getElementById('lfo2-release');

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

    module.lfo2.gateOff = function () {
        // Prevent decay from acting like second attack
        module.lfo2_vca.gain.cancelScheduledValues(0);

        // Set starting point
        module.lfo2_vca.gain.setValueAtTime(module.lfo2_vca.gain.value, module.now());

        // Release
        module.lfo2_vca.gain.setTargetAtTime(module.preset.lfo2_g, module.now(), module.preset.lfo2_r * module.config.egMax + module.config.egMin);

        return;
    };

    module.lfo2.gateOn = function () {
        // Reset
        module.lfo2_vca.gain.cancelScheduledValues(0);

        // Set starting point
        module.lfo2_vca.gain.setTargetAtTime(module.preset.lfo2_g, module.now(), 0.1);

        // Attack with delay
        module.lfo2_vca.gain.setTargetAtTime(1, module.now() + module.preset.lfo2_delay * module.config.lfo2DelayMax, module.preset.lfo2_a * module.config.egMax + module.config.egMin);

        return;
    };

    module.lfo2.update = function (event) {
        var program = event.target.dataset.program || event.target.name;

        if (debug && console) {
            console.log(program, module.preset[program]);
        }

        switch (program) {
        case 'lfo2_amp':
            module.lfo2_amp.gain.setValueAtTime(module.preset.lfo2_amp * module.config.lfo2AmpMaxDepth * module.preset.lfo2_polarity, module.now());
            break;
        case 'lfo2_g':
            module.lfo2_vca.gain.setValueAtTime(module.preset.lfo2_g, module.now());
            break;
        case 'lfo2_pitch':
            module.lfo2_pitch.gain.setValueAtTime(module.preset.lfo2_pitch * module.config.lfo2PitchMaxDepth * module.preset.lfo2_polarity, module.now());
            break;
        case 'lfo2_polarity':
            module.lfo2_amp.gain.setValueAtTime(module.preset.lfo2_amp * module.config.lfo2AmpMaxDepth * module.preset.lfo2_polarity, module.now());
            module.lfo2_pitch.gain.setValueAtTime(module.preset.lfo2_pitch * module.config.lfo2PitchMaxDepth * module.preset.lfo2_polarity, module.now());
            break;
        case 'lfo2_rate':
            module.lfo2.frequency.setValueAtTime(module.preset.lfo2_rate * module.config.lfo2RateMax, module.now());
            break;
        case 'lfo2_type':
            module.lfo2.type = module.preset.lfo2_type;
            break;
        default:
            if (debug && console) {
                console.log('Unhandled LFO 2 update change');
            }
        }

        return;
    };

    module.lfo2.load = function () {
        // TYPE
        module.lfo2.type = module.preset.lfo2_type;
        lfo2Types[module.preset.lfo2_type].checked = true;

        // RATE
        module.lfo2.frequency.setValueAtTime(module.preset.lfo2_rate * module.config.lfo2RateMax, module.now());
        rate.value = Math.sqrt(module.preset.lfo2_rate);

        // POLARITY
        if (module.preset.lfo2_polarity > 0) {
            positive.checked = true;
        } else {
            negative.checked = true;
        }

        // AMP
        module.lfo2_amp.gain.setValueAtTime(module.preset.lfo2_amp * module.config.lfo2AmpMaxDepth * module.preset.lfo2_polarity, module.now());
        amp.value = module.preset.lfo2_amp;

        // PITCH
        module.lfo2_pitch.gain.setValueAtTime(module.preset.lfo2_pitch * module.config.lfo2PitchMaxDepth * module.preset.lfo2_polarity, module.now());
        pitch.value = Math.sqrt(module.preset.lfo2_pitch);

        // ENVELOPE
        delay.value = Math.sqrt(module.preset.lfo2_delay);
        attack.value = Math.sqrt(module.preset.lfo2_a);
        release.value = Math.sqrt(module.preset.lfo2_r);
        gain.value = Math.sqrt(module.preset.lfo2_g);

        return;
    };

    document.addEventListener('gateoff', module.lfo2.gateOff);
    document.addEventListener('gateon', module.lfo2.gateOn);
    document.addEventListener('loadpreset', module.lfo2.load);
    document.addEventListener('updatelfo2', module.lfo2.update);

    return module;
}(EVE));
