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

        vca_a: 0.01,
        vca_d: 0.4,
        vca_s: 1,
        vca_r: 0.4,
        vca_g: 0
    },

//    harmonicOscs: [],
//    harmonicVcas: [],

    buildButton: document.getElementById('build-button'),

    // Experimental time savers
    now: function now() {
        'use strict';
        return EVE.synth.currentTime;
    }
};
