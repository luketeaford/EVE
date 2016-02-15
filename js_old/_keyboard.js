EVE.keyboard = {
    current: null,
    debug: false,
    keyDown: false,
    octaveShift: 0,
    scope: document.getElementById('keyboard'),

    //TODO Move to performance controls
    shiftOctave: function (direction) {
        'use strict';
        var oct = EVE.keyboard.octaveShift,
            shift = this.dataset ? this.dataset.shift : direction;

        function switchLights() {
            // TODO Don't do QSA every time!
            var i,
                lights = document.querySelectorAll('#performance [data-light]'),
                n = EVE.keyboard.octaveShift + 2;

            for (i = 0; i < lights.length; i += 1) {
                lights[i].dataset.light = i === n ? 'on' : 'off';
            }
        }

        if ((oct > -2 && shift < 0) || (oct < 2 && shift > 0)) {
            EVE.keyboard.octaveShift = oct + parseFloat(shift);
            switchLights();
        }

        if (EVE.keyboard.debug && console) {
            console.log(EVE.keyboard.octaveShift);
        }

    },

    pressBus: function (e) {
        'use strict';
        if (EVE.keyboard.debug && console) {
            console.log(e.which);
        }
        switch (e.which) {
        case 45:// -
        case 95:// _
            EVE.keyboard.shiftOctave(-1);
            break;
        case 61:// =
        case 43:// +
            EVE.keyboard.shiftOctave(1);
            break;
        }
    },

    downBus: function (e) {
        'use strict';
        var pitch = null;

        if (EVE.keyboard.debug && console) {
            console.log('DOWN BUS', e.which);
        }

        switch (e.which) {
        case 65:
            pitch = -2100;
            break;
        case 87:
            pitch = -2000;
            break;
        case 83:
            pitch = -1900;
            break;
        case 69:
            pitch = -1800;
            break;
        case 68:
            pitch = -1700;
            break;
        case 70:
            pitch = -1600;
            break;
        case 84:
            pitch = -1500;
            break;
        case 71:
            pitch = -1400;
            break;
        case 89:
            pitch = -1300;
            break;
        case 72:
            pitch = -1200;
            break;
        case 85:
            pitch = -1100;
            break;
        case 74:
            pitch = -1000;
            break;
        case 75:
            pitch = -900;
            break;
        case 79:
            pitch = -800;
            break;
        case 76:
            pitch = -700;
            break;
        case 80:
            pitch = -600;
            break;
        case 186:
            pitch = -500;
            break;
        case 222:
            pitch = -400;
            break;
        case 221:
            pitch = -300;
            break;
        case 192:
            console.log(EVE.program);
            break;
        }

        if (pitch !== null && EVE.keyboard.current !== e.which) {
            if (EVE.keyboard.keyDown === false) {
                EVE.keyboard.current = e.which;
                EVE.gate();
            }
            EVE.calculatePitch(pitch);
        }

    },

    upBus: function (e) {
        'use strict';
        if (e.which === EVE.keyboard.current) {
            EVE.keyboard.current = null;
            EVE.gateOff();
        }
    },

    touch: function (e) {
        'use strict';
        if (EVE.keyboard.debug && console) {
            console.log('Keyboard touched', e);
        }
    }
};

(function bindEvents() {
    'use strict';
    var buttons = document.getElementsByClassName('shift-octave'),
        i;
    for (i = 0; i < buttons.length; i += 1) {
        buttons[i].addEventListener('click', EVE.keyboard.shiftOctave);
        buttons[i].addEventListener('touchstart', EVE.keyboard.shiftOctave);
    }
    document.addEventListener('keypress', EVE.keyboard.pressBus);
    document.addEventListener('keydown', EVE.keyboard.downBus);
    document.addEventListener('keyup', EVE.keyboard.upBus);
}());