import { elements } from "./elements.js";
import { state } from "./state.js";

/**
 * @module mouse
 * @description Handles mouse events
 */

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
    state.mouse.x = evt.clientX;
    state.mouse.y = evt.clientY;

    if(evt.target.classList.contains("card-container")){
        state.mouse_over_card = evt.target;
    }else if(evt.target.classList.contains("card")){
        state.mouse_over_card = evt.target.parentElement;
    }else{
        state.mouse_over_card = null;
    }

    state.mouse.angle = Math.atan((state.mouse.x-window.innerWidth/2)/(window.innerHeight-state.mouse.y)) / Math.PI * 180;
    state.mouse.distance = Math.sqrt(Math.pow((state.mouse.x-window.innerWidth/2),2) + Math.pow(window.innerHeight-state.mouse.y,2));
}
  

