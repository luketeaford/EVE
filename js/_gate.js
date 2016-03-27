EVE = (function (module) {
    'use strict';
    var gateOn = false,
        keyboard = document.getElementById('keyboard');

    module.gate = function (event) {
        var gateEvent = gateOn ? 'gateoff' : 'gateon';

        gateOn = !gateOn;

        document.dispatchEvent(module.events[gateEvent]);

        console.log('The event is', event);

        return;
    };

    keyboard.addEventListener('mousedown', module.gate);
    keyboard.addEventListener('mouseup', module.gate);
    keyboard.addEventListener('touchend', module.gate);
    keyboard.addEventListener('touchstart', module.gate);

    return module;
}(EVE));
