// EVE Web Audio Synthesizer
// Copyright 2015-2016 Luke Teaford
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// luketeaford@gmail.com
// 4100 Quentin Boulevard, #310, Columbus, OH 43230

var EVE = {};

EVE = (function (module) {
    'use strict';
    var promptNecessary = !!(!window.AudioContext && window.webkitAudioContext);

    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    module = new AudioContext();

    module.promptNecessary = promptNecessary;

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    var promptDialog = document.getElementById('consent-prompt');

    module.prompt = {
        preventScroll: function (event) {
            event.preventDefault();
            return;
        },

        removePrompt: function () {
            promptDialog.style.display = 'none';

            promptDialog.removeEventListener('touchmove', module.prompt.preventScroll);

            promptDialog.removeEventListener('click', module.prompt.removePrompt);
            promptDialog.removeEventListener('mousedown', module.prompt.removePrompt);
            promptDialog.removeEventListener('touchend', module.prompt.removePrompt);

        }
    };

    if (module.promptNecessary) {

        promptDialog.style.display = 'flex';

        promptDialog.addEventListener('touchmove', module.prompt.preventScroll);

        promptDialog.addEventListener('click', module.prompt.removePrompt);
        promptDialog.addEventListener('mousedown', module.prompt.removePrompt);
        promptDialog.addEventListener('touchend', module.prompt.removePrompt);
    }

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';

    module.events = {
        gateoff: new CustomEvent('gateoff', {
            bubbles: true
        }),

        gateon: new CustomEvent('gateon', {
            bubbles: true
        }),

        pitchbend: new CustomEvent('pitchbend', {
            bubbles: true
        }),

        updateharmonicoscillator: new CustomEvent('updateharmonicoscillator', {
            bubbles: true
        }),

        updatelfo1: new CustomEvent('updatelfo1', {
            bubbles: true
        }),

        updatelfo2: new CustomEvent('updatelfo2', {
            bubbles: true
        }),

        updateperformance: new CustomEvent('updateperformance', {
            bubbles: true
        }),

        loadpreset: new CustomEvent('loadpreset', {
            bubbles: true
        }),

        updatetimbreeg: new CustomEvent('updatetimbreeg', {
            bubbles: true
        }),

        updatetimbreenv: new CustomEvent('updatetimbreenv', {
            bubbles: true
        }),

        updatevca: new CustomEvent('updatevca', {
            bubbles: true
        })
    };

    return module;
}(EVE));

// TODO: RENAME HEADER TO NAVIGATION OR SOMETHING
EVE = (function (module) {
    'use strict';
    var nav = document.querySelector('nav'),
        main = document.querySelector('main'),
        navMap = {
            'edit': 'showEdit',
            'config': 'showConfig'
        };

    module.header = {
        navigate: function (event) {

            if (event.target) {
                main.dataset.visible = event.target.value;
            }
        }
    };

    nav.addEventListener('click', module.header.navigate);

    return module;
}(EVE));

EVE = (function config(module) {
    'use strict';

    module.config = {
        egMax: 2.125,
        egMin: 0.025,
        fineTune: 0,
        fineTuneRange: 51,
        glideMax: 0.165,
        glideMin: 0.0001,
        lfo2DelayMax: 2,
        lfo2AmpMaxDepth: 1.28,
        lfo2PitchMaxDepth: 3520,
        lfo2RateMax: 139,
        masterFreq: 440,
        pitchBendRange: 1200,
        pitchBendSlew: 0.0001,
        ribbonBehavior: 'pitch control',
        ribbonBendRange: 300,
        ribbonBendScale: 60,
        ribbonBendSlew: 0.01,
        ribbonControlRange: 2400,// number of keyboard notes
        ribbonControlSlew: 0.01,
        trackedOscs: []
    };

    return module;
}(EVE));

