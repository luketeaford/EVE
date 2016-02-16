// TODO Evaluate whether or not the keyboard events should be bound here
EVE = (function (module) {
    'use strict';
    var gateOn = false,
        keyboard = document.getElementById('keyboard');

    module.gate = function () {
        var gateEvent = gateOn ? 'gateOff' : 'gateOn';

        gateOn = !gateOn;

        document.dispatchEvent(module.events[gateEvent]);

        return;
    };

    // BIND EVENTS
    keyboard.addEventListener('mousedown', module.gate);
    keyboard.addEventListener('mouseup', module.gate);
    keyboard.addEventListener('touchend', module.gate);
    keyboard.addEventListener('touchstart', module.gate);

    return module;
}(EVE));
