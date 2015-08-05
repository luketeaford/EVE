window.AudioContext = window.AudioContext || window.webkitAudioContext;

var EVE = {
    config: {
        eg_max: 2.125,
        eg_min: 0.05,
        masterFreq: 440
    },
    synth: new AudioContext()
};

(function collapseModules() {
    'use strict';
    var i,
        moduleTitles = document.querySelectorAll('section > a');

    function collapseMenu() {
        if (this.parentElement.dataset.state === 'open') {
            this.parentElement.dataset.state = 'closed';
        } else {
            this.parentElement.dataset.state = 'open';
        }
    }

    for (i = 0; i < moduleTitles.length; i += 1) {
        moduleTitles[i].addEventListener('click', collapseMenu);
    }
}());

EVE.keyboard = {
    current: null,
    debug: true,
    keyDown: false,
    octaveShift: 0,
    scope: document.getElementById('keyboard'),
    shiftOctave: function (direction) {
        'use strict';
        var oct = EVE.keyboard.octaveShift,
            shift = this.dataset ? this.dataset.shift : direction;

        function switchLights() {
            var i,
                lights = document.querySelectorAll('#performance > span'),
                n = EVE.keyboard.octaveShift + 2;

            for (i = 0; i < lights.length; i += 1) {
                lights[i].dataset.light = i === n ? 'on' : 'off';
            }
        }

        if ((oct > -2 && shift < 0) || (oct < 2 && shift > 0)) {
            EVE.keyboard.octaveShift = oct + parseFloat(shift);
            switchLights();
        }

        if (EVE.keyboard.debug && console) {
            console.log(EVE.keyboard.octaveShift);
        }

    },
    pressBus: function (e) {
        'use strict';
        //TODO bullshit third condition to keep console clear while working
        if (EVE.keyboard.debug && console && EVE.keyboard.octaveShift === 23) {
            console.log(e.which);
        }
        switch (e.which) {
        case 45:// -
        case 95:// _
            EVE.keyboard.shiftOctave(-1);
            break;
        case 61:// =
        case 43:// +
            EVE.keyboard.shiftOctave(1);
            break;
        }
    },
    downBus: function (e) {
        'use strict';
        var pitch = null;

        if (EVE.keyboard.debug && console) {
            console.log('DOWN BUS', e.which);
        }

        switch (e.which) {
        case 65: // a
            pitch = -2100;
            break;
        case 83: // s
            pitch = -2000;
            break;
        case 68:// d
            pitch = -1900;
            break;
        case 70:// f
            pitch = -1800;
            break;
        case 71:// g
            pitch = -1700;
            break;
        case 72:// h
            pitch = -1600;
            break;
        case 74:// j
            pitch = -1500;
            break;
        case 75:// k
            pitch = -1400;
            break;
        case 76:// l
            pitch = -1300;
            break;
        case 186:// ;
            pitch = -1200;
            break;
        case 222:// '
            pitch = -1100;
            break;
        case 81:// q
            pitch = -1000;
            break;
        case 87:
            pitch = -900;
            break;
        case 69:
            pitch = -800;
            break;
        case 82:
            pitch = -700;
            break;
        case 84:
            pitch = -600;
            break;
        case 89:
            pitch = -500;
            break;
        case 85:
            pitch = -400;
            break;
        case 73:
            pitch = -300;
            break;
        case 79:
            pitch = -200;
            break;
        case 80:
            pitch = -100;
            break;
        case 219:
            pitch = 0;
            break;
        case 221:
            pitch = 100;
            break;
        }

        if (pitch !== null && EVE.keyboard.current !== e.which) {
            if (EVE.keyboard.keyDown === false) {
                EVE.keyboard.current = e.which;
                EVE.gateOn();
            }
            EVE.calculatePitch(pitch);
        }

    },
    upBus: function (e) {
        'use strict';
        if (e.which === EVE.keyboard.current) {
            EVE.keyboard.current = null;
            EVE.gateOff();
        }
    },
    touch: function (e) {
        'use strict';
        if (console) {
            console.log('Keyboard touched', e);
        }
    }
};

(function bindEvents() {
    'use strict';
    var buttons = document.getElementsByClassName('octave-shift'),
        i;
    for (i = 0; i < buttons.length; i += 1) {
        buttons[i].addEventListener('click', EVE.keyboard.shiftOctave);
    }
    document.addEventListener('keypress', EVE.keyboard.pressBus);
    document.addEventListener('keydown', EVE.keyboard.downBus);
    document.addEventListener('keyup', EVE.keyboard.upBus);
}());

