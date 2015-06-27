window.AudioContext = window.AudioContext || window.webkitAudioContext;

var EVE = {
    config: {
        eg_minimum: 0.05,
        masterFreq: 440,
        octaveShift: 0
    },
    synth: new AudioContext()
};
