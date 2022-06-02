/*
  TODO

  Make Card Hand System More Dynamic (swap around cards, place cards in spots that make sense)

  Make Card Placement Dynamic

  Implement Draw Pile (Figure out how this will work with Card Hand System)

  Turn Card into Nested Div for Shadows, move parent, rotate child
*/

import {config, elements} from './config.js'
import {state} from './state.js'
import {getTransformStringDrag, getTransformStringHand} from './transformHelper.js';
import {create_card} from './Card.js';

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

  //Updates DOM to any specific config elements
  elements.cardSlot.style.height = config.cardHeight + "px";
  elements.cardSlot.style.width = config.cardWidth + "px";
  elements.cardSlot.style.transform = `scale(${config.activeScale*0.98})`
  elements.cardSlot.style.marginLeft = `calc((21vw - ${config.cardWidth }px)/2)`;
  elements.cardSlot.style.marginTop =  `calc((60vh - ${config.cardHeight}px)/2)`;
  elements.cardTemplate.style.height = config.cardHeight + "px";
  elements.cardTemplate.style.width = config.cardWidth + "px";

  elements.playingArea.addEventListener("mouseup", evt => {   
    state.activeCard?.hideInfo();
    state.activeCard?.backToHand();

    console.log(state.draggedCard);
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
    state.mouse.angle = Math.atan((state.mouse.x-window.innerWidth/2)/(window.innerHeight-state.mouse.y)) / Math.PI * 180;
    state.mouse.distance = Math.sqrt(Math.pow((state.mouse.x-window.innerWidth/2),2) + Math.pow(window.innerHeight-state.mouse.y,2));
  })

  window.addEventListener("keypress",(evt) => {
    if(evt.key == 'k'){
      if(!state.tableMode){
        elements.globalContainer.classList.add("global-container2");
      }else{
        elements.globalContainer.classList.remove("global-container2");
      }
      state.tableMode = !state.tableMode;
    }
  })

  state.cardQueue = ["about", "projects", "contact", "resume", "thisSite", "mandelbulb"];
  setInterval(updateCardPositions, config.updateInterval);
};
window.addEventListener("load",init);

/**
 * Updates the transform of every card (doesnt have to be too often thanks to css transitions)
 */
function updateCardPositions(){
  state.frame += config.updateInterval;

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
    Card.element.style.transform = getTransformStringHand(currentAngle);
    currentAngle+=angleDif;
  };

  if(state.cardQueue.length && state.frame%(config.updateInterval*config.cardDealSpeed) == 0){
    const new_card = create_card(state.cardQueue[0]);
    state.cards.push(new_card);
    state.cardQueue.shift();
  };
};