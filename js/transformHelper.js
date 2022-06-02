import {config} from './config.js';
import {state} from './state.js'

/**
 * Gets a transform for a card in the hand
 * @param {number} angle The angle of the card in the hand 
 * @returns {string} The transform that will be applied to the card element
 */
export function getTransformStringHand(angle){
    return `translate(${window.innerWidth/2 - config.cardWidth/2}px, ${window.innerHeight + config.cardHandRadius - config.cardHeight}px) rotate(${angle}deg) translateY(-${config.cardHandRadius}px)`;
}

/**
 * Gets a transform for a dragged card
 * @returns {string} The transform that will be applied to the card element
 */
export function getTransformStringDrag(){
    const angle = (state.frame*config.wobbleSpeed/1000)%(2*Math.PI);
    return `translate(${state.mouse.x - config.cardWidth/2}px, ${state.mouse.y - config.cardHeight/2}px) scale(${config.activeScale})`;
}

/**
 * Gets a completely random transform (used for the info elements)
 * @returns {string} Random transform to be applied to element
 */
export function getRandomTransform(){
    return `rotate(${Math.random()*60 + -30}deg) scale(${Math.random()*3 + 0.3})`;
}