// The preset object contains the changing parameters. The entire preset object
// can be changed dynamically, so it must not contain anything else.
EVE = (function (module) {
    'use strict';
    module.preset = {
        name: 'INIT',

        // Harmonic oscillator VCAs
        osc1: 1,
        osc2: 0,
        osc3: 0,
        osc4: 0,
        osc5: 0,
        osc6: 0,
        osc7: 0,
        osc8: 0,

        // Harmonic oscillator envelope amounts
        osc1_eg: 0,
        osc2_eg: 0,
        osc3_eg: 0,
        osc4_eg: 0,
        osc5_eg: 0,
        osc6_eg: 0,
        osc7_eg: 0,
        osc8_eg: 0,

        // Timbre envelope
        timbre_a: 0,
        timbre_d: 0.125,
        timbre_s: 0.5,
        timbre_r: 0.125,

        // LFO 1
        lfo1_rate: 1,
        lfo1_range: 'low',
        lfo1_type: 'sine',
        osc1_lfo: 0,
        osc2_lfo: 0,
        osc3_lfo: 0,
        osc4_lfo: 0,
        osc5_lfo: 0,
        osc6_lfo: 0,
        osc7_lfo: 0,
        osc8_lfo: 0,

        // LFO 2
        lfo2_rate: 3,
        lfo2_polarity: 1,
        lfo2_type: 'sine',
        lfo2_amp: 0,
        lfo2_pitch: 0,
        lfo2_delay: 0,
        lfo2_a: 0,
        lfo2_r: 0.0001,
        lfo2_g: 0,

        // VCA
        vca_a: 0,
        vca_d: 0.1,
        vca_s: 0.5,
        vca_r: 0.1,
        vca_g: 0,

        // Performance
        glide: 0.00001

    };

    module.defaultPreset = module.preset;

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    var fft = 1024,
        scope = document.querySelector('#oscilloscope'),
        context = scope.getContext('2d'),
        lineColor = 'rgb(51, 58, 52)',// dark grey
        scopeData = new Uint8Array(fft),
        scopeHeight = scope.height,
        scopeWidth = scope.width;

    module.oscilloscope = module.createAnalyser();

    (function draw() {
        var sliceWidth = scopeWidth / fft,
            x = 0,
            i,
            v,
            y;

        window.requestAnimationFrame(draw);

        context.clearRect(0, 0, scopeWidth, scopeHeight);
        context.lineWidth = 2;
        context.strokeStyle = lineColor;
        context.beginPath();
        module.oscilloscope.getByteTimeDomainData(scopeData);
        for (i = 0; i < fft; i += 1) {
            v = scopeData[i] / 128;
            y = v * scopeHeight / 2;

            if (i === 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
            x += sliceWidth;
        }
        context.lineTo(scopeWidth, scopeHeight / 2);
        context.stroke();
    }());

    return module;
}(EVE));

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

            inputs[i - 1].nextElementSibling.style.transform = module.slider.rotate(module.preset[osc]);
        }

        return;
    };

    document.addEventListener('updateharmonicoscillator', module.harmonicOscillator.update);
    document.addEventListener('loadpreset', module.harmonicOscillator.load);

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';

    module.lfo = {
        togglePitchTracking: function (lfo) {

            if (module.config.trackedOscs.indexOf(module[lfo]) === -1) {
                module.config.trackedOscs.push(module[lfo]);
            } else {
                module.config.trackedOscs.splice(module.config.trackedOscs.indexOf(module[lfo]));
            }

            return;
        }
    };

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    var debug = false,
        i,
        lfo,
        lfoRangeButtons = {
            'low': document.querySelector('#lfo1 [value=low]'),
            'middle': document.querySelector('#lfo1 [value=middle]'),
            'high': document.querySelector('#lfo1 [value=high]'),
            'track': document.querySelector('#lfo1 [value=track]')
        },
        lfoRanges = {
            'low': 27.5,
            'middle': 110,
            'high': 440,
            'track': 1760
        },
        lfoTypes = {
            'sawtooth': document.querySelector('#lfo1 [value=sawtooth]'),
            'sine': document.querySelector('#lfo1 [value=sine]'),
            'square': document.querySelector('#lfo1 [value=square]'),
            'triangle': document.querySelector('#lfo1 [value=triangle]')
        },
        osc,
        oscInputs = document.querySelectorAll('#lfo1 [data-program^=osc]'),
        rate = document.querySelector('[data-program=lfo1_rate]');

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

    module.lfo1.update = function (event) {
        var program = event.target.dataset.program || event.target.name;

        switch (program) {
        case 'lfo1_type':
            module.lfo1.type = module.preset.lfo1_type;
            break;
        case 'lfo1_range':
        case 'lfo1_rate':
            module.lfo1.frequency.setValueAtTime(module.preset.lfo1_rate * lfoRanges[module.preset.lfo1_range], module.now());
            break;
        case 'lfo1_tracking':
            module.lfo.togglePitchTracking('lfo1');
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

            oscInputs[i - 1].nextElementSibling.style.transform = module.slider.rotate(module.preset[osc], true);
        }

        module.lfo1.type = module.preset.lfo1_type;

        lfoTypes[module.preset.lfo1_type].checked = true;

        lfoRangeButtons[module.preset.lfo1_range].checked = true;

        rate.value = Math.sqrt(module.preset.lfo1_rate);
        rate.nextElementSibling.style.transform = module.slider.rotate(module.preset.lfo1_rate);

        return;
    };

    document.addEventListener('updatelfo1', module.lfo1.update);
    document.addEventListener('loadpreset', module.lfo1.load);

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';

    var amp = document.querySelector('[data-program=lfo2_amp]'),
        attack = document.querySelector('[data-program=lfo2_a]'),
        debug = false,
        delay = document.querySelector('[data-program=lfo2_delay]'),
        gain = document.querySelector('[data-program=lfo2_g]'),
        i,
        lfoTypes = {
            'sawtooth': document.querySelector('#lfo2 [value=sawtooth]'),
            'sine': document.querySelector('#lfo2 [value=sine]'),
            'square': document.querySelector('#lfo2 [value=square]'),
            'triangle': document.querySelector('#lfo2 [value=triangle]')
        },
        negative = document.querySelectorAll('[name=lfo2_polarity]')[1],
        pitch = document.querySelector('[data-program=lfo2_pitch]'),
        positive = document.querySelectorAll('[name=lfo2_polarity]')[0],
        rate = document.querySelector('[data-program=lfo2_rate]'),
        release = document.querySelector('[data-program=lfo2_r]');

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
        case 'lfo2_tracking':
            module.lfo.togglePitchTracking('lfo2');
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
        var inputs = [
            {
                element: rate,
                p: module.preset.lfo2_rate
            },
            {
                element: amp,
                p: module.preset.lfo2_amp
            },
            {
                element: pitch,
                p: module.preset.lfo2_pitch
            },
            {
                element: delay,
                p: module.preset.lfo2_delay
            },
            {
                element: attack,
                p: module.preset.lfo2_a
            },
            {
                element: release,
                p: module.preset.lfo2_r
            },
            {
                element: gain,
                p: module.preset.lfo2_g
            }
        ];

        // TYPE
        module.lfo2.type = module.preset.lfo2_type;
        lfoTypes[module.preset.lfo2_type].checked = true;

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

        for (i = 0; i < inputs.length; i += 1) {
            inputs[i].element.nextElementSibling.style.transform = module.slider.rotate(inputs[i].p);
        }

        return;
    };

    document.addEventListener('gateoff', module.lfo2.gateOff);
    document.addEventListener('gateon', module.lfo2.gateOn);
    document.addEventListener('loadpreset', module.lfo2.load);
    document.addEventListener('updatelfo2', module.lfo2.update);

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    var debug = false,
        glide = document.querySelector('[data-program=glide]'),
        lights = document.querySelectorAll('#octave-shift [data-light]'),
        octaveShift = document.getElementById('octave-shift'),
        ribbon = document.getElementById('ribbon');

    module.performance = {
        octaveShift: 0,
        pitch: 0,
        pitchBend: 0,

        bendPitch: function () {
            var bend = module.performance.pitchBend,
                i,
                pitch = module.performance.pitch,
                t = module.currentTime,
                x = bend + pitch,
                y = module.config.pitchBendSlew;

            for (i = 0; i < module.config.trackedOscs.length; i += 1) {
                module.config.trackedOscs[i].detune.setTargetAtTime(x, t, y);
            }
            return;
        },

        ribbon: function (event) {
            var bend,
                i,
                x = event.pageX;

            event.preventDefault();

            switch (module.config.ribbonBehavior) {
            // RIBBON FOR PITCH BENDING
            case 'pitch bend':
                bend = ((x - ribbon.origin) / module.config.ribbonBendScale) * module.config.ribbonBendRange + module.performance.pitch;

                for (i = 0; i < module.config.trackedOscs.length; i += 1) {
                    module.config.trackedOscs[i].detune.setTargetAtTime(bend, module.currentTime, module.config.ribbonBendSlew);
                }

                break;

            // RIBBON FOR CONTROL
            case 'pitch control':
                // THESE HARD CODED NUMBERS COULD BE CONFIGS
                module.performance.pitch = module.performance.octaveShift * 1200 + -2100 + (x / ribbon.size) * module.config.ribbonControlRange;

                for (i = 0; i < module.config.trackedOscs.length; i += 1) {
                    module.config.trackedOscs[i].detune.setTargetAtTime(module.performance.pitch, module.currentTime, module.config.ribbonControlSlew);
                }

                break;
            }

            return;
        },

        shiftOctave: function (event, direction) {
            var i,
                oct = module.performance.octaveShift,
                shift = direction || event.target.dataset.shift;

            if (shift) {
                if ((oct > -2 && shift < 0) || (oct < 2 && shift > 0)) {
                    module.performance.octaveShift += parseFloat(shift);
                    for (i = 0; i < lights.length; i += 1) {
                        lights[i].dataset.light =
                            i === module.performance.octaveShift + 2 ?
                                    'on' :
                                    'off';
                    }
                }
            }

            return;
        },

        startRibbon: function (event) {
            var i;

            event.preventDefault();

            event.target.addEventListener('mousemove', module.performance.ribbon);

            event.target.addEventListener('touchmove', module.performance.ribbon);

            event.target.style.cursor = 'col-resize';

            // PITCH BEND
            ribbon.origin = event.pageX;

            // PITCH CONTROL
            ribbon.size = ribbon.offsetWidth - 1;
            ribbon.scale = ribbon.size / module.config.ribbonControlRange;

            if (module.config.ribbonBehavior === 'pitch control') {

                module.performance.pitch = module.performance.octaveShift * 1200 + -2100 + (ribbon.origin / ribbon.size) * module.config.ribbonControlRange;

                for (i = 0; i < module.config.trackedOscs.length; i += 1) {
                    module.config.trackedOscs[i].detune.setTargetAtTime(module.performance.pitch, module.currentTime, module.config.ribbonControlSlew);
                }

                module.gate(event);
            }

            return;
        },

        stopRibbon: function (event) {
            event.preventDefault();

            event.target.removeEventListener('mousemove', module.performance.ribbon);

            event.target.removeEventListener('touchmove', module.performance.ribbon);

            event.target.style.cursor = '';

            // Setting the pitch may only be required by bend?
            module.setPitch(module.performance.pitch);

            // IN CONTROL MODE, THE GATE MUST HAPPEN
            if (module.config.ribbonBehavior === 'pitch control') {
                module.gate(event);
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
            glide.value = module.preset.glide;
            glide.nextElementSibling.style.transform = module.slider.rotate(module.preset.glide);
            return;
        }
    };


    document.addEventListener('loadpreset', module.performance.load);
    document.addEventListener('pitchbend', module.performance.bendPitch);
    document.addEventListener('updateperformance', module.performance.update);

    octaveShift.addEventListener('click', module.performance.shiftOctave);

    // EXPERIMENT
    ribbon.addEventListener('mousedown', module.performance.startRibbon);
    ribbon.addEventListener('mouseup', module.performance.stopRibbon);
    ribbon.addEventListener('touchstart', module.performance.startRibbon);
    ribbon.addEventListener('touchend', module.performance.stopRibbon);

    return module;
}(EVE));

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

