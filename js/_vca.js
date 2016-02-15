EVE = (function (module) {
    'use strict';
    var debug = true;

    module.vca = module.createGain();
    module.vca.gain.value = module.preset.vca_g;
    module.vca.connect(module.destination);
    module.vca.connect(module.oscilloscope);
    module.vca.attack = document.getElementById('vca-a');
    module.vca.decay = document.getElementById('vca-d');
    module.vca.sustain = document.getElementById('vca-s');
    module.vca.release = document.getElementById('vca-r');

    module.vca.gateOn = function () {
        // DEBUG
        if (debug && console) {
            console.log('Begin attack stage - custom gateOn');
        }
    };

    module.vca.gateOff = function () {
        // DEBUG
        if (debug && console) {
            console.log('Begin release stage - custom gateOff');
        }
    };

    module.vca.update = function (e) {
        var p;

        if (e.target && e.target.dataset && e.target.dataset.program) {
            p = e.target.dataset.program;
        }

        if (p === 'vca_g') {
            module.vca.gain.setValueAtTime(module.preset.vca_g, module.now());
        }

        // DEBUG
        if (debug && console) {
            console.log(p, module.preset[p]);
        }
    };

    document.addEventListener('updatevca', module.vca.update);

    // The ideal way to handle multiple envelopes triggered by keyboard
    document.addEventListener('gateon', module.vca.gateOn);
    document.addEventListener('gateoff', module.vca.gateOff);

    return module;

}(EVE));
