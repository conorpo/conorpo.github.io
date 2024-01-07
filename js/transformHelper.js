import { config } from './config.js';
import { mouse, focus_mode } from './mouse.js';
import { elements } from './elements.js';


/**
 * @module transformHelper
 * @description Helper functions for getting transform strings
 */

/**
 * Gets a transform for a card in the hand
 * @param {number} angle The angle of the card in the hand 
 * @returns {string} The transform that will be applied to the card element
 */
export function getTransformStringHand(angle, hover){
    const hoverTransform = (hover) ? " translateY(-130px) scale(1.06) rotate(-5deg)" : "";
    const visibility = (focus_mode) ? 150 : 50
    return `translate(${window.innerWidth/2 - config.cardWidth/2}px, ${window.innerHeight + config.cardHandRadius - config.cardHeight}px) rotate(${angle}deg) translateY(-${config.cardHandRadius - visibility}px)` + hoverTransform;
}

/**
 * Gets a transform for a dragged card
 * @returns {string} The transform that will be applied to the card element
 */
export function getTransformStringDrag(){
    return `translate(${mouse.x - config.cardWidth/2}px, ${mouse.y - config.cardHeight/2}px) scale(${config.activeScale})`;
}


/**
 * Gets a transform for a card in the playing area
 * @returns {string} The transform that will be applied to the card element
*/
export function getTransformStringPlayingArea(){
    const {marginLeft, marginTop, width, height} = window.getComputedStyle(elements.get("playingArea"));

    const x = parseInt(marginLeft) + (parseInt(width) - config.cardWidth)/2;
    const y = parseInt(marginTop) + (parseInt(height) - config.cardHeight)/2;

    return `translate(${x}px, ${y}px) scale(${config.activeScale})`; //`;
}

/**
 * Gets a random transform for initial card placement
 * @returns {string} The transform that will be applied to the card element
*/
export function getRandomTransformString(){

    const x = (Math.random() * 0.6 + 0.3) * (window.innerWidth - config.cardWidth);
    const y = (Math.random() *0.8 + 0.1) * (window.innerHeight - config.cardHeight);
    const angle = Math.random() * 180 - 90;
    return `translate(${x}px, ${y}px)  rotate(${angle}deg)`;
} 
