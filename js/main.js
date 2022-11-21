/*
  TODO

  Make Card Hand System More Dynamic (swap around cards, place cards in spots that make sense)

  If mouse movement isnt fixed in Firefox, switch to manual smoothing.

  Edit about page after contact card is taken
*/

import {config, elements} from './config.js'
import {state} from './state.js'
import {getTransformStringDrag, getTransformStringHand} from './transformHelper.js';
import {activate_card} from './Card.js';
import {create_sound, sounds} from './Sound.js'

window.config = config;

/**
 * Loads any possible state data from local storage
 * @todo Implement this function
 */
function load_data(){

}

/**
 * Saves state data to local storage
 * @todo Implement this function
 */
function save_data(){
  localStorage.cards = JSON.stringify(state.cards.map(card => card.name));
  localStorage.activeCard = state.activeCard.name;
}

/**
 * Initiates the whole site
 */
function init(){
  load_data();

  Object.keys(elements).forEach(key => {
    elements[key] = document.getElementById(key);
  });

  Object.keys(sounds).forEach(key => {
    sounds[key] = create_sound(`./assets/sounds/${key}.mp3`);
    elements.soundContainer.appendChild(sounds[key].ele);
  })

  //Updates DOM to any specific config elements
  elements.cardSlot.style.height = config.cardHeight + "px";
  elements.cardSlot.style.width = config.cardWidth + "px";
  elements.cardSlot.style.transform = `scale(${config.activeScale*0.98})`
  elements.cardSlot.style.marginLeft = `calc((21vw - ${config.cardWidth }px)/2)`;
  elements.cardSlot.style.marginTop =  `calc((60vh - ${config.cardHeight}px)/2)`;

  for(const ele of document.getElementsByClassName("card-container")){
    ele.style.width = config.cardWidth + "px";
    ele.style.height = config.cardHeight + "px";

    const actual_card = document.createElement("DIV");
    actual_card.classList.add("card");
    ele.appendChild(actual_card);
  };

  elements.playingArea.addEventListener("mouseup", evt => {   
    state.activeCard?.hideInfo();
    state.activeCard?.backToHand();

    state.draggedCard?.activate();
    state.activeCard = state.draggedCard;
    state.draggedCard = null;
  });

  elements.globalContainer.addEventListener("mouseup", evt=> {
    state.draggedCard?.backToHand();
    state.draggedCard = null;
    elements.globalContainer.style.cursor = "auto";
  });

  elements.globalContainer.addEventListener("mousemove", evt => {
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
  })
  requestAnimationFrame(updateCardPositions);
};
window.addEventListener("load",init);

/**
 * Updates the transform of every card (doesnt have to be too often thanks to css transitions)
 */
let lastTime;
function updateCardPositions(time){
  requestAnimationFrame(updateCardPositions);
  if(lastTime != null && time - lastTime < config.updateInterval) return;
  lastTime = time;

  //Dragged Card
  if(state.draggedCard) {
    state.draggedCard.element.style.transform = getTransformStringDrag();
  }
  
  //Cards in Hand
  const amountOfCards = state.cards.length - (!!state.activeCard) - (state.draggedCard && state.mouse.distance > 300) - 1;
  const angleDif = (amountOfCards) ? config.cardHandAngle/amountOfCards : 0;
  let currentAngle = (amountOfCards) ? -config.cardHandAngle/2 : 0;
  let draggedCardSkipped = false;
  for (const Card of state.cards){
    if(Card.status) continue;
    if(!draggedCardSkipped &&state.draggedCard && state.mouse.distance < 300 && currentAngle > state.mouse.angle){
      currentAngle += angleDif;
      draggedCardSkipped = true;
    }
    Card.element.style.transform = getTransformStringHand(currentAngle, Card.sameAs(state.mouse_over_card) && !state.draggedCard);
    currentAngle+=angleDif;
  };

  if(state.mouse_over_card?.classList.contains("down")) {
    state.cards.push(activate_card(state.mouse_over_card));
    if(state.cards.length == 3) {
      elements.globalContainer.classList.remove("start");
      sounds.draw.play();
    }
    state.cards.sort((a,b) => {
      return a.index - b.index;
    })
  }
};