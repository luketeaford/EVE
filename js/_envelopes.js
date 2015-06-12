EVE.now = function () {
    'use strict';
    return EVE.synth.currentTime;
};

EVE.attack = function (x) {
    'use strict';
    return EVE.now() + x;
};
