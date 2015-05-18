window.AudioContext = window.AudioContext || window.webkitAudioContext;

var EVE = {
    oscillators: [],
    synth: new AudioContext()
};

// QUESTIONABLE BELOW
EVE.synth.ready = new CustomEvent('ready', {});
