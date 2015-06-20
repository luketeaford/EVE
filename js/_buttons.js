EVE.button = {
    debug: true,
    press: function () {
        'use strict';
        var prog = this.dataset.program,
            update = 'update_' + this.parentElement.parentElement.dataset.update;

        // Update program
        if (EVE.program[prog] !== this.value) {
            EVE.program[prog] = this.value;
        }

        if (EVE.button.debug) {
            console.log('Updating', update);
        }

        // Broadcast change
        this.dispatchEvent(EVE[update]);
    }
};

// TODO BIND BUTTONS HERE
