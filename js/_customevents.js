EVE.events = {
    press: new CustomEvent('press', {
        bubbles: true
    }),
    navigate: new CustomEvent('navigate', {
        detail: {
            place: window.location
        },
        bubbles: true
    })
};
