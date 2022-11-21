import {config} from './config.js';
import {state} from './state.js'

/**
 * Gets a transform for a card in the hand
 * @param {number} angle The angle of the card in the hand 
 * @returns {string} The transform that will be applied to the card element
 */
export function getTransformStringHand(angle, active){
    const activeTransform = (active) ? " translateY(-100px) scale(1.05)" : "";
    return `translate(${window.innerWidth/2 - config.cardWidth/2}px, ${window.innerHeight + config.cardHandRadius - config.cardHeight}px) rotate(${angle}deg) translateY(-${config.cardHandRadius - 50}px)` + activeTransform;
}

/**
 * Gets a transform for a dragged card
 * @returns {string} The transform that will be applied to the card element
 */
export function getTransformStringDrag(){
    const angle = (state.frame*config.wobbleSpeed/1000)%(2*Math.PI);
    return `translate(${state.mouse.x - config.cardWidth/2}px, ${state.mouse.y - config.cardHeight/2}px) scale(${config.activeScale})`;
}