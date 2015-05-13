EVE.button = {
    press: function () {
        'use strict';
        var prog = this.dataset.program;

        // Update program
        EVE.program[prog] = this.value;

        // Broadcast change
        this.dispatchEvent(EVE.events.update);

    },

    update: function (e) {
        'use strict';
        var p = e.target.dataset.shape;

        EVE.lfo.type = p;
        console.log(p);
    }
};

(function bindButtons() {
    'use strict';
    //TODO finish this -- better selector and events
    var buttons = document.querySelectorAll('.radio'),
        i;

    for (i = 0; i < buttons.length; i += 1) {
        buttons[i].addEventListener('click', EVE.button.press);
    }

}());
