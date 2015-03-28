window.AudioContext = window.AudioContext || window.webkitAudioContext;

var EVE = {
    synth: new AudioContext(),

    master_freq: 440,
    octave_shift: 0,
    playing: [],

    program: {
        name: 'INITIALIZE',

        osc1: 0,
        osc2: 0,
        osc3: 0,
        osc4: 0,
        osc5: 0,
        osc6: 0,
        osc7: 0,
        osc8: 0,

        vca_a: 0,
        vca_d: 0,
        vca_s: 1,
        vca_r: 0,
        vca_g: 0,

        lfo_amt: 0,
        lfo_rate: 0,

        trem_amt: 0,
        trem_rate: 0,

        vib_amt: 0,
        vib_rate: 0

    }

};
