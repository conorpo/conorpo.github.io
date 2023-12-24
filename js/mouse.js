import { elements } from "./elements.js";
import { state } from "./state.js";
import { element_card_map } from "./Card.js";

/**
 * @module mouse
 * @description Handles mouse events, keeps track of mouse state
*/

/**
 * @typedef {Object} Mouse
 * @property {number} x Horizontal position of mouse in window space
 * @property {number} y Vertical position of mouse in window space
 * @property {number} angle Angle in degrees to bottom middle of window, where 0 degrees is directly above
 * @property {number} distance Distance in pixels to bottom middle of screen
 */

/** @type {Mouse} */
export const mouse = {x: 0, y: 0, angle: 0, distance: 0};

/**
 * Adds mouse event listeners to the document
*/
export function addMouseEventListeners() {
    elements.get("playingArea").addEventListener("mouseup", releaseInPlayingArea);
    elements.get("globalContainer").addEventListener("mouseup", releaseOutsidePlayingArea);
    elements.get("globalContainer").addEventListener("mousemove", mouseMove);
};

/**
 * Event Handler for when the mouse is released in the playing area
 * 
 * Removes the active card, replaces it with the dragged card, draggedCard becomes null
 * @param {MouseEvent} evt The mouse event
*/
const releaseInPlayingArea = (evt) => {
    state.activeCard?.hideInfo();
    state.activeCard?.backToHand();

    state.draggedCard?.activate();
    state.activeCard = state.draggedCard;
    state.draggedCard = null;
}

/**
 * Event Handler for when the mouse is released outside the playing area
 * 
 * Returns the dragged card to the hand, draggedCard becomes null
 * @param {MouseEvent} evt The mouse event
 */
const releaseOutsidePlayingArea = (evt) => {
    state.draggedCard?.backToHand();
    state.draggedCard = null;
    elements.get("globalContainer").style.cursor = "auto";
}

/**
 * Event Handler for when the mouse is moved
 * 
 * Updates the mouse state
 * @param {MouseEvent} evt The mouse event
 * @todo Change this so it just adds the card itself
 */
const mouseMove = (evt) => {
    mouse.x = evt.clientX;
    mouse.y = evt.clientY;

    element_card_map.get(evt.target)?.find_card();

    mouse.angle = Math.atan((mouse.x-window.innerWidth/2)/(window.innerHeight-mouse.y)) / Math.PI * 180;
    mouse.distance = Math.sqrt(Math.pow((mouse.x-window.innerWidth/2),2) + Math.pow(window.innerHeight-mouse.y,2));
}
  

