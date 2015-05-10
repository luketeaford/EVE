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
