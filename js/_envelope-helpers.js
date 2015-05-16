EVE.now = function () {
    'use strict';
    return EVE.synth.currentTime;
};

EVE.attack = function (x) {
    'use strict';
    console.log(typeof x);
    return EVE.synth.currentTime + x;
};
