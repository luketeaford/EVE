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
        vca_d: 0.1,
        vca_s: 0.15,
        vca_r: 0.1,
        vca_g: 0
    },

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