EVE.program = {
    name: 'INIT',

    // Harmonics (VCAs)
    osc1: 1,
    osc2: 0,
    osc3: 0,
    osc4: 0,
    osc5: 0,
    osc6: 0,
    osc7: 0,
    osc8: 0,

    // Harmonic Envelope (Amounts)
    osc1_eg: 0,
    osc2_eg: 0,
    osc3_eg: 0,
    osc4_eg: 0,
    osc5_eg: 0,
    osc6_eg: 0,
    osc7_eg: 0,
    osc8_eg: 0,

    // Timbre Envelope
    timbre_a: 0,
    timbre_d: 0.125,
    timbre_s: 0,
    timbre_r: 0.125,

    // LFO 1
    lfo1_rate: 4,
    lfo1_range: 20,
    lfo1_type: 'square',
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
    lfo2_type: 'sawtooth',
    lfo2_amp: 0,
    lfo2_pitch: 0,
    lfo2_d: 0,
    lfo2_a: 0,
    lfo2_r: 0,
    lfo2_g: 0,

    // VCA
    vca_a: 0,
    vca_d: 0.1,
    vca_s: 1,
    vca_r: 0.1,
    vca_g: 0,

    // Performance
    portamento: 0//tolerable maximum = 0.165
};

EVE.now = function () {
    'use strict';
    return EVE.synth.currentTime;
};

EVE.attack = function (x) {
    'use strict';
    return EVE.now() + x;
};

EVE.oscilloscope = EVE.synth.createAnalyser();

(function buildScope() {
    'use strict';
    var fft = 2048,
        oscope = document.getElementById('scope'),
        ctx = oscope.getContext('2d'),
        lineColor = 'rgb(53, 56, 55)',
        scopeData = new Uint8Array(fft);

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
        EVE.oscilloscope.getByteTimeDomainData(scopeData);
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

}());

EVE.vca = EVE.synth.createGain();
EVE.vca.gain.value = EVE.program.vca_g;
EVE.vca.connect(EVE.synth.destination);

// TODO Listen for the oscilloscope and connect to it when available
EVE.vca.connect(EVE.oscilloscope);

EVE.vca.debug = true;

EVE.vca.scope = document.getElementById('vca');

EVE.vca.update = function (e) {
    'use strict';
    var p;

    if (e.target && e.target.dataset && e.target.dataset.program) {
        p = e.target.dataset.program;
    }

    if (EVE.vca.debug && console) {
        console.log(p, EVE.program[p]);
    }

    if (p === 'vca_g') {
        EVE.vca.gain.setValueAtTime(EVE.program.vca_g, EVE.now());
    }

};

EVE.vca.scope.addEventListener('update_vca', EVE.vca.update);

EVE.update_vca = new CustomEvent('update_vca', {bubbles: true});

EVE.harmonicOsc = {
    debug: true,
    scope: document.getElementById('harmonics'),
    update: function (e) {
        'use strict';
        var p;

        if (e.target && e.target.dataset && e.target.dataset.program) {
            p = e.target.dataset.program;
        }

        if (EVE.harmonicOsc.debug && console) {
            console.log(p, EVE.program[p]);
        }

        EVE.harmonicOsc[p].vca.gain.setValueAtTime(EVE.program[p], EVE.now());
    }
};

(function buildHarmonicOsc() {
    'use strict';
    var i,
        osc;

    // Mixer
    EVE.harmonicOsc.mixer = EVE.synth.createGain();
    EVE.harmonicOsc.mixer.gain.value = -1;

    for (i = 1; i <= 8; i += 1) {
        osc = 'osc' + i;
        // Oscillators
        EVE.harmonicOsc[osc] = EVE.synth.createOscillator();
        EVE.harmonicOsc[osc].frequency.value = EVE.config.masterFreq * i;
        EVE.harmonicOsc[osc].type = 'sine';

        // VCAs
        EVE.harmonicOsc[osc].vca = EVE.synth.createGain();
        EVE.harmonicOsc[osc].vca.gain.value = EVE.program[osc];

        // Connect each oscillator to its VCA
        EVE.harmonicOsc[osc].connect(EVE.harmonicOsc[osc].vca);

        // Connect each VCA to the mixer
        EVE.harmonicOsc[osc].vca.connect(EVE.harmonicOsc.mixer);

        // Connect the mixer to the master VCA
        EVE.harmonicOsc.mixer.connect(EVE.vca);
    }
}());


