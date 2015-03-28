EVE.slider = {
    grab: function () {
        'use strict';
        var config = {
            program: this.getAttribute('data-program'),
            update: this.getAttribute('data-update')
        };
        return $(this).on('mousemove touchmove', config, EVE.store_program)
                      .on('mouseup touchend', EVE.slider.release);
    },

    release: function () {
        'use strict';
        return $(this).unbind('mousemove touchmove');
    }
};
