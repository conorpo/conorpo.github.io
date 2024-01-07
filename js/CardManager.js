import { CardState, card_proto } from "./Card.js";
import { elements } from "./elements.js";
import { sounds } from "./sounds.js";
import { config } from "./config.js";
import { mouse } from "./mouse.js";

import { getTransformStringDrag, getTransformStringHand, getTransformStringPlayingArea, getRandomTransformString } from "./transformHelper.js";
/**
 * @typedef {import("./Card.js").Card} Card
*/

/**
 * @type {Object<string, Card>}
 * @description A map of the card names to the card objects
 */
export const cards = {};


/**
 * @type {Map<Card, Array<Card>>}
 * @description A map of the info elements to the card objects that they contain
*/
const info_card_map = new Map();

/**
 * The card that is currently in the playing slot
 * @type {Card} 
*/
export let played_card = null;

/**
 * The card that is currently being dragged
 * @type {Card}
*/
export let dragged_card = null;

/**
 * The card that the mouse is currently over
 * @type {Card}
*/
export let mouse_over_card = null;

/**
 * @callback state_transition_func
 * @param {Card} card The card to get the state transition for
*/
/**
 * Edges of the state transition graph
 * @type {Array<Array<state_transition_func>>}
*/
const state_transition = Array.apply(null, Array(5)).map(() => Array.apply(null, Array(5)).map(() => null));

state_transition[CardState.DOWN_NOT_VISIBLE][CardState.DOWN_VISIBLE] = (card) => {
    card.element.classList.remove("hidden");
};

state_transition[CardState.DOWN_VISIBLE][CardState.DOWN_NOT_VISIBLE] = (card) => {
    card.element.classList.add("hidden");
};

state_transition[CardState.DOWN_VISIBLE][CardState.IN_HAND] = (card) => {
    card.element.classList.add("hand");
    card.element.classList.remove("down");
    
    sounds.get("flip").play();

    card.element.removeEventListener("mouseenter", card.findListener);

    //Remove card from info_card_map, since it has been found
    const new_attached_cards = info_card_map.get(played_card).filter(c => c != card);
    info_card_map.set(played_card, new_attached_cards);
    if(played_card == null && new_attached_cards.length == 0) {
        //All cards on start page have been found
        elements.get("globalContainer").classList.remove("start");
    }
};

state_transition[CardState.IN_HAND][CardState.DRAGGING] = (card) => {
    card.element.classList.add("drag");
    dragged_card = card;
    
    sounds.get("pickup").play();

    elements.get("globalContainer").style.cursor = "grabbing";
};

state_transition[CardState.DRAGGING][CardState.IN_HAND] = (card) => {
    card.element.classList.remove("drag");
    dragged_card = null;

    elements.get("globalContainer").style.cursor = "auto";
};

state_transition[CardState.DRAGGING][CardState.ACTIVE] = (card) => {
    dragged_card = null;

    if(played_card) set_status(played_card, CardState.IN_HAND);
    played_card = card;
    
    card.element.classList.add("active");
    card.element.classList.remove("drag");

    elements.get("globalContainer").style.cursor = "auto";
    card.element.style.transform = getTransformStringPlayingArea();

    //Info Element
    card.infoElement.classList.remove("hidden");
    if(card.iframeElement) card.iframeElement.src = card.iframeSrcFunc();
    const attached_cards = info_card_map.get(card);
    if(attached_cards) {
        for(const card of attached_cards){
            set_status(card, CardState.DOWN_VISIBLE);
        }
    }
};

state_transition[CardState.ACTIVE][CardState.IN_HAND] = (card) => {
    card.element.classList.remove("active");
    played_card = null;
    
    card.infoElement.classList.add("hidden");
    if(card.iframeElement) card.iframeElement.src = "";
    const attached_cards = info_card_map.get(card);
    if(attached_cards) {
        for(const card of attached_cards){
            set_status(card, CardState.DOWN_NOT_VISIBLE);
        }
    }
};

state_transition[CardState.ACTIVE][CardState.DRAGGING] = (card) => {
    card.element.classList.add("drag");
    card.element.classList.remove("active");
    dragged_card = card;
    played_card = null;

    elements.get("globalContainer").style.cursor = "grabbing";

    card.infoElement.classList.add("hidden");
    if(card.iframeElement) card.iframeElement.src = "";
    const attached_cards = info_card_map.get(card);
    if(attached_cards) {
        for(const card of attached_cards){
            set_status(card, CardState.DOWN_NOT_VISIBLE);
        }
    }
};

