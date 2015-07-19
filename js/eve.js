window.AudioContext = window.AudioContext || window.webkitAudioContext;

var EVE = {
    config: {
        eg_minimum: 0.05,
        harmonics: 8,
        lfo_max: 110,
        masterFreq: 440
    },
    synth: new AudioContext()
};

(function collapseModules() {
    'use strict';
    var moduleTitles = document.querySelectorAll('section > a'),
        i;

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
    debug: true,
    octaveShift: 0,
    scope: document.getElementById('keyboard'),
    shiftOctave: function (direction) {
        'use strict';
        var oct = EVE.keyboard.octaveShift,
            shift = this.dataset ? this.dataset.shift : direction;

        if ((oct > -2 && shift < 0) || (oct < 2 && shift > 0)) {
            EVE.keyboard.octaveShift = oct + parseFloat(shift);
        }

        if (EVE.keyboard.debug && console) {
            console.log(EVE.keyboard.octaveShift);
        }

    },
    bus: function (e) {
        'use strict';
        if (EVE.keyboard.debug && console) {
            console.log(e.which);
        }
        switch (e.which) {
        case 45:// -
        case 95:// _
            EVE.keyboard.shiftOctave(-1);
            console.log('keyboard down');
            break;
        case 61:// =
        case 43:// +
            EVE.keyboard.shiftOctave(1);
            console.log('keyboard up');
            break;
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
    document.addEventListener('keypress', EVE.keyboard.bus);
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
    timbre_d: 0.3,
    timbre_s: 0,
    timbre_r: 0.3,

    // LFO 1
    lfo1_rate: 4,
    lfo1_track: false,
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
    lfo2_track: false,// TODO currently unused
    lfo2_type: 'sawtooth',
    lfo2_amp: 0,
    lfo2_pitch: 0,

    // VCA
    vca_a: 0,
    vca_d: 0.25,
    vca_s: 1,
    vca_r: 0.25,
    vca_g: 0
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

    for (i = 1; i <= EVE.config.harmonics; i += 1) {
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
    for (i = 1; i <= EVE.config.harmonics; i += 1) {
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
    case 'lfo1_rate':
        EVE.lfo1.frequency.setValueAtTime(EVE.program.lfo1_rate * EVE.harmonicOsc.osc1.frequency.value, EVE.now());
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

    // Connect LFOs to VCAs
    EVE.lfo2.connect(EVE.lfo2_amp);
    EVE.lfo2.connect(EVE.lfo2_pitch);

    // VCA to amp
    EVE.lfo2_amp.connect(EVE.harmonicOsc.mixer.gain);

    // VCA to pitch
    for (i = 1; i < EVE.config.harmonics; i += 1) {
        EVE.lfo2_pitch.connect(EVE.harmonicOsc['osc' + i].frequency);
    }

    // LFO 2 modulates LFO 1?!
    // Probably in the wrong place because this connection can be toggled
    if (EVE.program.lfo1_track) {
        EVE.lfo2_pitch.connect(EVE.lfo1.frequency);
    }
}());

EVE.lfo2.debug = true;

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
    case 'lfo2_pitch':
        EVE.lfo2_pitch.gain.setValueAtTime(EVE.program.lfo2_pitch * EVE.config.masterFreq, EVE.now());
        break;
    case 'lfo2_rate':
        EVE.lfo2.frequency.setValueAtTime(EVE.program.lfo2_rate * EVE.config.lfo_max, EVE.now());
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
        for (i = 1; i <= EVE.config.harmonics; i += 1) {
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
    grab: function () {
        'use strict';
        var prog = this.dataset.program,
            update = 'update_' + this.parentElement.parentElement.parentElement.dataset.update,
            x = this.dataset.curve === 'lin' ? 1 : this.value;

        // Update program
        EVE.program[prog] = this.value * x;

        if (EVE.slider.debug && console) {
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
            rotate = 'rotate(' + deg + 'deg)';

        if (EVE.knob.debug && console) {
            console.log('Difference y', deg);
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

(function bindKnobs() {
    'use strict';
    var knobs = document.getElementsByClassName('knob'),
        i;
    for (i = 0; i < knobs.length; i += 1) {
        knobs[i].addEventListener('mousedown', EVE.knob.grab);
        knobs[i].addEventListener('touchstart', EVE.knob.grab);
    }
}());

EVE.button = {
    debug: true,
    press: function () {
        'use strict';
        var prog = this.name,
            update = 'update_' + this.parentElement.parentElement.dataset.update;

        // Update program
        if (EVE.program[prog] !== this.value) {
            EVE.program[prog] = this.value;
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
    // TODO Needs EVE.fine added (+) after note at some point...
    var pitch = EVE.keyboard.octaveShift * 1200 + parseFloat(note);

    if (EVE.calculatePitch.debug === true && console) {
        console.log('Pitch: ', pitch);
    }

    return EVE.setPitch(pitch);
};

EVE.calculatePitch.debug = true;

// TODO Include legato options
EVE.setPitch = function (pitch) {
    'use strict';
    var i;

    // Staccato
    for (i = 1; i <= 8; i += 1) {
        EVE.harmonicOsc['osc' + i].detune.setValueAtTime(pitch, EVE.now());
    }

    if (EVE.program.lfo1_track) {
        EVE.lfo1.detune.setValueAtTime(pitch, EVE.now());
    }

};

EVE.setPitch.debug = true;

EVE.gateOn = function gateOn(e) {
    'use strict';
    var env,
        i,
        osc,
        peak = EVE.now() + EVE.program.vca_a + EVE.config.eg_minimum,
        timbrePeak = EVE.now() + EVE.program.timbre_a + EVE.config.eg_minimum,
        vca;

    // Timbre Envelope
    for (i = 1; i <= 8; i += 1) {

        //vca, osc, env
        env = EVE.program['osc' + i + '_eg'];
        osc = EVE.program['osc' + i];
        vca = EVE.harmonicOsc['osc' + i].vca;

        // Timbre starting point
        vca.gain.setTargetAtTime(osc, EVE.now(), 0.1);

        // Timbre attack
        vca.gain.linearRampToValueAtTime(osc + env, timbrePeak);

        // Timbre decay
        vca.gain.setTargetAtTime(osc + (env * EVE.program.timbre_s), timbrePeak, EVE.program.timbre_d);
    }

    // Set starting point
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_g, EVE.now(), 0.1);

    // Attack
    EVE.vca.gain.linearRampToValueAtTime(1, peak);

    // Decay
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_s + EVE.program.vca_g, peak, EVE.program.vca_d);

    return EVE.calculatePitch(e.target.dataset.noteValue);

};

EVE.keyboard.scope.addEventListener('mousedown', EVE.gateOn);
EVE.keyboard.scope.addEventListener('touchstart', EVE.gateOn);

EVE.gateOff = function gateOff() {
    'use strict';

    var releasePeak = EVE.vca.gain.value,
        timbrePeak,
        vca,
        i;

    // Harmonic Envelopes
    for (i = 1; i <= 8; i += 1) {

        vca = EVE.harmonicOsc['osc' + i].vca;

        // Prevent decay from acting like second attack
        vca.gain.cancelScheduledValues(EVE.now());

        // Set starting point
        timbrePeak = vca.gain.value;
        vca.gain.setValueAtTime(timbrePeak, EVE.now());

        // Release back to starting point
        vca.gain.setTargetAtTime(EVE.program['osc' + i], EVE.now(), EVE.program.timbre_r);
    }

    // Prevent decay from acting like second attack
    EVE.vca.gain.cancelScheduledValues(EVE.synth.currentTime);

    // Set starting point
    EVE.vca.gain.setValueAtTime(releasePeak, EVE.synth.currentTime);

    EVE.vca.gain.setTargetAtTime(EVE.program.vca_g, EVE.synth.currentTime, EVE.program.vca_r);

    return;
};

EVE.keyboard.scope.addEventListener('mouseup', EVE.gateOff);
EVE.keyboard.scope.addEventListener('touchend', EVE.gateOff);
