// Prefix Web Audio for Safari and iOS
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var EVE = new AudioContext();

EVE = (function (module) {
    'use strict';

    module.events = {
        gateoff: new CustomEvent('gateoff', {
            bubbles: true
        }),

        gateon: new CustomEvent('gateon', {
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
        lfo2RateMax: 139,
        masterFreq: 440
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
        lfo1_range: 20,
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
        oscope = document.getElementById('scope'),
        ctx = oscope.getContext('2d'),
        lineColor = 'rgb(51, 58, 52)',// dark grey
        scopeData = new Uint8Array(fft),
        scopeHeight = 150,
        scopeWidth = 300;

    module.oscilloscope = module.createAnalyser();

    (function draw() {
        var sliceWidth = scopeWidth / fft,
            x = 0,
            i,
            v,
            y;

        window.requestAnimationFrame(draw);

        ctx.clearRect(0, 0, scopeWidth, scopeHeight);
        ctx.lineWidth = 2;
        ctx.strokeStyle = lineColor;
        ctx.beginPath();
        module.oscilloscope.getByteTimeDomainData(scopeData);
        for (i = 0; i < fft; i += 1) {
            v = scopeData[i] / 128;
            y = v * scopeHeight / 2;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        ctx.lineTo(scopeWidth, scopeHeight / 2);
        ctx.stroke();
    }());

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    var attack = document.getElementById('vca-a'),
        decay = document.getElementById('vca-d'),
        sustain = document.getElementById('vca-s'),
        release = document.getElementById('vca-r'),
        gain = document.getElementById('vca-g');

    module.vca = module.createGain();
    module.vca.gain.value = module.preset.vca_g;
    module.vca.connect(module.destination);
    module.vca.connect(module.oscilloscope);

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

        return;
    };

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

    module.vca.update = function () {
        var p;

        if (event.target && event.target.dataset && event.target.dataset.program) {
            p = event.target.dataset.program;
        }

        if (p === 'vca_g') {
            module.vca.gain.setValueAtTime(module.preset.vca_g, module.now());
        }

        return;
    };

    module.vca.load = function () {
        attack.value = Math.sqrt(module.preset.vca_a);
        decay.value = Math.sqrt(module.preset.vca_d);
        sustain.value = module.preset.vca_s;
        release.value = Math.sqrt(module.preset.vca_r);
        gain.value = Math.sqrt(module.preset.vca_g);

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

        // Connect the mixer to the master VCA
        module.harmonicOscillator.mixer.connect(module.vca);
    }

    module.harmonicOscillator.update = function (e) {
        var harmonicOsc = module.harmonicOscillator,
            p;

        if (e.target && e.target.dataset && e.target.dataset.program) {
            p = e.target.dataset.program;
        }

        harmonicOsc[p].vca.gain.setValueAtTime(module.preset[p], module.now());

        if (debug && console) {
            console.log(p, module.preset[p]);
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

    module.lfo1.update = function () {
        var p;

        if (event.target && event.target.dataset && event.target.dataset.program) {
            p = event.target.dataset.program;
        } else {
            console.log('Something is wrong with LFO1');
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

        module.lfo1.type = module.preset.lfo1_type;
        module.lfo1[module.preset.lfo1_type].checked = true;
        module.lfo1.frequency.setValueAtTime(module.preset.lfo1_rate * module.preset.lfo1_range, module.now());
        module.lfo1[lfo1Ranges[module.preset.lfo1_range]].checked = true;
        rate.value = Math.sqrt(module.preset.lfo1_rate);

        for (i = 1; i <= 8; i += 1) {
            osc = 'osc' + i + '_lfo';
            module[osc].gain.setValueAtTime(module.preset[osc], module.now());
            oscInputs[i - 1].value = module.preset[osc];
        }

        return;
    };

    document.addEventListener('updatelfo1', module.lfo1.update);
    document.addEventListener('loadpreset', module.lfo1.load);

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';

    var amp = document.getElementById('lfo2-amp'),
        attack = document.getElementById('lfo2-attack'),
        debug = false,
        delay = document.getElementById('lfo2-delay'),
        gain = document.getElementById('lfo2-gain'),
        i,
        negative = document.getElementById('lfo2-negative'),
        pitch = document.getElementById('lfo2-pitch'),
        positive = document.getElementById('lfo2-positive'),
        rate = document.getElementById('lfo2-rate'),
        release = document.getElementById('lfo2-release'),
        lfo2Types = {
            'sawtooth': document.getElementById('lfo2-saw'),
            'sine': document.getElementById('lfo2-sin'),
            'square': document.getElementById('lfo2-sqr'),
            'triangle': document.getElementById('lfo2-tri')
        };

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
        module.lfo2_vca.gain.setTargetAtTime(1, module.now() + module.preset.lfo2_delay * module.config.lfo2DelayMax, module.preset.lfo2_a * module.config.egMax + module.config.egMin);

        return;
    };

    module.lfo2.update = function () {
        var p;

        if (event.target && event.target.dataset && event.target.dataset.program) {
            p = event.target.dataset.program;
        } else {
            console.log('Something is wrong with LFO2');
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
            module.lfo2_pitch.gain.setValueAtTime(module.preset.lfo2_pitch * module.config.lfo2RateMax, module.now());
            break;
        case 'lfo2_rate':
            module.lfo2.frequency.setValueAtTime(module.preset.lfo2_rate * module.config.lfo2RateMax * module.preset.lfo2_polarity, module.now());
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

        // RATE AND POLARITY
        module.lfo2.frequency.setValueAtTime(module.preset.lfo2_rate * module.config.lfo2RateMax * module.preset.lfo2_polarity, module.now());
        rate.value = Math.sqrt(module.preset.lfo2_rate);
        if (module.preset.lfo2_polarity > 0) {
            positive.checked = true;
        } else {
            negative.checked = true;
        }

        // AMP
        module.lfo2_amp.gain.setValueAtTime(module.preset.lfo2_amp, module.now());
        amp.value = module.preset.lfo2_amp;

        // PITCH
        module.lfo2_pitch.gain.setValueAtTime(module.preset.lfo2_pitch * module.config.lfo2RateMax, module.now());
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

EVE = (function (module) {
    'use strict';
    var debug = true,
        glide = document.getElementById('glide'),
        lights = document.querySelectorAll('#octave-shift [data-light]'),
        octaveShift = document.getElementById('octave-shift');

    module.performance = {
        octaveShift: 0,

        shiftOctave: function (direction) {
            var i,
                oct,
                shift;

            if (event.target.dataset.shift || event.type === 'keypress') {
                oct = module.performance.octaveShift;
                shift = event.target.dataset.shift || direction;

                if ((oct > -2 && shift < 0) || (oct < 2 && shift > 0)) {
                    module.performance.octaveShift = oct + parseFloat(shift);
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

        update: function () {
            var p;

            if (event.target && event.target.dataset && event.target.dataset.program) {
                p = event.target.dataset.program;
            } else {
                console.log('Something wrong with performance');
            }

            if (debug && console) {
                console.log(p, module.preset[p]);
            }

            console.log('Updating performance');

            return;
        },

        load: function () {
            glide.value = module.preset.glide;

            return;
        }
    };


    document.addEventListener('loadpreset', module.performance.load);
    document.addEventListener('updateperformance', module.performance.update);

    octaveShift.addEventListener('click', module.performance.shiftOctave);
    octaveShift.addEventListener('touchend', module.performance.shiftOctave);

    return module;
}(EVE));

// TODO Inputs here is kind of a bad name
EVE = (function (module) {
    'use strict';
    var attack = document.getElementById('timbre-a'),
        debug = true,
        decay = document.getElementById('timbre-d'),
        inputs = document.getElementsByClassName('js-eg-amt'),
        release = document.getElementById('timbre-r'),
        sustain = document.getElementById('timbre-s');

    module.timbreEnv = {

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

            return;
        },

        update: function () {
            var p;

            if (event.target && event.target.dataset && event.target.dataset.program) {
                p = event.target.dataset.program;
            }

            if (debug && console) {
                console.log(p, module.preset[p]);
            }

            return;
        },

        load: function () {
            var i,
                osc;

            for (i = 1; i <= 8; i += 1) {
                osc = 'osc' + i + '_eg';
                inputs[i - 1].value = module.preset[osc];
            }

            attack.value = Math.sqrt(module.preset.timbre_a);
            decay.value = Math.sqrt(module.preset.timbre_d);
            sustain.value = module.preset.timbre_s;
            release.value = Math.sqrt(module.preset.timbre_r);

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

    module.button = {
        press: function () {
            var prog,
                update,
                value;

            if (event.target.type === 'radio') {
                prog = event.target.name;
                update = 'update' + event.path[2].dataset.update;
                value = event.target.value;

                if (module.preset[prog] !== value) {
                    // Prevent numbers being stored as strings
                    if (typeof value === 'string' && !isNaN(value - 1)) {
                        module.preset[prog] = parseFloat(value);
                    } else {
                        module.preset[prog] = value;
                    }
                }

                event.target.dispatchEvent(module.events[update]);
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

    module.calculatePitch = function (note) {
        var n = event.target.dataset.noteValue || note,
            pitch = module.performance.octaveShift * 1200 + parseFloat(n);

        return module.setPitch(pitch);
    };

    keyboard.addEventListener('mousedown', module.calculatePitch);
    keyboard.addEventListener('touchstart', module.calculatePitch);

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    var key,
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

        pressBus: function () {
            switch (event.which) {
            // ,
            case 44:
                module.program.cycle(-1);
                break;
            // .
            case 46:
                module.program.cycle(1);
                break;
            // z
            case 122:
                module.performance.shiftOctave(-1);
                break;
            // x
            case 120:
                module.performance.shiftOctave(1);
                break;
            }
            return;
        },

        downBus: function () {
            pitch = module.keyboard.convertQwertyToPitch(event.which);

            if (pitch) {
                if (playing.indexOf(pitch) === -1) {
                    module.calculatePitch(pitch);
                    module.keyboard.highlightKey(event.which);
                    playing.push(pitch);
                    playing.sort(function (a, b) {
                        return a - b;
                    });
                }
                if (!keyDown) {
                    keyDown = !keyDown;
                    module.gate();
                }
            }
            return;
        },

        upBus: function () {
            pitch = module.keyboard.convertQwertyToPitch(event.which);

            if (pitch) {
                playing.splice(playing.indexOf(pitch), 1);
                if (playing.length >= 1) {
                    module.calculatePitch(playing[playing.length - 1]);
                } else {
                    keyDown = !keyDown;
                    module.gate();
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
    var debug = true;

    if (navigator.requestMIDIAccess) {
        module.midi = {
            active: null,

            events: function () {
                var n = event.data[1];

                switch (event.data[0]) {
                case module.midi.messages.listen:
                    if (debug && console) {
                        console.log('MIDI listen');
                    }
                    break;
                case module.midi.messages.noteOn:
                    if (event.data[2] >= 1) {
                        if (module.midi.active === null) {
                            module.midi.active = n;
                            module.gate();
                        }
                        module.calculatePitch(module.midi.toCents(n));
                    } else {
                        // Cheap MIDI controller note off
                        if (module.midi.active === n) {
                            module.midi.active = null;
                            module.gate();
                        } else {
                            // Return to initial note (for legato playing)
                            module.calculatePitch(module.midi.toCents(module.midi.active));
                        }
                    }
                    break;
                case module.midi.messages.noteOff:
                    module.midi.active = null;
                    module.gate();
                    break;
                // NEEDS WORK, BUT IS A GOOD ROUGH DRAFT
                case module.midi.messages.volume:
                    module.preset.osc2 = (event.data[2] / 127) * (event.data[2] / 127);
                    module.harmonicOscillator.inputs[1].dispatchEvent(module.events.updateharmonicoscillator);
                    module.harmonicOscillator.inputs[1].value = Math.sqrt(module.preset.osc2);
                    console.log('Moving the volume slider', event.data[2]);
                    break;
                case module.midi.messages.bankSelect:
                    console.log('You have selected a new bank');
                    break;
                default:
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

                    debug = false;
                    if (debug && console) {
                        console.log('Available devices:', devices);
                    }

                    return devices;
                });
            },

            messages: {
                noteOn: 144,
                noteOff: 128,
                pitchWheel: 224,
                bankSelect: 192,
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
        'test-lfo2',
        'test-lfo1',
        'distorted-sawtooth',
        'miranda',
        'percusso',
        'oranges',
        'test-patch',
        'cool-sci-fi-sound',
        'problematic-patch'
    ],
        displayName = document.getElementById('display-name'),
        number = 0,
        numberOfPresets = bank.length - 1,
        program = document.getElementById('program');

    module.program = {
        cycle: function (direction) {
            var i = 0,
                x = parseFloat(event.target.dataset.cycle) || direction;

            if (event.target.dataset.cycle || event.type === 'keypress') {
                i = number + x;
                if (i >= 0 && i <= numberOfPresets) {
                    number += x;
                    return module.program.loadPreset(number);
                }
            }

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

        load: function () {
            displayName.textContent = module.preset.name;
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

        for (i = 1; i <= 8; i += 1) {
            module.harmonicOscillator['osc' + i].detune.setTargetAtTime(pitch, module.now(), glide);
        }

        if (module.preset.lfo1_range >= 440) {
            module.lfo1.detune.setTargetAtTime(pitch, module.now(), glide);
        }

        return;
    };

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';

    var updateMethods = {
        'harmonic-oscillator': 'updateharmonicoscillator',
        'lfo1': 'updatelfo1',
        'lfo2': 'updatelfo2',
        'performance': 'updateperformance',
        'timbre-env': 'updatetimbreenv',
        'vca': 'updatevca'
    };

    module.slider = {
        grab: function () {
            var program,
                update,
                x;

            if (event.target.type === 'range') {
                program = event.target.dataset.program;
                update = updateMethods[event.path[2].id];
                x = event.target.dataset.curve === 'lin' ? 1 : event.target.value;

                module.preset[program] = event.target.value * x;

                event.target.dispatchEvent(module.events[update]);
            }

            return;
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
        keyboard = document.getElementById('keyboard');

    module.gate = function () {
        var gateEvent = gateOn ? 'gateoff' : 'gateon';

        gateOn = !gateOn;

        document.dispatchEvent(module.events[gateEvent]);

        return;
    };

    // BIND EVENTS
    keyboard.addEventListener('mousedown', module.gate);
    keyboard.addEventListener('mouseup', module.gate);
    keyboard.addEventListener('touchend', module.gate);
    keyboard.addEventListener('touchstart', module.gate);

    return module;
}(EVE));
