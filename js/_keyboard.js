EVE.keyboard = {
    debug: true,
    octaveShift: 0,
    scope: document.getElementById('keyboard'),
    shiftOctave: function () {
        'use strict';
        var oct = EVE.keyboard.octaveShift,
            shift = this.dataset.shift;

        if ((oct > -2 && shift < 0) || (oct < 2 && shift > 0)) {
            EVE.keyboard.octaveShift = oct + parseFloat(shift);
        }

        if (EVE.keyboard.debug && console) {
            console.log(EVE.keyboard.octaveShift);
        }

    },
    test: function (e) {
        'use strict';
        if (console) {
            console.log(e.which);
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
    document.addEventListener('keypress', EVE.keyboard.test);
}());
