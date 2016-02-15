EVE = (function (module) {
    'use strict';

    module.vca = module.createGain();
    module.vca.gain.value = module.preset.vca_g;
    module.vca.connect(module.destination);
    module.vca.connect(module.oscilloscope);
    module.vca.debug = true;
    module.vca.attack = document.getElementById('vca-a');
    module.vca.decay = document.getElementById('vca-d');
    module.vca.sustain = document.getElementById('vca-s');
    module.vca.release = document.getElementById('vca-r');

    module.vca.update = function (e) {
        var p;

        if (e.target && e.target.dataset && e.target.dataset.program) {
            p = e.target.dataset.program;
        }

        if (module.vca.debug && console) {
            console.log(p, module.preset[p]);
        }

        if (p === 'vca_g') {
            module.vca.gain.setValueAtTime(module.preset.vca_g, module.now());
        }

    };

    document.addEventListener('updatevca', module.vca.update);

    return module;

}(EVE));