EVE.harmonicOsc.scope.addEventListener('update_harmonic_osc', EVE.harmonicOsc.update);

EVE.update_harmonic_osc = new CustomEvent('update_harmonic_osc', {bubbles: true});

EVE.timbreEg = {
    debug: true,
    scope: document.getElementById('timbre-eg'),
    update: function (e) {
        'use strict';
        var p;

        if (e.target && e.target.dataset && e.target.dataset.program) {
            p = e.target.dataset.program;
        }

        if (EVE.timbreEg.debug && console) {
            console.log(p, EVE.program[p]);
        }

    }
};

EVE.timbreEg.scope.addEventListener('update_timbre_eg', EVE.timbreEg.update);

EVE.update_timbre_eg = new CustomEvent('update_timbre_eg', {bubbles: true});

EVE.timbreEnv = {
    debug: true,
    scope: document.getElementById('timbre-env'),
    update: function (e) {
        'use strict';
        var p;

        if (e.target && e.target.dataset && e.target.dataset.program) {
            p = e.target.dataset.program;
        }

        if (EVE.timbreEnv.debug && console) {
            console.log(p, EVE.program[p]);
        }
    }
};

EVE.timbreEnv.scope.addEventListener('update_timbre_env', EVE.timbreEnv.update);

EVE.update_timbre_env = new CustomEvent('update_timbre_env', {bubbles: true});

(function buildLfo1() {
    'use strict';
    var i,
        lfo,
        osc;

    // The LFO itself
    EVE.lfo1 = EVE.synth.createOscillator();
    EVE.lfo1.frequency.value = EVE.program.lfo1_rate;
    EVE.lfo1.type = EVE.program.lfo1_type;

    // LFO 1 VCAs
    for (i = 1; i <= 8; i += 1) {
        osc = 'osc' + i;
        lfo = osc + '_lfo';
        EVE[lfo] = EVE.synth.createGain();
        EVE[lfo].gain.value = EVE.program[lfo];
        // Connect LFO 1 to each LFO VCA
        EVE.lfo1.connect(EVE[lfo]);
        // Connect to harmonic oscillator VCAs
        EVE[lfo].connect(EVE.harmonicOsc[osc].vca.gain);
    }

}());

EVE.lfo1.debug = true;

EVE.lfo1.scope = document.getElementById('lfo1');

EVE.lfo1.update = function (e) {
    'use strict';
    var p;

    if (e.target && e.target.dataset && e.target.dataset.program) {
        p = e.target.dataset.program;
    }

    if (EVE.lfo1.debug && console) {
        console.log(p, EVE.program[p]);
    }

    switch (p) {
    case 'lfo1_type':
        EVE.lfo1.type = EVE.program.lfo1_type;
        break;
    case 'lfo1_range':
    case 'lfo1_rate':
        EVE.lfo1.frequency.setValueAtTime(EVE.program.lfo1_rate * EVE.program.lfo1_range, EVE.now());
        break;
    case 'osc1_lfo':
    case 'osc2_lfo':
    case 'osc3_lfo':
    case 'osc4_lfo':
    case 'osc5_lfo':
    case 'osc6_lfo':
    case 'osc7_lfo':
    case 'osc8_lfo':
        EVE[p].gain.setValueAtTime(EVE.program[p], EVE.now());
        break;
    default:
        if (EVE.lfo1.debug && console) {
            console.log('Unhandled LFO 1 update change');
        }
    }

};

EVE.lfo1.scope.addEventListener('update_lfo1', EVE.lfo1.update);

EVE.update_lfo1 = new CustomEvent('update_lfo1', {bubbles: true});

(function buildLfo2() {
    'use strict';
    var i;

    EVE.lfo2 = EVE.synth.createOscillator();
    EVE.lfo2.frequency.value = EVE.program.lfo2_rate;
    EVE.lfo2.type = EVE.program.lfo2_type;

    // VCAs
    EVE.lfo2_amp = EVE.synth.createGain();
    EVE.lfo2_amp.gain.value = EVE.program.lfo2_amp;
    EVE.lfo2_pitch = EVE.synth.createGain();
    EVE.lfo2_pitch.gain.value = EVE.program.lfo2_pitch;
    EVE.lfo2_vca = EVE.synth.createGain();
    EVE.lfo2_vca.gain.value = 0;

    // Connect LFO to its VCA
    EVE.lfo2.connect(EVE.lfo2_vca);

    // Connect LFO VCA to its pitch and amp VCAs
    EVE.lfo2_vca.connect(EVE.lfo2_amp);
    EVE.lfo2_vca.connect(EVE.lfo2_pitch);

    // VCA to amp
    EVE.lfo2_amp.connect(EVE.harmonicOsc.mixer.gain);

    // VCA to pitch
    for (i = 1; i <= 8; i += 1) {
        EVE.lfo2_pitch.connect(EVE.harmonicOsc['osc' + i].frequency);
    }

    // TODO Figure out what I was thinking when I typed the following:
    // LFO 2 modulates LFO 1?!
    // Probably in the wrong place because this connection can be toggled
    if (EVE.program.lfo1_track) {
        EVE.lfo2_pitch.connect(EVE.lfo1.frequency);
    }
}());

