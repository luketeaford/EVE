// Prefix Web Audio for Safari and iOS
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var EVE = new AudioContext();

EVE = (function (module) {
    'use strict';

    // If events were lowercased, that would solve the problem, too
    module.events = {
        gateOff: new CustomEvent('gateoff', {bubbles: true}),
        gateOn: new CustomEvent('gateon', {bubbles: true}),
        updateHarmonicOscillator: new CustomEvent('updateharmonicoscillator', {bubbles: true}),
        updateLfo1: new CustomEvent('updatelfo1', {bubbles: true}),
        updateLfo2: new CustomEvent('updatelfo2', {bubbles: true}),
        updatePerformance: new CustomEvent('updateperformance', {bubbles: true}),
        loadPreset: new CustomEvent('loadpreset', {bubbles: true}),
        updateTimbreEg: new CustomEvent('updatetimbreeg', {bubbles: true}),
        updateTimbreEnv: new CustomEvent('updatetimbreenv', {bubbles: true}),
        updateVca: new CustomEvent('updatevca', {bubbles: true})
    };

    return module;
}(EVE));

EVE = (function config(module) {
    'use strict';

    module.config = {
        egMax: 2.125,
        egMin: 0.025,
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

    return module;
}(EVE));

// TODO Refactor for clarity
EVE = (function (module) {
    'use strict';
    var fft = 2048,
        oscope = document.getElementById('scope'),
        ctx = oscope.getContext('2d'),
        lineColor = 'rgb(53, 56, 55)',
        scopeData = new Uint8Array(fft);

    module.oscilloscope = module.createAnalyser();

    (function draw() {
        var sliceWidth = 300 / fft,// canvas/fft
            x = 0,
            i,
            v,
            y;

        window.requestAnimationFrame(draw);

        ctx.clearRect(0, 0, 300, 150);//canvas size
        ctx.lineWidth = 2;
        ctx.strokeStyle = lineColor;
        ctx.beginPath();
        module.oscilloscope.getByteTimeDomainData(scopeData);
        for (i = 0; i < fft; i += 1) {
            v = scopeData[i] / 128;
            y = v * 150 / 2;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        ctx.lineTo(300, 150 / 2);//canvas size
        ctx.stroke();
    }());

    return module;
}(EVE));

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

    // BIND EVENTS
    document.addEventListener('updatevca', module.vca.update);
    document.addEventListener('gateon', module.vca.gateOn);
    document.addEventListener('gateoff', module.vca.gateOff);

    return module;

}(EVE));

