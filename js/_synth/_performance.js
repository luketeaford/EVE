//TODO Put this file outside the synth directory
EVE.performance = {};

EVE.performance.debug = true;

EVE.performance.scope = document.getElementById('performance');

EVE.performance.update = function (e) {
    'use strict';

    var p;

    if (e.target && e.target.dataset && e.target.dataset.program) {
        p = e.target.dataset.program;
    }

    if (EVE.performance.debug && console) {
        console.log(p, EVE.program[p]);
    }

    switch (p) {
    case 'glide':
        // Might be smart to make this keyboard glide or something
        EVE.program.glide = EVE.program.glide * 0.165;
        console.log('Glide updated to', EVE.program.glide);
        break;
    default:
        if (EVE.lfo1.debug && console) {
            console.log('Unhandled performance update change');
        }
    }

};

EVE.performance.scope.addEventListener('update_performance', EVE.performance.update);

EVE.update_performance = new CustomEvent('update_performance', {bubbles: true});
