EVE.slider = {
    debug: true,
    grab: function (e) {
        'use strict';
        var prog = this.dataset.program,
            update = 'update_' + this.parentElement.parentElement.parentElement.dataset.update,
            x = this.dataset.curve === 'lin' ? 1 : this.value;

        // Update program
        EVE.program[prog] = this.value * x;

        if (EVE.slider.debug && console) {
            console.dir(e.target);
            console.log('Updating', update);
        }

        // Broadcast change
        this.dispatchEvent(EVE[update]);
    }
};

(function bindSliders() {
    'use strict';
    var inputs = document.querySelectorAll('input[type=range]'),
        i;

    for (i = 0; i < inputs.length; i += 1) {
        inputs[i].addEventListener('input', EVE.slider.grab);
    }

}());

// SVG knobs
EVE.knob = {
    currentKnob: null,
    debug: true,
    test: function () {
        'use strict';
        console.log('AMAZING INPUT -- input event');
    },
    grab: function (e) {
        'use strict';
        EVE.knob.grab.origin = {
            x: e.pageX,//formerly screenX
            y: e.pageY//formerly screenY
        };
        EVE.knob.currentKnob = this;
        document.addEventListener('mousemove', EVE.knob.twist);
        document.addEventListener('touchmove', EVE.knob.twist);
    },
    rotate: function () {
        'use strict';
        var x = null;
        EVE.knob.currentKnob.style.webkitTransform = x;
        EVE.knob.currentKnob.style.transform = x;
    },
    twist: function (e) {
        'use strict';
        var deg = e.pageY - EVE.knob.grab.origin.y,
            rotate = 'rotate(' + deg + 'deg)',
            x = document.getElementById('test');

        if (EVE.knob.debug && console) {
            console.log('Difference y', deg);
            console.dir(x);
            x.stepUp(e.pageY - EVE.knob.grab.origin.y);
            x.addEventListener('change', function () {
                console.log('THE INPUT HAS CHANGED');
            });
        }

        // Prevent scrolling the body while moving a knob
        e.preventDefault();

        EVE.knob.currentKnob.style.mozTransform = rotate;
        EVE.knob.currentKnob.style.webkitTransform = rotate;
        EVE.knob.currentKnob.style.transform = rotate;

        document.addEventListener('mouseup', EVE.knob.release);
        document.addEventListener('touchend', EVE.knob.release);
    },
    release: function () {
        'use strict';
        console.log('Knob released');
        document.removeEventListener('mousemove', EVE.knob.twist);
        document.removeEventListener('mouseup', EVE.knob.release);
        document.removeEventListener('touchmove', EVE.knob.twist);
        document.removeEventListener('touchend', EVE.knob.release);
    }
};
