EVE.vca = EVE.synth.createGain();
EVE.vca.gain.value = EVE.program.vca_g;
EVE.vca.connect(EVE.synth.destination);

// TODO Listen for the oscilloscope and connect to it when available
EVE.vca.connect(EVE.oscilloscope);

EVE.vca.debug = true;

EVE.vca.scope = document.getElementById('vca');

EVE.vca.update = function (e) {
    'use strict';
    var p = e.target.dataset.program;

    if (EVE.vca.debug) {
        console.log(p, EVE.program[p]);
    }

    // TODO This doesn't need to be a switch
    switch (p) {
    case 'vca_a':
    case 'vca_d':
    case 'vca_s':
    case 'vca_r':
        break;
    case 'vca_g':
        EVE.vca.gain.setValueAtTime(EVE.program.vca_g, EVE.now());
        break;
    }
};

EVE.vca.scope.addEventListener('update_vca', EVE.vca.update);

EVE.update_vca = new CustomEvent('update_vca', {bubbles: true});
