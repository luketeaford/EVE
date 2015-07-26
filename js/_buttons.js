EVE.button = {
    debug: true,
    press: function () {
        'use strict';
        var prog = this.name,
            update = 'update_' + this.parentElement.parentElement.parentElement.dataset.update;

        // Update program
        if (EVE.program[prog] !== this.value) {
            // Prevents numbers being stored as strings
            if (typeof this.value === 'string' && !isNaN(this.value - 1)) {
                EVE.program[prog] = parseFloat(this.value);
            } else {
                EVE.program[prog] = this.value;
            }
        }

        if (EVE.button.debug && console) {
            console.log('Updating', update);
        }

        // Broadcast change
        this.dispatchEvent(EVE[update]);
    }
};

(function bindRadioButtons() {
    'use strict';
    var buttons = document.querySelectorAll('input[type=radio]'),
        i;

    for (i = 0; i < buttons.length; i += 1) {
        buttons[i].addEventListener('change', EVE.button.press);
    }

}());
