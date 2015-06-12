window.AudioContext = window.AudioContext || window.webkitAudioContext;

var EVE = {
    config: {
        harmonics: 8,
        masterFreq: 440,
        octaveShift: 0
    },
    program: {
        osc1: 1,
        osc2: 0,
        osc3: 0,
        osc4: 0,
        osc5: 0,
        osc6: 0,
        osc7: 0,
        osc8: 0
    },
    synth: new AudioContext()
};
