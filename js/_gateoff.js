EVE.gateOff = function gateOff(e) {
    'use strict';
    if (e.target.dataset.noteValue) {
        console.log('gateOff', e.target.dataset.noteValue);
        EVE.vca.gain.setTargetAtTime(0, EVE.now(), 0.1);
    }
};
