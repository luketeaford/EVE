EVE = (function (module) {
    'use strict';
    var gateOn = false,
        keyboard = document.getElementById('keyboard');

    module.gate = function () {
        var gateEvent = gateOn ? 'gateoff' : 'gateon';

        gateOn = !gateOn;

        document.dispatchEvent(module.events[gateEvent]);

        return;
    };

    keyboard.addEventListener('mousedown', module.gate);
    keyboard.addEventListener('mouseup', module.gate);
    keyboard.addEventListener('touchend', module.gate);
    keyboard.addEventListener('touchstart', module.gate);

    return module;
}(EVE));
