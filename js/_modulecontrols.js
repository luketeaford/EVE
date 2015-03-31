EVE.toggle_module = function toggle_module() {
    'use strict';
    this.dataset.state = this.dataset.state === 'closed' ? 'open' : 'closed';
    return this;
};
