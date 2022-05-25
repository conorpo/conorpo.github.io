import {config, state, elements} from './config.js';

export function getTransformStringHand(angle){
    return `translate(${window.innerWidth/2 - config.cardWidth/2}px, ${window.innerHeight + config.cardHandRadius - config.cardHeight}px) rotate(${angle}deg) translateY(-${config.cardHandRadius}px)`;
}

export function getTransformStringDrag(frame){
    const angle = (frame*config.wobbleSpeed/1000)%(2*Math.PI);
    return `translate(${state.mouse.x - config.cardWidth/2}px, ${state.mouse.y - config.cardHeight/2}px) scale(${config.activeScale})  rotate3d(${Math.sin(angle)},${Math.cos(angle)},0, ${config.wobbleIntensity}deg)`;
}


export function getRandomTransform(){
    return `rotate(${Math.random()*60 + -30}deg) scale(${Math.random()*3 + 0.3})`;
}