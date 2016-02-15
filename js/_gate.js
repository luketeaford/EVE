EVE = (function (module) {
    'use strict';
    var gateOn = false;

    module.gate = function () {
        var x = gateOn ? 0 : 1;

        // TODO Broadcast an 'attack' or 'release' event...

        gateOn = !gateOn;

        return x;
    };

    return module;
}(EVE));
