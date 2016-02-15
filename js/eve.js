// Prefix Web Audio for Safari and iOS
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var EVE = new AudioContext();

EVE = (function (module) {
    'use strict';

    module.events = {
        updateHarmonicOscillator: new CustomEvent('updateharmonicoscillator', {bubbles: true}),
        updateLfo1: new CustomEvent('updatelfo1', {bubbles: true}),
        updateLfo2: new CustomEvent('updatelfo2', {bubbles: true}),
        updatePerformance: new CustomEvent('updateperformance', {bubbles: true}),
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
        egMin: 0.05,
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
        timbre_s: 0,
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
        lfo2_d: 0,
        lfo2_a: 0,
        lfo2_r: 0.0001,
        lfo2_g: 0,

        // VCA
        vca_a: 0,
        vca_d: 0.1,
        vca_s: 0,
        vca_r: 0.1,
        vca_g: 0,

        // Performance
        glide: 0.000001//tolerable maximum = 0.165

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

EVE = (function (module) {
    'use strict';

    module.vca = module.createGain();
    module.vca.gain.value = module.preset.vca_g;
    module.vca.connect(module.destination);
    module.vca.connect(module.oscilloscope);
    module.vca.debug = true;
    module.vca.attack = document.getElementById('vca-a');
    module.vca.decay = document.getElementById('vca-d');
    module.vca.sustain = document.getElementById('vca-s');
    module.vca.release = document.getElementById('vca-r');

    module.vca.update = function (e) {
        var p;

        if (e.target && e.target.dataset && e.target.dataset.program) {
            p = e.target.dataset.program;
        }

        if (module.vca.debug && console) {
            console.log(p, module.preset[p]);
        }

        if (p === 'vca_g') {
            module.vca.gain.setValueAtTime(module.preset.vca_g, module.now());
        }

    };

    document.addEventListener('updatevca', module.vca.update);

    return module;

}(EVE));

EVE = (function (module) {
    'use strict';
    var i,
        osc;

    module.harmonicOscillator = {
        debug: true,
        inputs: document.querySelectorAll('#harmonic-oscillator input'),
        update: function (e) {
            var p;

            if (e.target && e.target.dataset && e.target.dataset.program) {
                p = e.target.dataset.program;
            }

            if (module.harmonicOscillator.debug && console) {
                console.log(p, module.preset[p]);
            }

            module.harmonicOscillator[p].vca.gain.setValueAtTime(module.preset[p], module.now());
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

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    var i,
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

    module.lfo1.debug = true;

    module.lfo1.scope = document.getElementById('lfo1');
    module.lfo1.sine = document.getElementById('lfo1-sin');
    module.lfo1.square = document.getElementById('lfo1-sqr');
    module.lfo1.tri = document.getElementById('lfo1-tri');
    module.lfo1.saw = document.getElementById('lfo1-saw');
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

        if (module.lfo1.debug && console) {
            console.log(p, module.preset[p]);
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
            if (module.lfo1.debug && console) {
                console.log('Unhandled LFO 1 update change');
            }
        }

    };

    return module;
}(EVE));

// TODO Figure out why lfo2_vca gain is hardcoded to 0 here
// TODO module.lfo2.max is better as 139 than 40...
EVE = (function (module) {
    'use strict';

    var i;

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

    module.lfo2.debug = true;
    module.lfo2.max = 40;
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

    module.lfo2.update = function (e) {
        var p;

        if (e.target && e.target.dataset && e.target.dataset.program) {
            p = e.target.dataset.program;
        }

        if (module.lfo2.debug && console) {
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
            // TODO: Why multiply preset.lfo2_pitch by some weird number?
            // Because I want to keep the preset 0-1
            // Move 139 into module.config somewhere
            module.lfo2_pitch.gain.setValueAtTime(module.preset.lfo2_pitch * 139, module.now());
            break;
        case 'lfo2_rate':
            module.lfo2.frequency.setValueAtTime(module.preset.lfo2_rate * module.lfo2.max, module.now());
            break;
        case 'lfo2_type':
            module.lfo2.type = module.preset.lfo2_type;
            break;
        default:
            if (module.lfo2.debug && console) {
                console.log('Unhandled LFO 2 update change');
            }
        }
    };

    return module;
}(EVE));

// TODO The random number (0.165) is a tolerable maximum: move it to a config
EVE = (function (module) {
    'use strict';

    module.performance = {
        debug: true,
        glide: document.getElementById('glide'),
        update: function (e) {
            var p;

            if (e.target && e.target.dataset && e.target.dataset.program) {
                p = e.target.dataset.program;
            }

            if (module.performance.debug && console) {
                console.log(p, module.preset[p]);
            }

            switch (p) {
            case 'glide':
                module.preset.glide = module.preset.glide * 0.165;
                if (module.performance.debug && console) {
                    console.log('Glide updated to', module.preset.glide);
                }
                break;
            default:
                if (module.performance.debug && console) {
                    console.log('Unhandled performance update change');
                }
            }
        }
    };

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    module.timbreEg = {
        debug: true,
        inputs: document.querySelectorAll('#timbre-eg input'),
        update: function (e) {
            var p;

            if (e.target && e.target.dataset && e.target.dataset.program) {
                p = e.target.dataset.program;
            }

            if (module.timbreEg.debug && console) {
                console.log(p, module.preset[p]);
            }
        }
    };

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    module.timbreEnv = {
        debug: true,
        attack: document.getElementById('timbre-a'),
        decay: document.getElementById('timbre-d'),
        sustain: document.getElementById('timbre-s'),
        release: document.getElementById('timbre-r'),

        update: function (e) {
            var p;

            if (e.target && e.target.dataset && e.target.dataset.program) {
                p = e.target.dataset.program;
            }

            if (module.timbreEnv.debug && console) {
                console.log(p, module.preset[p]);
            }
        }
    };

    return module;
}(EVE));

// TODO Rename this file to button.js
EVE = (function (module) {
    'use strict';

    var buttons = document.querySelectorAll('input[type=radio]'),
        i;

    module.button = {
        debug: true,
        press: function () {
            var prog = this.name,
                update = 'update_' + this.parentElement.parentElement.parentElement.dataset.update;

            // Update program
            if (module.preset[prog] !== this.value) {
                // Prevents numbers being stored as strings
                if (typeof this.value === 'string' && !isNaN(this.value - 1)) {
                    module.preset[prog] = parseFloat(this.value);
                } else {
                    module.preset[prog] = this.value;
                }
            }

            if (module.button.debug && console) {
                console.log('Updating', update);
            }

            // Broadcast change
            this.dispatchEvent(EVE[update]);
        }
    };

    for (i = 0; i < buttons.length; i += 1) {
        buttons[i].addEventListener('change', module.button.press);
    }

    return module;
}(EVE));

// TODO pitch needs a fine tune added (+) after n
EVE = (function (module) {
    'use strict';

    EVE.calculatePitch = function (note) {
        var n = note.target ? note.target.dataset.noteValue : note,
            pitch = module.keyboard.octaveShift * 1200 + parseFloat(n);

        return module.setPitch(pitch);
    };

    module.calculatePitch.debug = true;

    // module.keyboard.addEventListener('mousedown', module.calculatePitch);
    // module.keyboard.addEventListener('touchstart', module.calculatePitch);

    return module;
}(EVE));

// TODO Consider moving shiftOctave to performance controls
EVE = (function (module) {
    'use strict';
    var buttons = document.getElementsByClassName('shift-octave'),
        i;

    module.keyboard = {
        current: null,
        debug: true,
        keyDown: false,
        lights: document.querySelectorAll('#performance [data-light]'),
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

            if (module.keyboard.debug && console) {
                console.log(module.keyboard.octaveShift);
            }
        },

        pressBus: function (e) {
            if (module.keyboard.debug && console) {
                console.log(e.which);
            }
            switch (e.which) {
            case 45:// -
            case 95:// _
                module.keyboard.shiftOctave(-1);
                break;
            case 61:// =
            case 43:// +
                module.keyboard.shiftOctave(1);
                break;
            }
        },

        downBus: function (e) {
            var pitch = null;

            if (module.keyboard.debug && console) {
                console.log('DOWN BUS', e.which);
            }

            switch (e.which) {
            case 65:
                pitch = -2100;
                break;
            case 87:
                pitch = -2000;
                break;
            case 83:
                pitch = -1900;
                break;
            case 69:
                pitch = -1800;
                break;
            case 68:
                pitch = -1700;
                break;
            case 70:
                pitch = -1600;
                break;
            case 84:
                pitch = -1500;
                break;
            case 71:
                pitch = -1400;
                break;
            case 89:
                pitch = -1300;
                break;
            case 72:
                pitch = -1200;
                break;
            case 85:
                pitch = -1100;
                break;
            case 74:
                pitch = -1000;
                break;
            case 75:
                pitch = -900;
                break;
            case 79:
                pitch = -800;
                break;
            case 76:
                pitch = -700;
                break;
            case 80:
                pitch = -600;
                break;
            case 186:
                pitch = -500;
                break;
            case 222:
                pitch = -400;
                break;
            case 221:
                pitch = -300;
                break;
            case 192:
                console.log(module.preset);
                break;
            }

            if (pitch !== null && module.keyboard.current !== e.which) {
                if (module.keyboard.keyDown === false) {
                    module.keyboard.current = e.which;
                    module.gate();
                }
                module.calculatePitch(pitch);
            }
        },

        upBus: function (e) {
            if (e.which === module.keyboard.current) {
                module.keyboard.current = null;
                module.gate();
            }
        },

        touch: function (e) {
            if (module.keyboard.debug && console) {
                console.log('Keyboard touched', e);
            }
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

EVE = (function (module) {
    'use strict';
    module.now = function () {
        return module.currentTime;
    };

    return module;
}(EVE));

EVE = (function (module) {
    'use strict';
    var gateOn = false;

    module.gate = function () {
        var x = gateOn ? 0 : 1;

        // TODO Broadcast an 'attack' or 'release' event...

        gateOn = !gateOn;

        return x;
    };

    return module;
}(EVE));
