EVE.slider = {
    grab: function () {
        'use strict';
        var prog = this.dataset.program,
            // Exponential
            x = this.value * this.value;


        // Update program
        EVE.program[prog] = x;

        // Broadcast change
        this.dispatchEvent(EVE.events.update);
    }
};

(function bindSliders() {
    'use strict';
    var harmonics = document.getElementById('harmonics'),
        inputs = harmonics.getElementsByTagName('input'),
        i;

    for (i = 0; i < inputs.length; i += 1) {
        inputs[i].addEventListener('input', EVE.slider.grab);
    }

    console.log('Sliders bound');

}());