/**
 * Performs the status transition for a card
 * @param {Card} card The card to set the status of
 * @param {CardState} status The status to set it to
*/
export function set_status(card, status) {
    // console.log(status);
    // console.log(card);
    console.log(`Setting ${card.name} to ${Object.entries(CardState).find(([key, value]) => value == status)[0]}`);
    if(!state_transition[card.status][status]) throw new Error(`No state transition from ${card.status} to ${status}`);
    state_transition[card.status][status](card)
    card.status = status;
};


/**
 * All cards on the site are defined here (order is defined here too)
*/
export function create_cards(){
    cards.about = create_card("about")
    cards.projects = create_card("projects")
    cards.resume = create_card("resume", () => "./assets/resume.pdf")
    cards.mandelbulb = create_card("mandelbulb", () => "https://conorpo.github.io/webgl_mandelbulb/")
    cards.thisSite = create_card("thisSite", () => `index.html?${!location.search ? 1 : Number(location.search.split("?").pop()) + 1}`)
    cards.climbing = create_card("climbing")
    cards.contact = create_card("contact")
    cards.knightHacks = create_card("knightHacks")
    cards.marchingcubes = create_card("marchingcubes", () => "https://conorpo.github.io/marching-cubes-webgpu")
    cards.ptGpt = create_card("ptGpt", () => "https://pt-gpt.com/")

    info_card_map.set(null, [cards.about, cards.projects, cards.resume]);
    info_card_map.set(cards.about, [cards.contact, cards.climbing]);
    info_card_map.set(cards.projects, [cards.mandelbulb, cards.thisSite, cards.knightHacks, cards.marchingcubes, cards.ptGpt]);

    info_card_map.get(null).forEach(card => {
        set_status(card, CardState.DOWN_VISIBLE);
    });
};

/**
 * Creates a card object
 * @param {string} name The name of the card
 * @param {function} [iframeSrcFunc] The function to get the iframe src (if this is not included, it is assumed that the card does not have an iframe)
 * @returns {Card} The card object
 */
function create_card(name, iframeSrcFunc) {
    /** @type {Card} */
    const card = Object.create(card_proto);

    card.name = name;
    card.iframeSrcFunc = iframeSrcFunc;
    card.status = CardState.DOWN_NOT_VISIBLE;
        
    /** The actual HTML element of the card */
    card.element = document.createElement("DIV");
    card.element.classList.add("card-container", "down","hidden");
    card.element.style.setProperty('--image-url', `center/100% url(assets/cards/${card.name}.webp)`);
    card.element.style.transform = getRandomTransformString();

    card.element.addEventListener("mousedown", () => {set_status(card, CardState.DRAGGING)});
    card.element.addEventListener("mouseup", () => {if(card.status == CardState.ACTIVE) {elements.get("playingArea").dispatchEvent(new Event('mouseup'))}});
    card.findListener = () => {set_status(card, CardState.IN_HAND)};
    card.element.addEventListener("mouseenter", card.findListener);
    card.element.addEventListener("mouseenter", () => {mouse_over_card = card});
    card.element.addEventListener("mouseleave", () => {mouse_over_card = null});
    
    /** The corresponding html info element that is revealed when card is active */
    card.infoElement = document.getElementById(`${card.name}Info`);
    if(!(card.infoElement instanceof HTMLElement)) throw new ReferenceError(`Info element for card ${card.name} not found`);
    const _iframeElement = document.getElementById(`${card.name}Iframe`);
    card.iframeElement = (iframeSrcFunc && _iframeElement instanceof HTMLIFrameElement) ? _iframeElement : null;
    if(!iframeSrcFunc != !card.iframeElement) throw new Error(`Either iframeSrcFunc or iframeElement is not defined for card ${card.name}`);
    
    /** Add it to the dom and cards object*/
    elements.get("globalContainer").appendChild(card.element);
    cards[card.name] = card;

    return card;
};

export function update_cards() {
    //Dragged Card
    if(dragged_card) dragged_card.element.style.transform = getTransformStringDrag();

    //Cards in Hand TODO: Make this not suck
    const amountOfCards = Object.values(cards).reduce((acc, card) => acc + ((card.status === CardState.IN_HAND) ? 1 : 0), 0) - 1;
    const angleDif = (amountOfCards) ? config.cardHandAngle/amountOfCards : 0;
    let currentAngle = (amountOfCards) ? -config.cardHandAngle/2 : 0;
    let draggedCardSkipped = false;
    for (const [key, Card] of Object.entries(cards)) {
        if(Card.status != CardState.IN_HAND) continue;
        if(!draggedCardSkipped && dragged_card && mouse.distance < 300 && currentAngle > mouse.angle){
            currentAngle += angleDif;
            draggedCardSkipped = true;
        }
        Card.element.style.transform = getTransformStringHand(currentAngle, (mouse_over_card?.name === Card.name) && !dragged_card);
        if(mouse_over_card?.name === Card.name) currentAngle += 4;
        currentAngle+=angleDif;
    };
}



