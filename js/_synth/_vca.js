EVE.vca = EVE.synth.createGain();
EVE.vca.gain.value = EVE.program.vca_g;
EVE.vca.connect(EVE.synth.destination);

// TODO Listen for the oscilloscope and connect to it when available
EVE.vca.connect(EVE.oscilloscope);

EVE.vca.debug = true;

EVE.vca.scope = document.getElementById('vca');

EVE.vca.attack = document.getElementById('vca-a');
EVE.vca.decay = document.getElementById('vca-d');
EVE.vca.sustain = document.getElementById('vca-s');
EVE.vca.release = document.getElementById('vca-r');

EVE.vca.update = function (e) {
    'use strict';
    var p;

    if (e.target && e.target.dataset && e.target.dataset.program) {
        p = e.target.dataset.program;
    }

    if (EVE.vca.debug && console) {
        console.log(p, EVE.program[p]);
    }

    if (p === 'vca_g') {
        EVE.vca.gain.setValueAtTime(EVE.program.vca_g, EVE.now());
    }

};

EVE.vca.scope.addEventListener('update_vca', EVE.vca.update);

EVE.update_vca = new CustomEvent('update_vca', {bubbles: true});
