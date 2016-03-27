EVE = (function (module) {
    'use strict';
    var gateOn = false,
        keyboard = document.getElementById('keyboard'),
        mouseAndTouch = true;

    module.gate = function (event) {
        var gateEvent = gateOn ? 'gateoff' : 'gateon',
            mutexEvent = !!(
                event.type === 'keydown' ||
                event.type === 'keyup' ||
                event.type === 'mousedown' ||
                event.type === 'mouseup'
            ),
            touchGate = !!(
                (event.type === 'touchstart' && event.touches.length === 1) ||
                (event.type === 'touchend' && event.touches.length === 0)
            );

        if (mutexEvent || touchGate) {
            gateOn = !gateOn;
            document.dispatchEvent(module.events[gateEvent]);
        }

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
