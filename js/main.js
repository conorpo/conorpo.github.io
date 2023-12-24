import {config} from './config.js'
import {state} from './state.js'
import {getTransformStringDrag, getTransformStringHand} from './transformHelper.js';
import { create_cards } from './Card.js';
import {createSoundElements, sounds} from './sounds.js'
import {findElements, elements} from './elements.js';
import { addMouseEventListeners } from './mouse.js';
import { mouse } from './mouse.js';

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
    create_cards();
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

  // if(window.location.hash) {
  //   const hash = window.location.hash.substring(1);
  //   state.cards.push(create_card(document.getElementById(`${hash}Card`)));
  //   if(hash.localeCompare("about") != 0) state.cards.push(create_card(document.getElementById(`aboutCard`)));
  //   if(hash.localeCompare("projects") != 0) state.cards.push(create_card(document.getElementById(`projectsCard`)));
  //   if(hash.localeCompare("resume") != 0) state.cards.push(create_card(document.getElementById(`resumeCard`)));
  //   elements.get("globalContainer").classList.remove("start");
  //   document.getElementById(`${hash}Card`).classList.remove("hidden");
  //   state.activeCard = state.cards[0];
  //   state.cards[0].activate();
  //   state.cards.sort((a,b) => {
  //     return a.index - b.index;
  //   })    
  // }
})();

/**
 * Updates the transform of every card (doesnt have to be too often thanks to css transitions)
*/
function updateCardPositions(time){
  if(state.lastTime != null && time - state.lastTime < config.updateInterval) return;
  state.lastTime = time;

  //Dragged Card
  if(state.draggedCard) {
    state.draggedCard.element.style.transform = getTransformStringDrag();
  }
  
  //Cards in Hand
  const amountOfCards = state.cards.length - (!!state.activeCard) - (state.draggedCard && mouse.distance > 300) - 1;
  const angleDif = (amountOfCards) ? config.cardHandAngle/amountOfCards : 0;
  let currentAngle = (amountOfCards) ? -config.cardHandAngle/2 : 0;
  let draggedCardSkipped = false;
  for (const Card of state.cards){
    if(Card.status) continue;
    if(!draggedCardSkipped && state.draggedCard && mouse.distance < 300 && currentAngle > mouse.angle){
      currentAngle += angleDif;
      draggedCardSkipped = true;
    }
    Card.element.style.transform = getTransformStringHand(currentAngle, Card.sameAs(state.mouse_over_card) && !state.draggedCard);
    currentAngle+=angleDif;
  };

  requestAnimationFrame(updateCardPositions);
};