EVE.lfo2.debug = true;
EVE.lfo2.max = 40;
EVE.lfo2.scope = document.getElementById('lfo2');

EVE.lfo2.update = function (e) {
    'use strict';
    var p;

    if (e.target && e.target.dataset && e.target.dataset.program) {
        p = e.target.dataset.program;
    }

    if (EVE.lfo2.debug && console) {
        console.log(p, EVE.program[p]);
    }

    switch (p) {
    case 'lfo2_amp':
        EVE.lfo2_amp.gain.setValueAtTime(EVE.program.lfo2_amp, EVE.now());
        break;
    case 'lfo2_g':
        EVE.lfo2_vca.gain.setValueAtTime(EVE.program.lfo2_g, EVE.now());
        break;
    case 'lfo2_pitch':
        EVE.lfo2_pitch.gain.setValueAtTime(EVE.program.lfo2_pitch * 16, EVE.now());
        break;
    case 'lfo2_rate':
        EVE.lfo2.frequency.setValueAtTime(EVE.program.lfo2_rate * EVE.lfo2.max, EVE.now());
        break;
    case 'lfo2_type':
        EVE.lfo2.type = EVE.program.lfo2_type;
        break;
    default:
        if (EVE.lfo2.debug && console) {
            console.log('Unhandled LFO 2 update change');
        }
    }

};

EVE.lfo2.scope.addEventListener('update_lfo2', EVE.lfo2.update);

EVE.update_lfo2 = new CustomEvent('update_lfo2', {bubbles: true});

(function initialize() {
    'use strict';

    function startSynth() {
        var i;

        // Harmonic Oscillator
        for (i = 1; i <= 8; i += 1) {
            EVE.harmonicOsc['osc' + i].start(0);
        }

        // LFO 1
        EVE.lfo1.start(0);

        // LFO 2
        EVE.lfo2.start(0);

        document.removeEventListener('click', startSynth);
        document.removeEventListener('dblclick', startSynth);
        document.removeEventListener('keydown', startSynth);
        document.removeEventListener('touchstart', startSynth);
        document.removeEventListener('wheel', startSynth);
    }

    document.addEventListener('click', startSynth);
    document.addEventListener('dblclick', startSynth);
    document.addEventListener('keydown', startSynth);
    document.addEventListener('touchstart', startSynth);
    document.addEventListener('wheel', startSynth);
}());

EVE.slider = {
    debug: true,
    grab: function (e) {
        'use strict';
        var prog = this.dataset.program,
            update = 'update_' + this.parentElement.parentElement.parentElement.dataset.update,
            x = this.dataset.curve === 'lin' ? 1 : this.value;

        // Update program
        EVE.program[prog] = this.value * x;

        if (EVE.slider.debug && console) {
            console.dir(e.target);
            console.log('Updating', update);
        }

        // Broadcast change
        this.dispatchEvent(EVE[update]);
    }
};

(function bindSliders() {
    'use strict';
    var inputs = document.querySelectorAll('input[type=range]'),
        i;

    for (i = 0; i < inputs.length; i += 1) {
        inputs[i].addEventListener('input', EVE.slider.grab);
    }

}());

