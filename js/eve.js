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

        osc1: 1,
        osc2: 0,
        osc3: 0,
        osc4: 0,
        osc5: 0,
        osc6: 0,
        osc7: 0,
        osc8: 0,

        vca_a: 0.1,
        vca_d: 0.4,
        vca_s: 0.65,
        vca_r: 0.4,
        vca_g: 0
    },

    buildButton: document.getElementById('build-button'),
    registerButton: document.getElementById('register-button'),

    // Experimental time savers
    now: function now() {
        'use strict';
        return EVE.synth.currentTime;
    },

    attack: function attack(x) {
        'use strict';
        return EVE.synth.currentTime + x;
    },

    decay: function decay() {
        'use strict';
        return;
    },

    sustain: function sustain() {
        'use strict';
        return;
    },

    release: function release() {
        'use strict';
        return;
    }

};

EVE.events = {
    press: new CustomEvent('press', {
        bubbles: true
    }),
    navigate: new CustomEvent('navigate', {
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
            EVE[vca].gain.setValueAtTime(1, EVE.now());
            EVE[vca].connect(EVE.vca);

            EVE[osc] = EVE.synth.createOscillator();
            EVE[osc].type = 'sine';
            EVE[osc].frequency.value = EVE.config.master_freq * j;
            EVE[osc].connect(EVE[vca]);

            EVE.harmonicOscs.push(EVE[osc]);
            EVE.harmonicVcas.push(EVE[vca]);
        }

    }

    // Master VCA
    EVE.vca = EVE.synth.createGain();
    EVE.vca.gain.setValueAtTime(0, EVE.now());
    EVE.vca.connect(EVE.synth.destination);

    // Harmonic Oscillator
    buildHarmonicOsc(EVE.config.harmonics);

    // Prevent twice (sort of...)
    EVE.buildSynth = function buildSynth() {
        console.warn('Synth already built');
        return true;
    };

    return true;
};

EVE.startSynth = function startSynth() {
    'use strict';
    var i;
    console.log('Start synth called');
    for (i = 0; i < EVE.config.harmonics; i += 1) {
        EVE.harmonicOscs[i].start(0);
    }
    EVE.startSynth = function startSynth() {
        console.warn('startSynth already called');
        return true;
    };
    return true;
};

EVE.gateOn = function gateOn(e) {
    'use strict';
    if (e.target.dataset.noteValue) {
        console.log(e.target.dataset.noteValue);
        // Attack
        EVE.vca.gain.linearRampToValueAtTime(1, EVE.attack(EVE.program.vca_a));

        // Decay
        //EVE.vca.gain.setTargetAtTime(EVE.program.vca_s + EVE.program.vca_g, vca_end_of_attack, EVE.program.vca_d);

        e.target.dispatchEvent(EVE.events.press);
    }
};

EVE.gateOff = function gateOff(e) {
    'use strict';
    if (e.target.dataset.noteValue) {
        console.log('gateOff', e.target.dataset.noteValue);
        EVE.vca.gain.setTargetAtTime(0, EVE.now(), 0.1);
    }
};

EVE.calculatePitch = function () {
    'use strict';
    console.log('calculatePitch called');
};

// Try creating a custom event for history state change
// Dispatch that event and listen for it on window

(function documentReady() {
    'use strict';

    // Set up
    EVE.buildSynth();
    EVE.startSynth();

    // Actually belongs in this function
    EVE.keyboard = document.getElementById('keyboard');

    EVE.keyboard.addEventListener('mousedown', EVE.gateOn);
    EVE.keyboard.addEventListener('mouseup', EVE.gateOff);

    // Custom events testing
    EVE.keyboard.addEventListener('press', function (e) {
        console.log('Set note via custom event to', e.target.dataset.noteValue);
    });
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
EVE.buildButton.addEventListener('click', EVE.testBuild);
EVE.registerButton.addEventListener('click', EVE.testRegister);

window.addEventListener('popstate', EVE.historyChange);
window.addEventListener('navigate', EVE.router);
