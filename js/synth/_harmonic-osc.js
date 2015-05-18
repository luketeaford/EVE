(function buildHarmonicOscs() {
    'use strict';
    var i,
        osc;
    EVE.harmonicOscs = [];
    for (i = 1; i <= EVE.config.harmonics; i += 1) {
        osc = 'osc' + i;
        EVE[osc] = EVE.synth.createOscillator();
        EVE[osc].frequency.value = EVE.config.masterFreq * i;
        EVE[osc].type = 'sine';
        EVE.harmonicOscs.push(EVE[osc]);
        EVE.oscillators.push(EVE[osc]);
    }
}());

(function buildHarmonicVcas() {
    'use strict';
    var i,
        osc,
        vca;
    EVE.harmonicVcas = [];
    for (i = 1; i <= EVE.config.harmonics; i += 1) {
        osc = 'osc' + i;
        vca = osc + '_vca';
        EVE[vca] = EVE.synth.createGain();
        EVE[vca].gain.setValueAtTime(EVE.program[osc], EVE.now());
        EVE.harmonicVcas.push(EVE[vca]);
    }
    // Broadcast ready event
    document.dispatchEvent(EVE.synth.ready);
}());

// Listen for a build complete event, then connect
function connectHarmonicOscs() {
    'use strict';
    var i,
        osc,
        vca;
    for (i = 1; i <= EVE.config.harmonics; i += 1) {
        osc = 'osc' + i;
        vca = osc + '_vca';
        EVE[osc].connect(EVE[vca]);
        EVE[vca].connect(EVE.vca);
    }
    console.log('harmonics connected');
}

// TODO Rename this...
(function bindConnectEvents() {
    'use strict';
    document.addEventListener('EVE.synth.ready', connectHarmonicOscs);
}());
