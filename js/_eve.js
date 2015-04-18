window.AudioContext = window.AudioContext || window.webkitAudioContext;

var EVE = {

    config: new Config({
        master_freq: 444,
        octave_shift: 0
    }),

    program: new Program({
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
        vca_g: 0,

    })

};
