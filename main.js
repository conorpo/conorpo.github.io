function makeCard(name){
  const cardLayer = document.getElementById("card-layer");

  const element = document.createElement("div");
  element.classList.add("card");
  element.innerText = name;
  element.style.bottom = "-" + (config.cardHandRadius + 2) + "px";
  cardLayer.appendChild(element);

  state.cards.push({name, element});
}

const config = {
  cardHandAngle: 30,
  cardHandRadius: 500,
};

const state = {
  mouse: {x: 0, y: 0},
  cards: []
}

function getTransformString(angle){
  return `rotate(${angle}deg) translateY(-${config.cardHandRadius}px)`;
}

function init(){
  config.startingAngle = ((config.cardHandAngle/2 + 90)/360)*(Math.PI * 2);

  makeCard("Info");
  makeCard("Projects")
  makeCard("School");

  updateCardPositions();
}

function updateCardPositions(){
  const angleDif= config.cardHandAngle/(state.cards.length-1);
  let currentAngle = -config.cardHandAngle/2;
  state.cards.forEach((card, i) => {
    state.cards[i].element.style.transform = getTransformString(currentAngle);
    currentAngle+=angleDif;
  })
}

setInterval(updateCardPositions, 10);
