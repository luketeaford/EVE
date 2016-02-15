// Just curious if this works
EVE.helloWorld = function helloWorld() {
    'use strict';
    console.log('Hello world!');
    EVE.helloWorld = null;
    return;
};

// NEW GATING STRATEGY
EVE.gateOn = false;

EVE.gate = function gate() {
    'use strict';
    var x = EVE.gateOn === false ? 1 : 0;

    EVE.vca.gain.setValueAtTime(x, EVE.currentTime);
    EVE.gateOn = !EVE.gateOn;

    return;
};
