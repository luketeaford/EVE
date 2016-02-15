// TODO The random number (0.165) is a tolerable maximum: move it to a config
EVE = (function (module) {
    'use strict';

    module.performance = {
        debug: true,
        glide: document.getElementById('glide'),
        update: function (e) {
            var p;

            if (e.target && e.target.dataset && e.target.dataset.program) {
                p = e.target.dataset.program;
            }

            if (module.performance.debug && console) {
                console.log(p, module.preset[p]);
            }

            switch (p) {
            case 'glide':
                module.preset.glide = module.preset.glide * 0.165;
                if (module.performance.debug && console) {
                    console.log('Glide updated to', module.preset.glide);
                }
                break;
            default:
                if (module.performance.debug && console) {
                    console.log('Unhandled performance update change');
                }
            }
        }
    };

    return module;
}(EVE));
