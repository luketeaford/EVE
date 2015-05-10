window.AudioContext = window.AudioContext || window.webkitAudioContext;

var EVE = {

    synth: new AudioContext(),

    config: {
        harmonics: 8,
        master_freq: 440,
        octave_shift: 0
    },

    program: {
        name: 'INITIALIZE',

        // Harmonic Oscillator
        osc1: 0,
        osc2: 0,
        osc3: 0,
        osc4: 0,
        osc5: 0,
        osc6: 0,
        osc7: 0,
        osc8: 0,

        // Harmonic Envelope (Amounts)
        env1: 0,
        env2: 0,
        env3: 0,
        env4: 0,
        env5: 0,
        env6: 0,
        env7: 0,
        env8: 0,

        // Harmonic Envelope
        timbre_a: 0,
        timbre_d: 0,
        timbre_s: 0,
        timbre_r: 0,

        // VCA Envelope
        vca_a: 0,
        vca_d: 0,
        vca_s: 0,
        vca_r: 0,
        vca_g: 0,

        // LFO Amounts
        lfo1: 0,
        lfo2: 0,
        lfo3: 0,
        lfo4: 0,
        lfo5: 0,
        lfo6: 0,
        lfo7: 0,
        lfo8: 0,

        // LFO
        lfo_rate: 4,
        lfo_type: 'square'
    },

    keyboard: document.getElementById('keyboard'),

    now: function now() {
        'use strict';
        return EVE.synth.currentTime;
    }

};

function navTemplate() {
    'use strict';
    return false;
}

EVE.events = {
    update: new CustomEvent('update', {
        bubbles: true
    }),
    navigate: new CustomEvent('navigate', {
        // Only here to demonstrate how to include arbitrary data
        detail: {
            place: window.location
        },
        bubbles: true
    })
};

EVE.buildSynth = function buildSynth() {
    'use strict';
    EVE.harmonicOscs = [];
    EVE.harmonicVcas = [];

    function buildHarmonicOsc(x) {
        var i,
            j,
            osc,
            vca;

        for (i = 0; i < x; i += 1) {
            j = i + 1;
            osc = 'osc' + j;
            vca = osc + '_vca';

            EVE[vca] = EVE.synth.createGain();
            EVE[vca].gain.setValueAtTime(EVE.program[osc], EVE.now());
            EVE[vca].connect(EVE.vca);

            EVE[osc] = EVE.synth.createOscillator();
            EVE[osc].type = 'sine';
            EVE[osc].frequency.value = EVE.config.master_freq * j;
            EVE[osc].connect(EVE[vca]);

            EVE.harmonicOscs.push(EVE[osc]);
            EVE.harmonicVcas.push(EVE[vca]);
        }

    }

    function buildLfo() {
        var i;

        EVE.lfo = EVE.synth.createOscillator();
        EVE.lfo.frequency.value = EVE.program.lfo_rate;
        EVE.lfo.type = EVE.program.lfo_type;

        for (i = 1; i <= EVE.config.harmonics; i += 1) {
            EVE['lfo' + i] = EVE.synth.createGain();
            EVE['lfo' + i].gain.value = EVE.program['lfo' + i];
            EVE.lfo.connect(EVE['lfo' + i]);
            EVE['lfo' + i].connect(EVE['osc' + i + '_vca'].gain);
        }
    }

    // Master VCA
    EVE.vca = EVE.synth.createGain();
    EVE.vca.gain.setValueAtTime(0, EVE.now());
    EVE.vca.connect(EVE.synth.destination);

    // Harmonic Oscillator
    // TODO why pass this in? Would be nicer inside
    buildHarmonicOsc(EVE.config.harmonics);

    // LFO
    buildLfo();

    // Prevent twice
    EVE.buildSynth = function buildSynth() {
        console.warn('Synth already built');
        return 'Synth already built';
    };

    return true;
};

EVE.buildScope = function buildScope() {
    'use strict';
    var fft = 2048,
        oscope = document.getElementById('scope'),
        ctx = oscope.getContext('2d'),
        gold = 'rgb(242, 219, 33)',
        scopeData = new Uint8Array(fft);

    // TODO Could go in buildSynth()...
    EVE.oscilloscope = EVE.synth.createAnalyser();
    EVE.vca.connect(EVE.oscilloscope);

    // Start drawing
    function draw() {
        var sliceWidth = 300 / fft,// canvas/fft
            x = 0,
            i,
            v,
            y;

        window.requestAnimationFrame(draw);

        ctx.clearRect(0, 0, 300, 150);//canvas size
        ctx.lineWidth = 2;
        ctx.strokeStyle = gold;
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
    }

    draw();

    EVE.buildScope = function buildScope() {
        console.warn('buildScope already called');
        return 'Scope already built';
    };

};

EVE.startSynth = function startSynth() {
    'use strict';
    var i;

    for (i = 0; i < EVE.config.harmonics; i += 1) {
        EVE.harmonicOscs[i].start(0);
    }

    EVE.lfo.start(0);

    document.removeEventListener('click', startSynth);
    document.removeEventListener('dblclick', startSynth);
    document.removeEventListener('keydown', startSynth);
    document.removeEventListener('touchstart', startSynth);
    document.removeEventListener('wheel', startSynth);

    EVE.startSynth = function startSynth() {
        console.warn('Synth can only be started once');
        return true;
    };
};

document.addEventListener('click', EVE.startSynth);
document.addEventListener('dblclick', EVE.startSynth);
document.addEventListener('keydown', EVE.startSynth);
document.addEventListener('touchstart', EVE.startSynth);
document.addEventListener('wheel', EVE.startSynth);

