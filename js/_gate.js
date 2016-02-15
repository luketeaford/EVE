EVE = (function (module) {
    'use strict';
    var gateOn = false;

    module.gate = function () {
        var gateEvent = gateOn ? 'gateOff' : 'gateOn';

        gateOn = !gateOn;

        document.dispatchEvent(module.events[gateEvent]);

        return;
    };

    return module;
}(EVE));
