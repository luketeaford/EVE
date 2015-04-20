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
        EVE.vca.gain.setTargetAtTime(EVE.program.vca_s + EVE.program.vca_g, vca_end_of_attack, TANGUY.program.vca_d);

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

(function documentReady() {
    'use strict';
    // SET UP
    EVE.buildSynth();
    EVE.startSynth();

    // Actually belongs in this function
    EVE.keyboard = document.getElementById('keyboard');

    EVE.keyboard.addEventListener('mousedown', EVE.gateOn);
    EVE.keyboard.addEventListener('mouseup', EVE.gateOff);
}());
