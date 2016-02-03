window.AudioContext = window.AudioContext || window.webkitAudioContext;

var EVE = {
    config: {
        egMax: 2.125,
        egMin: 0.05,
        masterFreq: 440
    },
    synth: new AudioContext()
};