EVE = (function (module) {
    'use strict';

    var updateMethods = {
        'lfo1': 'updatelfo1',
        'lfo2': 'updatelfo2'
    };

    module.button = {
        press: function (event) {
            var program,
                update,
                x;

            if (event.target.type === 'radio') {
                program = event.target.name;
                update = updateMethods[event.target.parentElement.parentElement.id];
                x = event.target.value;

                if (module.preset[program] !== x) {
                    // Prevent numbers being stored as strings
                    if (typeof x === 'string' && !isNaN(x - 1)) {
                        module.preset[program] = parseFloat(x);
                    } else {
                        module.preset[program] = x;
                    }
                }

                return event.target.dispatchEvent(module.events[update]);
            }

            return;
        }
    };

    document.addEventListener('change', module.button.press);

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';

    var keyboard = document.getElementById('keyboard');

    module.calculatePitch = function (event, note) {
        var n = note === 0 ? 0 : note || event.target.dataset.noteValue,
            pitch = module.performance.octaveShift * 1200 + parseFloat(n);

        module.performance.pitch = pitch;
        return module.setPitch(pitch);
    };

    keyboard.addEventListener('mousedown', module.calculatePitch);
    keyboard.addEventListener('touchstart', module.calculatePitch);

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    var debug = false,
        key,
        keyDown,
        pitch,
        playing = [],
        qwertyKeys = {
            65: 0,
            87: 1,
            83: 2,
            69: 3,
            68: 4,
            70: 5,
            84: 6,
            71: 7,
            89: 8,
            72: 9,
            85: 10,
            74: 11,
            75: 12,
            79: 13,
            76: 14,
            80: 15,
            186: 16,
            222: 17,
            221: 18
        },
        qwertyPitches = {
            65: -2100,
            87: -2000,
            83: -1900,
            69: -1800,
            68: -1700,
            70: -1600,
            84: -1500,
            71: -1400,
            89: -1300,
            72: -1200,
            85: -1100,
            74: -1000,
            75: -900,
            79: -800,
            76: -700,
            80: -600,
            186: -500,
            222: -400,
            221: -300
        };

    module.keyboard = {
        keys: document.querySelectorAll('#keyboard button'),

        convertQwertyToPitch: function (keycode) {
            return qwertyPitches[keycode];
        },

        highlightKey: function (keycode) {
            key = qwertyKeys[keycode];

            module.keyboard.keys[key].dataset.active =
                module.keyboard.keys[key].dataset.active === 'false' ?
                        'true' :
                        'false';
            return;
        },

        pressBus: function (event) {
            switch (event.which) {
            // ,
            case 44:
                module.program.cycle(null, -1);
                break;
            // .
            case 46:
                module.program.cycle(null, 1);
                break;
            // /
            case 47:
                module.program.togglePresetBank();
                break;
            // z
            case 122:
                module.performance.shiftOctave(null, -1);
                break;
            // x
            case 120:
                module.performance.shiftOctave(null, 1);
                break;
            default:
                if (debug && console) {
                    console.log(event);
                }
            }
            return;
        },

        downBus: function (event) {
            pitch = module.keyboard.convertQwertyToPitch(event.which);

            if (pitch) {
                if (playing.indexOf(pitch) === -1) {
                    module.calculatePitch(null, pitch);
                    module.keyboard.highlightKey(event.which);
                    playing.push(pitch);
                    playing.sort(function (a, b) {
                        return a - b;
                    });
                }
                if (!keyDown) {
                    keyDown = !keyDown;
                    module.gate(event);
                }
            }
            return;
        },

        upBus: function (event) {
            pitch = module.keyboard.convertQwertyToPitch(event.which);

            if (pitch) {
                playing.splice(playing.indexOf(pitch), 1);
                if (playing.length >= 1) {
                    module.calculatePitch(null, playing[playing.length - 1]);
                } else {
                    keyDown = !keyDown;
                    module.gate(event);
                }
                module.keyboard.highlightKey(event.which);

            }
            return;
        }
    };

    document.addEventListener('keypress', module.keyboard.pressBus);
    document.addEventListener('keydown', module.keyboard.downBus);
    document.addEventListener('keyup', module.keyboard.upBus);

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    var debug = true,
        lfo2Gain = document.querySelector('[data-program=lfo2_g]'),
        pitchBendOffset = 64,
        z;

    if (navigator.requestMIDIAccess) {
        module.midi = {
            active: null,

            events: function () {
                var a = event.data[0],
                    b = event.data[1],
                    c = event.data[2],
                    n = event.data[1];

                switch (a) {
                case module.midi.messages.listen:
                    if (debug && console) {
                        console.log('MIDI listen');
                    }
                    break;
                case module.midi.messages.modWheel:
                    if (event.data[1] === 1) {
                        module.preset.lfo2_g = Math.pow(event.data[2] / 127, 2);
                        module.lfo2_vca.gain.setTargetAtTime(module.preset.lfo2_g, module.now(), 0.1);
                        lfo2Gain.value = Math.sqrt(module.preset.lfo2_g);
                        if (debug && console) {
                            console.log('Moving the modwheel!');
                        }
                    }
                    break;
                case module.midi.messages.noteOn:
                    if (event.data[2] >= 1) {
                        if (module.midi.active === null) {
                            module.midi.active = n;
                            module.gate(event);
                        }
                        module.calculatePitch(null, module.midi.toCents(n));
                    } else {
                        // Cheap MIDI controller note off
                        if (module.midi.active === n) {
                            module.midi.active = null;
                            module.gate(event);
                        } else {
                            // Return to initial note (for legato playing)
                            module.calculatePitch(null, module.midi.toCents(module.midi.active));
                        }
                    }
                    module.midi.highlightKey(n);
                    break;
                case module.midi.messages.noteOff:
                    module.midi.active = null;
                    module.gate(event);
                    module.midi.highlightKey(n);
                    break;
                case module.midi.messages.pitchWheel:
                    z = b ? 1 : 0;

                    module.performance.pitchBend = (z + c - pitchBendOffset) / pitchBendOffset * module.config.pitchBendRange;

                    document.dispatchEvent(module.events.pitchbend);
                    break;
                default:
                    debug = true;
                    if (debug && console) {
                        console.log('Unsupported MIDI event', event.data);
                    }
                    break;
                }
            },

            getDevices: function () {
                return navigator.requestMIDIAccess().then(function (MIDI) {
                    var devices = [],
                        input,
                        inputs = MIDI.inputs.entries();

                    for (input = inputs.next(); input && !input.done; input = inputs.next()) {
                        devices.push(input.value[1]);
                    }

                    if (debug && console) {
                        console.log('Available devices:', devices);
                    }

                    return devices;
                });
            },

            highlightKey: function (note) {
                var key = note - 48;

                if (key > -1 && key < module.keyboard.keys.length) {
                    module.keyboard.keys[key].dataset.active =
                        module.keyboard.keys[key].dataset.active === 'false' ?
                                'true' :
                                'false';
                }

                return;
            },

            messages: {
                bankSelect: 192,
                modWheel: 176,// 176, 1, 0-127
                noteOn: 144,
                noteOff: 128,
                pitchWheel: 224,
                volumeX: 176
            },

            toCents: function (midiNote) {
                return 100 * (midiNote - 69);
            }
        };

        module.midi.getDevices().then(function (devices) {
            var i = 0;

            module.midi.devices = devices;

            for (i; i < devices.length; i += 1) {
                module.midi.devices[i].onmidimessage = module.midi.events;
            }
        });
    } else {
        if (debug && console) {
            console.log('No MIDI available');
        }
    }

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    var bank = [
        'init',
        'cool-sci-fi-sound',
        'dawn',
        'distorted-sawtooth',
        'glimmer',
        'hawaiian-tropic',
        'joeys-didgeridoo',
        'johnnys-didgeridoo',
        'kangaroo',
        'mirage',
        'miranda',
        'modern-bass',
        'oranges',
        'peach-fuzz',
        'percusso',
        'square-overtone',
        'talking-tennis-ball',
        'vocal-bass',
        'work-song'
    ],
        displayName = document.querySelector('#display > h3'),
        number = 0,
        numberOfPresets = bank.length - 1,
        presetBank = document.getElementById('preset-bank'),
        program = document.getElementById('program');

    module.program = {

        cycle: function (event, direction) {
            var i,
                offset = direction || parseFloat(event.target.dataset.cycle);

            if (offset) {
                i = number + offset;
                if (i >= 0 && i <= numberOfPresets) {
                    number += offset;
                    return module.program.loadPreset(number);
                }
            }

            if (event) {
                // Click display to open/close preset bank
                if (event.target === displayName) {
                    module.program.togglePresetBank();
                }
                // Load selected preset and close preset bank
                if (event.target.value) {
                    number = bank.indexOf(event.target.value);
                    module.program.togglePresetBank();
                    return module.program.loadPreset(number);
                }
            }

            return;
        },

        load: function () {
            displayName.textContent = module.preset.name;
            return;
        },

        loadPreset: function (index) {
            var ajax = new XMLHttpRequest();

            ajax.open('GET', '/presets/' + bank[index] + '.json', true);

            ajax.onload = function () {
                var data;

                if (ajax.status >= 200 && ajax.status < 400) {
                    data = JSON.parse(ajax.responseText);
                    module.preset = data;
                    document.dispatchEvent(module.events.loadpreset);
                } else {
                    module.preset = module.defaultPreset;
                    document.dispatchEvent(module.events.loadpreset);
                }
            };

            ajax.send();

            return;
        },

        togglePresetBank: function () {
            presetBank.dataset.state =
                presetBank.dataset.state === 'closed' ?
                        'open' :
                        'closed';
            return;
        }


    };

    document.addEventListener('loadpreset', module.program.load);

    program.addEventListener('click', module.program.cycle);

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    module.setPitch = function (pitch) {
        var glide = module.preset.glide * module.config.glideMax + module.config.glideMin,
            i;

        for (i = 0; i < module.config.trackedOscs.length; i += 1) {
            module.config.trackedOscs[i].detune.setTargetAtTime(pitch, module.currentTime, glide);
        }

        return;
    };

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';

    var offset = -135,
        updateMethods = {
            'harmonic-oscillator': 'updateharmonicoscillator',
            'lfo1': 'updatelfo1',
            'lfo2': 'updatelfo2',
            'performance': 'updateperformance',
            'timbre-env': 'updatetimbreenv',
            'vca': 'updatevca'
        };

    module.slider = {
        // TODO Can't decide if rotate should use event.target.value or module.preset[program]
        grab: function (event) {
            var program,
                update;

            if (event.target.type === 'range') {
                program = event.target.dataset.program;

                update = updateMethods[event.target.parentElement.parentElement.parentElement.id];

                module.preset[program] = event.target.dataset.curve === 'lin' ?
                        parseFloat(event.target.value) :
                        Math.pow(event.target.value, 2);

                event.target.nextElementSibling.style.transform = module.slider.rotate(event.target.value, event.target.min === '-1');

                return event.target.dispatchEvent(module.events[update]);
            }

            return;
        },

        rotate: function (x, unipolar) {
            var r = unipolar ? x * 135 : x * 270 + offset;
            return 'rotate(' + r + 'deg)';
        }
    };

    document.addEventListener('input', module.slider.grab);

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';

    module.startSynth = function () {
        var i;

        for (i = 1; i <= 8; i += 1) {
            module.harmonicOscillator['osc' + i].start(0);
        }

        module.lfo1.start(0);
        module.lfo2.start(0);

        document.removeEventListener('click', module.startSynth);
        document.removeEventListener('keydown', module.startSynth);
        document.removeEventListener('mousedown', module.startSynth);
        document.removeEventListener('touchend', module.startSynth);

        module.startSynth = undefined;

        return;
    };

    document.addEventListener('click', module.startSynth);
    document.addEventListener('keydown', module.startSynth);
    document.addEventListener('mousedown', module.startSynth);
    document.addEventListener('touchend', module.startSynth);

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    module.now = function () {
        return module.currentTime;
    };

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    var gateOn = false,
        keyboard = document.getElementById('keyboard'),
        mouseAndTouch = true;

    module.gate = function (event) {
        var gateEvent = gateOn ? 'gateoff' : 'gateon',
            mutexEvent = !!(
                event.type === 'keydown' ||
                event.type === 'keyup' ||
                event.type === 'mousedown' ||
                event.type === 'mouseup'
            ),
            touchGate = !!(
                (event.type === 'touchstart' && event.touches.length === 1) ||
                (event.type === 'touchend' && event.touches.length === 0)
            );

        if (mutexEvent || touchGate || event.type === 'midimessage') {
            gateOn = !gateOn;
            document.dispatchEvent(module.events[gateEvent]);
        }

        if (event.type === 'touchstart') {
            event.preventDefault();
        }

        if (mouseAndTouch && event.type === 'touchstart') {
            keyboard.removeEventListener('mousedown', module.gate);
            keyboard.removeEventListener('mouseup', module.gate);
            mouseAndTouch = false;
        }

        return;
    };

    keyboard.addEventListener('mousedown', module.gate);
    keyboard.addEventListener('mouseup', module.gate);
    keyboard.addEventListener('touchend', module.gate);
    keyboard.addEventListener('touchstart', module.gate);

    return module;
}(EVE));
