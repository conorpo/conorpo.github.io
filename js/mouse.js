import { elements } from "./elements.js";
import { dragged_card, set_status } from "./CardManager.js";
import { CardState } from "./Card.js";
import { config } from "./config.js";

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

export let focus_mode = false;

/**
 * Adds mouse event listeners to the document
*/
export function addMouseEventListeners() {
    elements.get("playingArea").addEventListener("mouseup", (evt) => {
        if(dragged_card) set_status(dragged_card, CardState.ACTIVE);
        evt.stopPropagation();
    });
    window.addEventListener("mouseup", (evt) => {
        if(dragged_card) set_status(dragged_card, CardState.IN_HAND);
        evt.stopPropagation();
    });
    elements.get("globalContainer").addEventListener("mousemove", mouseMove);

    //Focus
    // elements.get("infoContainer").addEventListener("click", (evt) => {
    //     focus_mode = !focus_mode;
    //     elements.get("globalContainer").classList.toggle("focus");
    //     evt.stopPropagation();
    // });
};

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
    
    mouse.angle = Math.atan((mouse.x-window.innerWidth/2)/(window.innerHeight-mouse.y)) / Math.PI * 180;
    mouse.distance = Math.sqrt(Math.pow((mouse.x-window.innerWidth/2),2) + Math.pow(window.innerHeight-mouse.y,2));
}
  

