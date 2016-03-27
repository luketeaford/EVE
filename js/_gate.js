EVE = (function (module) {
    'use strict';
    var gateOn = false,
        keyboard = document.getElementById('keyboard'),
        mouseAndTouch = true;

    module.gate = function (event) {
        var gateEvent = gateOn ? 'gateoff' : 'gateon';

        gateOn = !gateOn;

        document.dispatchEvent(module.events[gateEvent]);

        if (mouseAndTouch && event.type === 'touchstart') {
            keyboard.removeEventListener('mousedown', module.gate);
            keyboard.removeEventListener('mouseup', module.gate);
            mouseAndTouch = false;
        }
        return;
    };

    keyboard.addEventListener('mousedown', module.gate);
    keyboard.addEventListener('mouseup', module.gate);
    keyboard.addEventListener('touchend', module.gate);
    keyboard.addEventListener('touchstart', module.gate);

    return module;
}(EVE));
