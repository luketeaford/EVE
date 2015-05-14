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
        EVE.lfo1.type = e.target.dataset.shape;
        console.log('Remember to fix this');
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