// SVG knobs
EVE.knob = {
    currentKnob: null,
    debug: true,
    test: function () {
        'use strict';
        console.log('AMAZING INPUT -- input event');
    },
    grab: function (e) {
        'use strict';
        EVE.knob.grab.origin = {
            x: e.pageX,//formerly screenX
            y: e.pageY//formerly screenY
        };
        EVE.knob.currentKnob = this;
        document.addEventListener('mousemove', EVE.knob.twist);
        document.addEventListener('touchmove', EVE.knob.twist);
    },
    rotate: function () {
        'use strict';
        var x = null;
        EVE.knob.currentKnob.style.webkitTransform = x;
        EVE.knob.currentKnob.style.transform = x;
    },
    twist: function (e) {
        'use strict';
        var deg = e.pageY - EVE.knob.grab.origin.y,
            rotate = 'rotate(' + deg + 'deg)',
            x = document.getElementById('test');

        if (EVE.knob.debug && console) {
            console.log('Difference y', deg);
            console.dir(x);
            x.stepUp(e.pageY - EVE.knob.grab.origin.y);
            x.addEventListener('change', function () {
                console.log('THE INPUT HAS CHANGED');
            });
        }

        // Prevent scrolling the body while moving a knob
        e.preventDefault();

        EVE.knob.currentKnob.style.mozTransform = rotate;
        EVE.knob.currentKnob.style.webkitTransform = rotate;
        EVE.knob.currentKnob.style.transform = rotate;

        document.addEventListener('mouseup', EVE.knob.release);
        document.addEventListener('touchend', EVE.knob.release);
    },
    release: function () {
        'use strict';
        console.log('Knob released');
        document.removeEventListener('mousemove', EVE.knob.twist);
        document.removeEventListener('mouseup', EVE.knob.release);
        document.removeEventListener('touchmove', EVE.knob.twist);
        document.removeEventListener('touchend', EVE.knob.release);
    }
};

EVE.button = {
    debug: true,
    press: function () {
        'use strict';
        var prog = this.name,
            update = 'update_' + this.parentElement.parentElement.parentElement.dataset.update;

        // Update program
        if (EVE.program[prog] !== this.value) {
            // Prevents numbers being stored as strings
            if (typeof this.value === 'string' && !isNaN(this.value - 1)) {
                EVE.program[prog] = parseFloat(this.value);
            } else {
                EVE.program[prog] = this.value;
            }
        }

        if (EVE.button.debug && console) {
            console.log('Updating', update);
        }

        // Broadcast change
        this.dispatchEvent(EVE[update]);
    }
};

(function bindRadioButtons() {
    'use strict';
    var buttons = document.querySelectorAll('input[type=radio]'),
        i;

    for (i = 0; i < buttons.length; i += 1) {
        buttons[i].addEventListener('change', EVE.button.press);
    }

}());

EVE.calculatePitch = function (note) {
    'use strict';
    // TODO pitch needs EVE.fine added (+) after n at some point...
    var n = note.target ? note.target.dataset.noteValue : note,
        pitch = EVE.keyboard.octaveShift * 1200 + parseFloat(n);

    return EVE.setPitch(pitch);
};

EVE.calculatePitch.debug = true;

EVE.keyboard.scope.addEventListener('mousedown', EVE.calculatePitch);
EVE.keyboard.scope.addEventListener('touchstart', EVE.calculatePitch);

EVE.setPitch = function (pitch) {
    'use strict';
    var i;

    for (i = 1; i <= 8; i += 1) {
        EVE.harmonicOsc['osc' + i].detune.setTargetAtTime(pitch, EVE.now(), EVE.program.portamento);
    }

    if (EVE.program.lfo1_range >= 440) {
        EVE.lfo1.detune.setValueAtTime(pitch, EVE.now(), EVE.program.portamento);
    }

};

EVE.setPitch.debug = true;

EVE.gateOn = function gateOn() {
    'use strict';
    var env,
        i,
        osc,
        peak = EVE.now() + EVE.program.vca_a * EVE.config.eg_max + EVE.config.eg_min,
        timbrePeak = EVE.now() + EVE.program.timbre_a * EVE.config.eg_max + EVE.config.eg_min,
        vca;

    EVE.keyboard.keyDown = true;

    // LFO 2 envelope
    // LFO 2 starting point
    EVE.lfo2_vca.gain.setTargetAtTime(EVE.program.lfo2_g, EVE.now(), 0.1);

    // LFO 2 attack (with delay)
    EVE.lfo2_vca.gain.setTargetAtTime(1, EVE.now() + EVE.program.lfo2_d * EVE.config.eg_max, EVE.program.lfo2_a * EVE.config.eg_max + EVE.config.eg_min);


    // Timbre envelope
    for (i = 1; i <= 8; i += 1) {

        env = EVE.program['osc' + i + '_eg'];
        osc = EVE.program['osc' + i];
        vca = EVE.harmonicOsc['osc' + i].vca;

        // Timbre starting point
        vca.gain.setTargetAtTime(osc, EVE.now(), 0.1);

        // Timbre attack
        vca.gain.linearRampToValueAtTime(osc + env, timbrePeak);

        // Timbre decay
        vca.gain.setTargetAtTime(osc + (env * EVE.program.timbre_s), timbrePeak, EVE.program.timbre_d * EVE.config.eg_max);
    }

    // VCA starting point
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_g, EVE.now(), 0.1);

    // VCA attack
    EVE.vca.gain.linearRampToValueAtTime(1, peak);

    // VCA decay
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_s + EVE.program.vca_g, peak, EVE.program.vca_d * EVE.config.eg_max);

    return;
};

