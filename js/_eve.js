window.AudioContext = window.AudioContext || window.webkitAudioContext;

var EVE = {
    config: {
        eg_max: 2.125,
        eg_min: 0.05,
        harmonics: 8,// TODO deprecate this
        masterFreq: 440
    },
    synth: new AudioContext()
};
