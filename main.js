/*
  TODO

  Make Card Hand System More Dynamic (swap around cards, place cards in spots that make sense)

  REDO Z-Index Event Bubling So Its Not Shit

  Make Card Placement Dynamic

  Clean Up Code Overall
*/

const config = {
  updateInterval: 20,
  cardDealSpeed: 8,

  cardHandAngle: 30,
  cardHandRadius: 500,
  cardWidth: 120,
  cardHeight: 200,

  wobbleIntensity: 10,
  wobbleSpeed: 3
};

const elements = {
  globalContainer: null,
  playingArea: null
}

const state = {
  mouse: {x: 0, y: 0},
  cards: [],
  draggedCardIndex: -1,
  activeCardIndex: -1,
  cardQueue: []
}

function getTransformStringHand(angle){
  return `translate(${window.innerWidth/2}px, ${window.innerHeight + config.cardHandRadius - config.cardHeight}px) rotate(${angle}deg) translateY(-${config.cardHandRadius}px)`;
}

function getTransformStringDrag(){
  const angle = (frame*config.wobbleSpeed/1000)%(2*Math.PI);
  return `translate(${state.mouse.x - config.cardWidth/2}px, ${state.mouse.y - config.cardHeight/2}px) scale(1.1)  rotate3d(${Math.sin(angle)},${Math.cos(angle)},0, ${config.wobbleIntensity}deg)`;
}

function getRandomTransform(){
  return `rotate(${Math.random()*60 + -30}deg) scale(${Math.random()*3 + 0.3})`;
}

function init(){
  elements.globalContainer = document.getElementById("global-container");
  elements.playingArea = document.getElementById("playing-area");

  elements.playingArea.addEventListener("mouseup", evt => {
    console.log("A");
    if(state.activeCardIndex != -1){
      state.cards[state.activeCardIndex].infoElement.classList.add("hidden");
      state.cards[state.activeCardIndex].infoElement.style.transform = getRandomTransform();
    }

    if(state.draggedCardIndex != -1){
      state.cards[state.draggedCardIndex].element.classList.remove("drag");
      state.cards[state.draggedCardIndex].element.style.transform = "translate(7.55vw, 30vh)"
      state.activeCardIndex = state.draggedCardIndex;
      state.draggedCardIndex = -1;  
      state.cards[state.activeCardIndex].infoElement.classList.remove("hidden");
      state.cards[state.activeCardIndex].infoElement.style.transform = "";

    }
  });

  elements.globalContainer.addEventListener("mouseup", evt=> {
    console.log("B");
    if(state.draggedCardIndex != -1){
      state.cards[state.draggedCardIndex].element.classList.remove("drag");
      state.draggedCardIndex = -1;
    }
    elements.globalContainer.style.cursor = "auto";
  });

  elements.globalContainer.addEventListener("mousemove", evt => {
    state.mouse.x = evt.clientX;
    state.mouse.y = evt.clientY;
  })

  state.cardQueue = ["about", "projects", "school"];
  setInterval(updateCardPositions, config.updateInterval);
}

function makeCard(name){
  const index = state.cards.length;

  //Basic
  const element = document.createElement("div");
  const infoElement = document.getElementsByClassName(name)[0];
  infoElement.style.transform = getRandomTransform();
  element.classList.add("card");
  element.innerText = name;
  element.style.height = config.cardHeight + "px";
  element.style.width = config.cardWidth + "px";
  element.style.bottom = "-" + (config.cardHandRadius + 2) + "px";
  
  //Dragging
  element.addEventListener("mousedown", evt => {
    state.draggedCardIndex = index;
    evt.target.classList.add("drag");
    evt.target.transform = getTransformStringDrag();
    elements.globalContainer.style.cursor = "pointer";

    if(index == state.activeCardIndex){
      state.cards[state.activeCardIndex].infoElement.style.transform = getRandomTransform();
      state.activeCardIndex = -1;
      state.cards[index].infoElement.classList.add("hidden");
    }
  })
  
  elements.globalContainer.appendChild(element);
  state.cards.push({name, element, infoElement});
}

let frame = 0;
function updateCardPositions(){
  frame += config.updateInterval;

  //Dragged Card
  if(state.draggedCardIndex != -1) {
    state.cards[state.draggedCardIndex].element.style.transform = getTransformStringDrag();
  }

  //Cards in Hand
  const amountOfCards = state.cards.length - (state.draggedCardIndex != -1) - (state.activeCardIndex != -1) - 1;
  const angleDif = (amountOfCards) ? config.cardHandAngle/amountOfCards : 0;
  let currentAngle = (amountOfCards) ? -config.cardHandAngle/2 : 0;
  for(let i = 0; i < state.cards.length; i++){
    if(i == state.draggedCardIndex || i == state.activeCardIndex) continue;
    state.cards[i].element.style.transform = getTransformStringHand(currentAngle);
    currentAngle+=angleDif;
  }

  if(state.cardQueue.length && frame%(config.updateInterval*config.cardDealSpeed) == 0){
    makeCard(state.cardQueue[0]);
    state.cardQueue.shift();
  }
}