EVE = (function (module) {
    'use strict';
    var debug = false,
        i,
        osc;

    module.harmonicOscillator = {

        inputs: document.querySelectorAll('#harmonic-oscillator input'),

        update: function (e) {
            var p;

            if (e.target && e.target.dataset && e.target.dataset.program) {
                p = e.target.dataset.program;
            }

            module.harmonicOscillator[p].vca.gain.setValueAtTime(module.preset[p], module.now());

            // DEBUG
            if (debug && console) {
                console.log(p, module.preset[p]);
            }
        }
    };

    // Harmonic oscillator mixer
    module.harmonicOscillator.mixer = module.createGain();
    module.harmonicOscillator.mixer.gain.value = -1;

    for (i = 1; i <= 8; i += 1) {
        osc = 'osc' + i;
        // Oscillators
        module.harmonicOscillator[osc] = module.createOscillator();
        module.harmonicOscillator[osc].frequency.value = module.config.masterFreq * i;
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

    // EVENT BINDINGS
    document.addEventListener('updateharmonicoscillator', module.harmonicOscillator.update);

    return module;
}(EVE));

// TODO oscInputs is kind of a confusing name and it's a bad selector
EVE = (function (module) {
    'use strict';
    var debug = false,
        i,
        lfo,
        osc;

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
    module.lfo1.rate = document.getElementById('lfo1-rate');
    module.lfo1.oscInputs = document.querySelectorAll('#lfo1 .js-osc');

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

        // DEBUG
        if (debug && console) {
            console.log(p, module.preset[p]);
        }
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
        module.lfo1.rate.value = Math.sqrt(module.preset.lfo1_rate);

        for (i = 1; i < EVE.lfo1.oscInputs.length; i += 1) {
            osc = 'osc' + i + '_lfo';
            module.lfo1.oscInputs[i - 1].value = module.preset[osc];
        }
    };

    // BIND EVENTS
    document.addEventListener('updatelfo1', module.lfo1.update);
    document.addEventListener('loadpreset', module.lfo1.load);

    return module;
}(EVE));

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

    module.lfo2.sine = document.getElementById('lfo2-sin');
    module.lfo2.square = document.getElementById('lfo2-sqr');
    module.lfo2.sawtooth = document.getElementById('lfo2-saw');
    module.lfo2.triangle = document.getElementById('lfo2-tri');
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
        module.lfo2_vca.gain.setTargetAtTime(1, module.now() + module.preset.lfo2_delay * module.config.lfo2DelayMax, module.preset.lfo2_a * module.config.egMax + module.config.egMin);

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
            module.lfo2_pitch.gain.setValueAtTime(module.preset.lfo2_pitch * module.config.lfo2RateMax, module.now());
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
    };

    module.lfo2.load = function () {
        module.lfo2[module.preset.lfo2_type].checked = true;
        module.lfo2.rate.value = Math.sqrt(module.preset.lfo2_rate);
        module.lfo2.amp.value = module.preset.lfo2_amp;
        module.lfo2.pitch.value = Math.sqrt(module.preset.lfo2_pitch);
        module.lfo2.delay.value = Math.sqrt(module.preset.lfo2_delay);
        module.lfo2.attack.value = Math.sqrt(module.preset.lfo2_a);
        module.lfo2.release.value = Math.sqrt(module.preset.lfo2_r);
        module.lfo2.gain.value = Math.sqrt(module.preset.lfo2_g);
    };

    // BIND EVENTS
    document.addEventListener('updatelfo2', module.lfo2.update);
    document.addEventListener('gateon', module.lfo2.gateOn);
    document.addEventListener('gateoff', module.lfo2.gateOff);
    document.addEventListener('loadpreset', module.lfo2.load);

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    var debug = false;

    module.performance = {
        glide: document.getElementById('glide'),

        update: function (e) {
            var p;

            if (e.target && e.target.dataset && e.target.dataset.program) {
                p = e.target.dataset.program;
            }

            if (debug && console) {
                console.log(p, module.preset[p]);
            }

            switch (p) {
            case 'glide':
                module.preset.glide = module.preset.glide * module.config.glideMax + module.config.glideMin;
                break;
            }
        },

        load: function () {
            module.performance.glide.value = module.preset.glide;
        }
    };

    // BIND EVENTS
    document.addEventListener('updateperformance', module.performance.update);
    document.addEventListener('loadpreset', module.performance.load);

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    var debug = false;

    module.timbreEg = {
        inputs: document.querySelectorAll('#timbre-eg input'),

        update: function (e) {
            var p;

            if (e.target && e.target.dataset && e.target.dataset.program) {
                p = e.target.dataset.program;
            }

            // DEBUG
            if (debug && console) {
                console.log(p, module.preset[p]);
            }
        }
    };

    // BIND EVENTS
    document.addEventListener('updatetimbreeg', module.timbreEg.update);

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    var debug = true;

    module.timbreEnv = {
        attack: document.getElementById('timbre-a'),
        decay: document.getElementById('timbre-d'),
        sustain: document.getElementById('timbre-s'),
        release: document.getElementById('timbre-r'),

        gateOn: function () {
            var env,
                i = 1,
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

            if (debug && console) {
                console.log('Timbre envelope on');
            }
            return;
        },

        gateOff: function () {
            var i = 1,
                peak,
                vca;

            for (i; i <= 8; i += 1) {
                vca = module.harmonicOscillator['osc' + i].vca;

                // Prevent decay from acting like second attack
                vca.gain.cancelScheduledValues(module.now());

                // Set starting point
                peak = vca.gain.value;
                vca.gain.setValueAtTime(peak, module.now());

                // Release
                vca.gain.setTargetAtTime(module.preset['osc' + i], module.now(), module.preset.timbre_r);
            }

            if (debug && console) {
                console.log('Timbre envelope off');
            }
            return;
        },

        update: function (e) {
            var p;

            if (e.target && e.target.dataset && e.target.dataset.program) {
                p = e.target.dataset.program;
            }

            // DEBUG
            if (debug && console) {
                console.log(p, module.preset[p]);
            }
        }
    };

    document.addEventListener('updatetimbreenv', module.timbreEnv.update);
    document.addEventListener('gateon', module.timbreEnv.gateOn);
    document.addEventListener('gateoff', module.timbreEnv.gateOff);

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';

    var buttons = document.querySelectorAll('input[type=radio]'),
        debug = false,
        i;

    module.button = {
        press: function () {
            var prog = this.name,
                update = 'update' + this.parentElement.parentElement.parentElement.dataset.update;

            // Update program
            if (module.preset[prog] !== this.value) {
                // Prevents numbers being stored as strings
                if (typeof this.value === 'string' && !isNaN(this.value - 1)) {
                    module.preset[prog] = parseFloat(this.value);
                } else {
                    module.preset[prog] = this.value;
                }
            }

            // DEBUG
            if (debug && console) {
                console.log('Updating', update);
            }

            // Broadcast change
            this.dispatchEvent(module.events[update]);
        }
    };

    for (i = 0; i < buttons.length; i += 1) {
        buttons[i].addEventListener('change', module.button.press);
    }

    return module;
}(EVE));

