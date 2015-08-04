window.AudioContext = window.AudioContext || window.webkitAudioContext;

var EVE = {
    config: {
        eg_max: 2.125,
        eg_min: 0.05,
        masterFreq: 440
    },
    synth: new AudioContext()
};
