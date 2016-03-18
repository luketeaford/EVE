EVE = (function (module) {
    'use strict';

    var offset = -135,
        updateMethods = {
            'harmonic-oscillator': 'updateharmonicoscillator',
            'lfo1': 'updatelfo1',
            'lfo2': 'updatelfo2',
            'performance': 'updateperformance',
            'timbre-env': 'updatetimbreenv',
            'vca': 'updatevca'
        };

    module.slider = {
        // TODO Can't decide if rotate should use event.target.value or module.preset[program]
        grab: function (event) {
            var program,
                update;

            if (event.target.type === 'range') {
                program = event.target.dataset.program;

                update = updateMethods[event.target.parentElement.parentElement.parentElement.id];

                module.preset[program] = event.target.dataset.curve === 'lin' ?
                        parseFloat(event.target.value) :
                        Math.pow(event.target.value, 2);

                event.target.nextElementSibling.style.transform = module.slider.rotate(event.target.value, event.target.min === '-1');

                return event.target.dispatchEvent(module.events[update]);
            }

            return;
        },

        rotate: function (x, unipolar) {
            var r = unipolar ? x * 135 : x * 270 + offset;
            return 'rotate(' + r + 'deg)';
        }
    };

    document.addEventListener('input', module.slider.grab);

    return module;
}(EVE));
