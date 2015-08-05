EVE.keyboard = {
    current: null,
    debug: true,
    keyDown: false,
    octaveShift: 0,
    scope: document.getElementById('keyboard'),
    shiftOctave: function (direction) {
        'use strict';
        var oct = EVE.keyboard.octaveShift,
            shift = this.dataset ? this.dataset.shift : direction;

        function switchLights() {
            var i,
                lights = document.querySelectorAll('#performance > span'),
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
        //TODO bullshit third condition to keep console clear while working
        if (EVE.keyboard.debug && console && EVE.keyboard.octaveShift === 23) {
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
        case 65: // a
            pitch = -2100;
            break;
        case 83: // s
            pitch = -2000;
            break;
        case 68:// d
            pitch = -1900;
            break;
        case 70:// f
            pitch = -1800;
            break;
        case 71:// g
            pitch = -1700;
            break;
        case 72:// h
            pitch = -1600;
            break;
        case 74:// j
            pitch = -1500;
            break;
        case 75:// k
            pitch = -1400;
            break;
        case 76:// l
            pitch = -1300;
            break;
        case 186:// ;
            pitch = -1200;
            break;
        case 222:// '
            pitch = -1100;
            break;
        case 81:// q
            pitch = -1000;
            break;
        case 87:
            pitch = -900;
            break;
        case 69:
            pitch = -800;
            break;
        case 82:
            pitch = -700;
            break;
        case 84:
            pitch = -600;
            break;
        case 89:
            pitch = -500;
            break;
        case 85:
            pitch = -400;
            break;
        case 73:
            pitch = -300;
            break;
        case 79:
            pitch = -200;
            break;
        case 80:
            pitch = -100;
            break;
        case 219:
            pitch = 0;
            break;
        case 221:
            pitch = 100;
            break;
        }

        if (pitch !== null && EVE.keyboard.current !== e.which) {
            if (EVE.keyboard.keyDown === false) {
                EVE.keyboard.current = e.which;
                EVE.gateOn();
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
        if (console) {
            console.log('Keyboard touched', e);
        }
    }
};

(function bindEvents() {
    'use strict';
    var buttons = document.getElementsByClassName('octave-shift'),
        i;
    for (i = 0; i < buttons.length; i += 1) {
        buttons[i].addEventListener('click', EVE.keyboard.shiftOctave);
    }
    document.addEventListener('keypress', EVE.keyboard.pressBus);
    document.addEventListener('keydown', EVE.keyboard.downBus);
    document.addEventListener('keyup', EVE.keyboard.upBus);
}());
