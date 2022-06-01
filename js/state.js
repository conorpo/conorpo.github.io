

/**
 * @typedef {Object} Mouse
 * @property {number} x Horizontal position of mouse in window space
 * @property {number} y Vertical position of mouse in window space
 * @property {number} angle Angle in degrees to bottom middle of window, where 0 degrees is directly above
 * @property {number} distance Distance in pixels to bottom middle of screen
 */

/**
 * @typedef {Object} State
 * @property {boolean} tableMode The current viewing mode
 * @property {Mouse} mouse Info on mouse position
 * @property {Card} activeCard The card object that is currently active
 * @property {Card} draggedCard The card object that is currently being dragged
 * @property {Array<string>} cardQueue A list of cards to add
 * @property {Array<Card>} cards All unlocked cards
 * @property {number} frame The current frame for animations
 */
/**
 * The State of the Site 
 * @type {State} */
export const state = {
    mouse: {x: 0, y: 0, angle: 0, distance: 0},
    cards: [],
    activeCard: null,
    draggedCard: null,
    cardQueue: [],
    tableMode: false,
    frame: 0
}
  


export const save = {
    tableMode: false,
}