EVE.events = {
    update: new CustomEvent('update', {
        bubbles: true
    }),
    press: new CustomEvent('press', {
        bubbles: true
    }),
    navigate: new CustomEvent('navigate', {
        // Only here to demonstrate how to include arbitrary data
        detail: {
            place: window.location
        },
        bubbles: true
    })
};
