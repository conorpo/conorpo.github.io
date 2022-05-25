/*
  TODO

  Make Card Hand System More Dynamic (swap around cards, place cards in spots that make sense)

  Make Card Placement Dynamic

  Implement Draw Pile (Figure out how this will work with Card Hand System)
*/

import {config, elements, state} from './config.js'
import {getTransformStringDrag, getTransformStringHand} from './transformHelper.js';
import {Card} from './card.js';


function init(){
  elements.globalContainer = document.getElementById("global-container");
  elements.playingArea = document.getElementById("playing-area");
  elements.cardSlot = document.getElementById("card-slot");

  elements.cardSlot.style.height = config.cardHeight + "px";
  elements.cardSlot.style.width = config.cardWidth + "px";
  elements.cardSlot.style.transform = `scale(${config.activeScale*0.98})`
  elements.cardSlot.style.marginLeft = `calc((21vw - ${config.cardWidth }px)/2)`;
  elements.cardSlot.style.marginTop =  `calc((60vh - ${config.cardHeight}px)/2)`;

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
    state.mouse.angle = Math.atan((state.mouse.x-window.innerWidth/2)/(window.innerHeight-state.mouse.y)) / Math.PI * 180;
    state.mouse.distance = Math.sqrt(Math.pow((state.mouse.x-window.innerWidth/2),2) + Math.pow(window.innerHeight-state.mouse.y,2));
  })

  window.addEventListener("keypress",(evt) => {
    console.log(evt.key)
    if(evt.key == 'k'){
      if(state.tableMode){
        elements.globalContainer.classList.add("global-container2");
      }else{
        elements.globalContainer.classList.remove("global-container2");
      }
      state.tableMode = !state.tableMode;
    }
  })

  state.cardQueue = ["about", "projects", "school", "this_site", "mandelbulb"];
  setInterval(updateCardPositions, config.updateInterval);
};
window.addEventListener("load",init);

let frame = 0;
function updateCardPositions(){
  frame += config.updateInterval;

  //Dragged Card
  if(state.draggedCard) {
    state.draggedCard.element.style.transform = getTransformStringDrag(frame);
  }

  //Cards in Hand
  const amountOfCards = state.cards.length - (state.draggedCardIndex != -1) - (state.activeCardIndex != -1) - 1 + (state.draggedCardIndex != -1 && state.mouse.distance < 300);
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

  if(state.cardQueue.length && frame%(config.updateInterval*config.cardDealSpeed) == 0){
    const new_card = new Card(state.cardQueue[0]);
    state.cards.push(new_card);
    state.cardQueue.shift();
  };
};