EVE.gateOn = function gateOn(e) {
    'use strict';
    var peak = EVE.synth.currentTime + parseFloat(EVE.program.vca_a),
        i,
        vca,
        osc,
        env;

    // Harmonic Envelopes
    for (i = 1; i < EVE.config.harmonics + 1; i += 1) {

        vca = EVE['osc' + i + '_vca'];
        osc = EVE.program['osc' + i];
        env = EVE.program['env' + i];

        // Timbre starting point
        vca.gain.setTargetAtTime(osc, EVE.now(), 0.1);

        // Timbre attack
        vca.gain.linearRampToValueAtTime(parseFloat(osc) + parseFloat(env), EVE.now() + parseFloat(EVE.program.timbre_a));

        // Timbre decay
        vca.gain.setTargetAtTime(osc + (env * EVE.program.timbre_s), EVE.now() + parseFloat(EVE.program.timbre_a), EVE.program.timbre_d);
    }

    // Set starting point
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_g, EVE.now(), 0.1);

    // Attack
    EVE.vca.gain.linearRampToValueAtTime(1, peak);

    // Decay
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_s + EVE.program.vca_g, peak, EVE.program.vca_d);

    return EVE.calculatePitch(e.target.dataset.noteValue);
};

EVE.keyboard.addEventListener('mousedown', EVE.gateOn);
EVE.keyboard.addEventListener('touchstart', EVE.gateOn);

EVE.gateOff = function gateOff() {
    'use strict';

    var releasePeak = EVE.vca.gain.value,
        timbrePeak,
        vca,
        i;

    // Harmonic Envelopes
    for (i = 1; i < EVE.config.harmonics + 1; i += 1) {

        vca = EVE['osc' + i + '_vca'];

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

EVE.keyboard.addEventListener('mouseup', EVE.gateOff);
EVE.keyboard.addEventListener('touchend', EVE.gateOff);

EVE.calculatePitch = function (note) {
    'use strict';
    var i;

    for (i = 0; i < EVE.config.harmonics; i += 1) {
        EVE.harmonicOscs[i].detune.setValueAtTime(note, EVE.synth.currentTime);
    }
    return;
};

EVE.slider = {
    grab: function () {
        'use strict';
        var prog = this.dataset.program,
            x = this.dataset.curve === 'lin' ? 1 : this.value;

        // Update program
        EVE.program[prog] = this.value * x;

        // Broadcast change
        this.dispatchEvent(EVE.events.update);

    },

    update: function (e) {
        'use strict';
        var p = e.target.dataset.program;

        switch (p) {
        // Harmonic Oscillators
        case 'osc1':
        case 'osc2':
        case 'osc3':
        case 'osc4':
        case 'osc5':
        case 'osc6':
        case 'osc7':
        case 'osc8':
            EVE[p + '_vca'].gain.setValueAtTime(EVE.program[p], EVE.now());
            break;
        case 'vca_g':
            EVE.vca.gain.setValueAtTime(EVE.program.vca_g, EVE.now());
            break;
        case 'lfo1':
        case 'lfo2':
        case 'lfo3':
        case 'lfo4':
        case 'lfo5':
        case 'lfo6':
        case 'lfo7':
        case 'lfo8':
            EVE[p].gain.setValueAtTime(EVE.program[p], EVE.now());
            break;
        case 'lfo_rate':
            EVE.lfo.frequency.setValueAtTime(EVE.program[p] * EVE.osc1.frequency.value, EVE.now());
            break;
        }
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

EVE.button = {
    press: function () {
        'use strict';
        var prog = this.dataset.program;

        // Update program
        EVE.program[prog] = this.value;

        // Broadcast change
        this.dispatchEvent(EVE.events.update);

    },

    update: function (e) {
        'use strict';
        var p = e.target.dataset.program;

        switch (p) {
        case 'lfo_shape':
            //TODO fix this
            EVE.lfo.type = 'triangle';
            console.log('updating to triangle');
            break;
        }
    }
};

(function bindButtons() {
    'use strict';
    //TODO finish this -- better selector and events
    var buttons = document.querySelectorAll('input[type=range]'),
        i;

    for (i = 0; i < buttons.length; i += 1) {
        buttons[i].addEventListener('click', EVE.button.press);
    }

}());

// Try creating a custom event for history state change
// Dispatch that event and listen for it on window
(function documentReady() {
    'use strict';

    // Set up templates
    navTemplate();

    // Set up synth
    EVE.buildSynth();
    EVE.buildScope();

    document.addEventListener('update', EVE.slider.update);

}());

(function collapseModules() {
    'use strict';
    var moduleTitles = document.querySelectorAll('section > h2, .toggle'),
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

EVE.testBuild = function () {
    'use strict';
    var x = {
        page: 'build'
    };
    history.pushState(x, '', 'build');
    window.dispatchEvent(EVE.events.navigate);
    console.log('Test build called', history.state.page);
};

EVE.testRegister = function () {
    'use strict';
    var x = {
        page: 'register'
    };
    history.pushState(x, '', 'register');
    window.dispatchEvent(EVE.events.navigate);
    console.log('Test register called', history.state.page);
};

EVE.historyChange = function () {
    'use strict';
    console.log('History pop state going on');
};

EVE.router = function (e) {
    'use strict';
    console.log('Router activated', history.state.page);
    switch (history.state.page) {
    case 'build':
        console.log('Go to build page');
        break;
    case 'register':
        console.log('Go to registration page');
        console.dir(e);
        break;
    default:
        console.log('404 page, man.');
    }
};

// Event listeners
//EVE.buildButton.addEventListener('click', EVE.testBuild);
//EVE.registerButton.addEventListener('click', EVE.testRegister);

window.addEventListener('popstate', EVE.historyChange);
window.addEventListener('navigate', EVE.router);
