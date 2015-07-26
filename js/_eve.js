window.AudioContext = window.AudioContext || window.webkitAudioContext;

var EVE = {
    config: {
        eg_minimum: 0.05,
        harmonics: 8,
        masterFreq: 440
    },
    synth: new AudioContext()
};
