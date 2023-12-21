/*
  TODO

  Make Card Hand System More Dynamic (swap around cards, place cards in spots that make sense)

  If mouse movement isnt fixed in Firefox, switch to manual smoothing.

  Edit about page after contact card is taken
*/

import {config} from './config.js'
import {state} from './state.js'
import {getTransformStringDrag, getTransformStringHand} from './transformHelper.js';
import {activate_card} from './Card.js';
import {createSoundElements, sounds} from './sounds.js'
import {findElements, elements} from './elements.js';
import { addMouseEventListeners } from './mouse.js';

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
(async function init(){
  load_data();

  config.updateCSS();

  try {
    await findElements(["globalContainer", "playingArea", "cardSlot", "soundContainer"]);
    await createSoundElements(["flip.mp3","pickup.mp3","place.mp3","draw.mp3"], elements.get("soundContainer"));
  } catch (error) {
    console.error(error);
    return;
  }

  addMouseEventListeners();

  for(const ele of document.getElementsByClassName("card-container")){
    const actual_card = document.createElement("DIV");
    actual_card.classList.add("card");
    ele.appendChild(actual_card);
  };

  requestAnimationFrame(updateCardPositions);

  if(window.location.hash) {
    const hash = window.location.hash.substring(1);
    state.cards.push(activate_card(document.getElementById(`${hash}Card`)));
    if(hash.localeCompare("about") != 0) state.cards.push(activate_card(document.getElementById(`aboutCard`)));
    if(hash.localeCompare("projects") != 0) state.cards.push(activate_card(document.getElementById(`projectsCard`)));
    if(hash.localeCompare("resume") != 0) state.cards.push(activate_card(document.getElementById(`resumeCard`)));
    elements.get("globalContainer").classList.remove("start");
    document.getElementById(`${hash}Card`).classList.remove("hidden");
    state.activeCard = state.cards[0];
    state.cards[0].activate();
    state.cards.sort((a,b) => {
      return a.index - b.index;
    })
    
  }
})();

/**
 * Updates the transform of every card (doesnt have to be too often thanks to css transitions)
*/
function updateCardPositions(time){
  requestAnimationFrame(updateCardPositions);
  if(state.lastTime != null && time - state.lastTime < config.updateInterval) return;
  state.lastTime = time;

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
    if(!draggedCardSkipped && state.draggedCard && state.mouse.distance < 300 && currentAngle > state.mouse.angle){
      currentAngle += angleDif;
      draggedCardSkipped = true;
    }
    Card.element.style.transform = getTransformStringHand(currentAngle, Card.sameAs(state.mouse_over_card) && !state.draggedCard);
    currentAngle+=angleDif;
  };

  if(state.mouse_over_card?.classList.contains("down")) {
    state.cards.push(activate_card(state.mouse_over_card));
    if(state.cards.length == 3) {
      elements.get("globalContainer").classList.remove("start");
      sounds.draw.play();
    }
    state.cards.sort((a,b) => {
      return a.index - b.index;
    })
  }
};