// TODO EVALUATE WHETHER OR NOT THINGS SHOULD BE BOUND TO THE KEYBOARD HERE
// TODO pitch needs a fine tune added (+) after n
EVE = (function (module) {
    'use strict';

    var keyboard = document.getElementById('keyboard');

    module.calculatePitch = function (note) {// This is really the event, right?
        var n = note.target ? note.target.dataset.noteValue : note,
            pitch = module.keyboard.octaveShift * 1200 + parseFloat(n);

        return module.setPitch(pitch);
    };

    // BIND EVENTS
    keyboard.addEventListener('mousedown', module.calculatePitch);
    keyboard.addEventListener('touchstart', module.calculatePitch);

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    var debug = true;

    module.attack = function (x) {
        if (debug && console) {
            console.log('Attack function used');
        }

        return EVE.now() + x;
    };

    return module;
}(EVE));

// TODO Consider moving shiftOctave to performance controls
EVE = (function (module) {
    'use strict';
    var buttons = document.getElementsByClassName('shift-octave'),
        i,
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
        lights: document.querySelectorAll('#performance [data-light]'),
        keys: document.querySelectorAll('#keyboard button'),
        octaveShift: 0,
        scope: document.getElementById('keyboard'),

        shiftOctave: function (direction) {
            var oct = module.keyboard.octaveShift,
                shift = this.dataset ? this.dataset.shift : direction;

            function switchLights() {
                var n = module.keyboard.octaveShift + 2;

                for (i = 0; i < module.keyboard.lights.length; i += 1) {
                    module.keyboard.lights[i].dataset.light = i === n ? 'on' : 'off';
                }
            }

            if ((oct > -2 && shift < 0) || (oct < 2 && shift > 0)) {
                module.keyboard.octaveShift = oct + parseFloat(shift);
                switchLights();
            }
            return;
        },

        convertQwertyToPitch: function (keycode) {
            return qwertyPitches[keycode];
        },

        highlightKey: function (keycode) {
            key = qwertyKeys[keycode];

            module.keyboard.keys[key].dataset.active =
                module.keyboard.keys[key].dataset.active === "false" ?
                        "true" :
                        "false";
            return;
        },

        pressBus: function (e) {
            switch (e.which) {
            // z
            case 122:
                module.keyboard.shiftOctave(-1);
                break;
            // x
            case 120:
                module.keyboard.shiftOctave(1);
                break;
            // `
            case 96:
                if (console) {
                    console.log(module.preset);
                }
                break;
            }
            return;
        },

        downBus: function (e) {
            pitch = module.keyboard.convertQwertyToPitch(e.which);

            if (pitch) {
                if (playing.indexOf(pitch) === -1) {
                    playing.push(pitch);
                    playing.sort(function (a, b) {
                        return a - b;
                    });
                }
                if (!keyDown) {
                    keyDown = !keyDown;
                    module.gate();
                }
                module.calculatePitch(pitch);
                module.keyboard.highlightKey(e.which);
            }
            return;
        },

        upBus: function (e) {
            pitch = module.keyboard.convertQwertyToPitch(e.which);

            if (pitch) {
                playing.splice(playing.indexOf(pitch), 1);
                if (playing.length >= 1) {
                    module.calculatePitch(playing[playing.length - 1]);
                } else {
                    keyDown = !keyDown;
                    module.gate();
                }
                module.keyboard.highlightKey(e.which);
            }
            return;
        }

    };

    for (i = 0; i < buttons.length; i += 1) {
        buttons[i].addEventListener('click', module.keyboard.shiftOctave);
        buttons[i].addEventListener('touchstart', module.keyboard.shiftOctave);
    }

    document.addEventListener('keypress', module.keyboard.pressBus);
    document.addEventListener('keydown', module.keyboard.downBus);
    document.addEventListener('keyup', module.keyboard.upBus);

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';

    module.program = {
        load: function load() {
            var ajax = new XMLHttpRequest();

            ajax.open('GET', '/presets/cool-sci-fi-sound.json', true);

            ajax.onload = function () {
                var data;

                if (ajax.status >= 200 && ajax.status < 400) {
                    data = JSON.parse(ajax.responseText);
                    console.log(data);
                    module.preset = data;
                    document.dispatchEvent(module.events.loadPreset);
                } else {
                    data = module.preset;
                }
            };

            ajax.send();
        }
    };

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    module.setPitch = function (pitch) {
        var i;

        for (i = 1; i <= 8; i += 1) {
            module.harmonicOscillator['osc' + i].detune.setTargetAtTime(pitch, module.now(), module.preset.glide);
        }

        if (module.preset.lfo1_range >= 440) {
            module.lfo1.detune.setValueAtTime(pitch, module.now(), module.preset.glide);
        }
    };

    return module;
}(EVE));

// TODO Here, 'prog' is used instead of 'p'. And it's really a 'parameter' or something.
EVE = (function (module) {
    'use strict';

    var debug = false,
        i,
        inputs = document.querySelectorAll('input[type=range]');

    module.slider = {

        grab: function () {
            var prog = this.dataset.program,
                update = 'update' + this.parentElement.parentElement.parentElement.dataset.update,
                x = this.dataset.curve === 'lin' ? 1 : this.value;

            // Update program
            module.preset[prog] = this.value * x;

            if (debug && console) {
                console.log('Updating', update);
            }

            // Broadcast change
            this.dispatchEvent(module.events[update]);
        }
    };

    for (i = 0; i < inputs.length; i += 1) {
        inputs[i].addEventListener('input', module.slider.grab);
    }

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

// TODO Evaluate whether or not the keyboard events should be bound here
EVE = (function (module) {
    'use strict';
    var gateOn = false,
        keyboard = document.getElementById('keyboard');

    module.gate = function () {
        var gateEvent = gateOn ? 'gateOff' : 'gateOn';

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
