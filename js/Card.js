/**
 * @module Card
 * @description Handles the cards
 * */


/**
 * The state of the card
 * @readonly
 * @enum {number}
*/
export const CardState = Object.freeze({
    DOWN_NOT_VISIBLE: 0,
    DOWN_VISIBLE: 1,
    IN_HAND: 2,
    DRAGGING: 3,
    ACTIVE: 4
});

/** 
 * @typedef {Object} Card
 * @property {string} name The name of the card
 * @property {CardState} status
 * 
 * @property {HTMLElement} element The actual HTML element of the card
 * @property {HTMLElement} infoElement The corresponding html info element that is revealed when card is active
 * @property {HTMLIFrameElement} iframeElement The iframe element
 * @property {number} iframeTimeout The timeout for the iframe
 * @property {function} iframeSrcFunc The function to get the iframe src
 * @property {Object} findListener The listener for when the mouse enters the card, stored so it can be removed
 * @description The card object
 * */


/** @type {Card} */
export const card_proto = {
    // Assigned in create_card
    name: null, 
    status: CardState.DOWN_NOT_VISIBLE,
    element: null,
    infoElement: null,
    iframeElement: null,
    iframeTimeout: null,
    iframeSrcFunc: null,
    findListener: null,
};


