// TODO Consider moving shiftOctave to performance controls
EVE = (function (module) {
    'use strict';
    var buttons = document.getElementsByClassName('shift-octave'),
        currentKey,
        debug = false,
        keyDown,
        pitch,
        i;

    module.keyboard = {
        lights: document.querySelectorAll('#performance [data-light]'),
        octaveShift: 0,
        scope: document.getElementById('keyboard'),

        shiftOctave: function (direction) {
            var oct = module.keyboard.octaveShift,
                shift = this.dataset ? this.dataset.shift : direction;

            function switchLights() {
                var n = module.keyboard.octaveShift + 2;

                for (i = 0; i < module.keyboard.lights.length; i += 1) {
                    module.keyboard.lights[i].dataset.light = i === n ? 'on' : 'off';
                }
            }

            if ((oct > -2 && shift < 0) || (oct < 2 && shift > 0)) {
                module.keyboard.octaveShift = oct + parseFloat(shift);
                switchLights();
            }

            // DEBUG
            if (debug && console) {
                console.log(module.keyboard.octaveShift);
            }
        },

        pressBus: function (e) {
            switch (e.which) {
            case 122:// z
                module.keyboard.shiftOctave(-1);
                break;
            case 120:// x
                module.keyboard.shiftOctave(1);
                break;
            }

            // DEBUG
            if (debug && console) {
                console.log('PRESS:', e.which);
            }
        },

        downBus: function (e) {
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
                if (console) {
                    console.log(module.preset);
                }
                break;
            }

            if (pitch && currentKey !== e.which) {
                if (!keyDown) {
                    currentKey = e.which;
                    keyDown = !keyDown;
                    module.gate();
                }
                module.calculatePitch(pitch);
            }

            // DEBUG
            if (debug && console) {
                console.log('DOWN BUS', e.which);
            }
        },

        upBus: function (e) {
            if (e.which === currentKey) {
                currentKey = undefined;
                keyDown = !keyDown;
                pitch = undefined;
                module.gate();
            }

            // DEBUG
            if (debug && console) {
                console.log('UP BUS', e.which);
            }
        }

    };

    for (i = 0; i < buttons.length; i += 1) {
        buttons[i].addEventListener('click', module.keyboard.shiftOctave);
        buttons[i].addEventListener('touchstart', module.keyboard.shiftOctave);
    }

    document.addEventListener('keypress', module.keyboard.pressBus);
    document.addEventListener('keydown', module.keyboard.downBus);
    document.addEventListener('keyup', module.keyboard.upBus);

    return module;
}(EVE));