EVE.keyboard.scope.addEventListener('mousedown', EVE.gateOn);
EVE.keyboard.scope.addEventListener('touchstart', EVE.gateOn);

EVE.gateOff = function gateOff() {
    'use strict';

    var i,
        lfo2Peak = EVE.lfo2_vca.gain.value,
        vcaPeak = EVE.vca.gain.value,
        timbrePeak,
        vca;

    EVE.keyboard.keyDown = false;

    // LFO 2 envelope
    // Prevent decay from acting like second attack
    EVE.lfo2_vca.gain.cancelScheduledValues(EVE.synth.currentTime);

    // LFO 2 starting point
    EVE.lfo2_vca.gain.setValueAtTime(lfo2Peak, EVE.synth.currentTime);

    // LFO 2 release
    EVE.lfo2_vca.gain.setTargetAtTime(EVE.program.lfo2_g, EVE.synth.currentTime, EVE.program.lfo2_r);

    // Timbre envelope
    for (i = 1; i <= 8; i += 1) {

        vca = EVE.harmonicOsc['osc' + i].vca;

        // Prevent decay from acting like second attack
        vca.gain.cancelScheduledValues(EVE.now());

        // Timbre starting point
        timbrePeak = vca.gain.value;
        vca.gain.setValueAtTime(timbrePeak, EVE.now());

        // Timbre release
        vca.gain.setTargetAtTime(EVE.program['osc' + i], EVE.now(), EVE.program.timbre_r);
    }

    // Prevent decay from acting like second attack
    EVE.vca.gain.cancelScheduledValues(EVE.synth.currentTime);

    // VCA starting point
    EVE.vca.gain.setValueAtTime(vcaPeak, EVE.synth.currentTime);

    // VCA release
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_g, EVE.synth.currentTime, EVE.program.vca_r * EVE.config.eg_max);

    return;
};

EVE.keyboard.scope.addEventListener('mouseup', EVE.gateOff);
EVE.keyboard.scope.addEventListener('touchend', EVE.gateOff);

if (navigator.requestMIDIAccess) {

    EVE.midi = {
        debug: false,
        messages: {
            listen: 254,
            note_on: 144,
            note_off: 128,
            pitch: 224
        },

        devices: [],

        getDevices: function () {
            'use strict';

            return navigator.requestMIDIAccess().then(function (midi) {
                var devices = [],
                    input,
                    inputs = midi.inputs.entries();

                for (input = inputs.next(); input && !input.done; input = inputs.next()) {
                    devices.push(input.value[1]);
                }

                if (EVE.midi.debug === true && console) {
                    console.log('Devices:', devices);
                }

                return devices;
            });
        }
    };

    EVE.midi.events = function (event) {
        'use strict';
        //var n = event.data[1];

        switch (event.data[0]) {
        case EVE.midi.messages.listen:
            break;
        case EVE.midi.messages.note_on:
            // Some MIDI controllers send 0 velocity intead of note_off
            if (event.data[2] >= 1) {
                EVE.gateOn(event, EVE.midi.toCents(event.data[1]));
            } else {
                // Cheap MIDI controller note_off
                EVE.gateOff(event);
            }
            break;
        case EVE.midi.messages.note_off:
            EVE.gateOff(event);
            break;
        case EVE.midi.messages.pitch:
            console.log('EVE pitch wheel moved');
            break;
        default:
            console.log('Unrecognized MIDI event', event.data);
            break;
        }
    };

    EVE.midi.getDevices().then(function (devices) {
        'use strict';
        var i = 0;

        EVE.midi.devices = devices;

        for (i; i < devices.length; i += 1) {
            EVE.midi.devices[i].onmidimessage = EVE.midi.events;
        }
    });

    EVE.midi.toCents = function (midiNote) {
        'use strict';
        return 100 * (midiNote - 69);
    };

} else {
    if (EVE.midi.debug === true && console) {
        console.log('No Web MIDI support in your browser');
    }
}
