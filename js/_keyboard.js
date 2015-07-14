EVE.keyboard = {
    debug: true,
    octaveShift: 0,
    scope: document.getElementById('keyboard'),
    shiftOctave: function (direction) {
        'use strict';
        var oct = EVE.keyboard.octaveShift,
            shift = this.dataset ? this.dataset.shift : direction;

        if ((oct > -2 && shift < 0) || (oct < 2 && shift > 0)) {
            EVE.keyboard.octaveShift = oct + parseFloat(shift);
        }

        if (EVE.keyboard.debug && console) {
            console.log(EVE.keyboard.octaveShift);
        }

    },
    bus: function (e) {
        'use strict';
        if (EVE.keyboard.debug && console) {
            console.log(e.which);
        }
        switch (e.which) {
        case 45:// -
        case 95:// _
            EVE.keyboard.shiftOctave(-1);
            console.log('keyboard down');
            break;
        case 61:// =
        case 43:// +
            EVE.keyboard.shiftOctave(1);
            console.log('keyboard up');
            break;
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
    document.addEventListener('keypress', EVE.keyboard.bus);
}());
