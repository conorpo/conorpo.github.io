import {config} from './config.js';
import {state} from './state.js';
import { getTransformStringDrag } from './transformHelper.js';
import { sounds } from './sounds.js'
import {elements} from './elements.js';

/**
 * @module Card
 * @description Handles the cards
 * */


/** 
 * @typedef {Object} Card
 * @property {string} name The name of the card
 * @property {number} status The status of the card (0 is in hand, 1 is dragging, 2 is in active slot)
 * 
 * @property {HTMLElement} element The actual HTML element of the card
 * @property {HTMLElement} infoElement The corresponding html info element that is revealed when card is active
 * @property {HTMLIFrameElement} iframeElement The iframe element
 * @property {number} iframeTimeout The timeout for the iframe
 * @property {function} iframeSrcFunc The function to get the iframe src
 * 
 * @property {function} activate Activates the card
 * 
 * @property {function} pickUp Picks up the card
 * @property {function} backToHand Returns the card to the hand
 * 
 * @property {function} showInfo Shows the info element
 * @property {function} hideInfo Hides the info element
 * 
 * @property {function} updateTransform Updates the transform of the card
 * @description The card object
 * */


/** @type {Card} */
const card_proto = {
    // Assigned in create_card
    name: null, 
    status: null,

    element: null,
    infoElement: null,
    iframeElement: null,
    iframeTimeout: null,
    iframeSrcFunc: null,

    activate() {
        this.status = 2;

        sounds.get("place").play();

        this.element.classList.remove("drag");
        this.element.classList.add("active");
        this.element.style.transform = `translate(calc(4vw + (21vw - ${config.cardWidth }px)/2), calc(20vh + (60vh - ${config.cardHeight}px)/2)) scale(${config.activeScale})`;

        this.showInfo();

        window.location.hash = `#${this.name}`;
    },
    pickUp(){
        sounds.get("pickup").play();

        state.draggedCard = this;

        this.element.classList.add("drag");
        this.element.style.transform = getTransformStringDrag();
        
        elements.get("globalContainer").style.cursor = "pointer";

        if(this.status == 2){
            state.activeCard = null;
            this.hideInfo();
        }

        this.status = 1;
    },
    backToHand(){
        this.status = 0;
        this.element.classList.remove("active");
        this.element.classList.remove("drag");
    },
    showInfo(){
        this.infoElement.classList.remove("hidden");

        if(this.iframeElement){
            if(this.iframeTimeout) clearTimeout(this.iframeTimeout);
            this.iframeElement.src = this.iframeSrcFunc();
        }

        info_card_map.get(this)?.forEach(card => {
            card.element.classList.remove("hidden");
        });
    },
    hideInfo(){
        this.infoElement.classList.add("hidden");

        if(this.iframeElement){
            this.iframeTimeout = setTimeout(() => {
                this.iframeElement.src = "";
            }, 500);
        }

        info_card_map.get(this)?.forEach(card => {
            card.element.classList.add("hidden");
        });
    },
    updateTransform(string){
        this.element.style.transform = string;
    }
}

    
// <div id="marchingcubesCard" data-cardname="marchingcubes" data-cardindex=9 class="card-container down hidden" style="transform: translate(50vw,40vh) rotate(10deg);"></div>
// <div id="knightHacksCard" data-cardname="knightHacks" data-cardindex=8 class="card-container down hidden" style="transform: translate(50vw,40vh) rotate(10deg);"></div>
// <div id="contactCard" data-cardname="contact" data-cardindex=7  class="card-container down hidden" style="transform: translate(77.3vw,58vh) rotate(90deg);"></div>
// <div id="climbingCard" data-cardname="climbing" data-cardindex=6  class="card-container down hidden" style="transform: translate(38vw,44vh) rotate(-10deg);"></div>
// <div id="thisSiteCard" data-cardname="thisSite" data-cardindex=5  class="card-container down hidden" style="transform: translate(40vw,30vh) rotate(-10deg);"></div>
// <div id="mandelbulbCard" data-cardname="mandelbulb" data-cardindex=4  class="card-container down hidden" style="transform: translate(42vw,40vh) rotate(30deg);"></div>
// <div id="resumeCard" data-cardname="resume" data-cardindex=3  class="card-container down" style="transform: translate(52vw,46vh) rotate(-20deg);"></div>
// <div id="projectsCard" data-cardname="projects" data-cardindex=2  class="card-container down" style="transform: translate(40vw,41vh) rotate(30deg);"></div>
// <div id="aboutCard" data-cardname="about" data-cardindex=1 class="card-container down" style="transform: translate(47vw,35vh) rotate(-5deg);"></div>

/**
 * @type {Object<string, Card>}
 * @description A map of the card names to the card objects
 */
export const cards = {};

/**
 * @type {Map<HTMLElement, Card>}
 * @description A map of the card elements to the card objects
*/
export const element_card_map = new Map();

/**
 * @type {Map<Card, Array<Card>>}
 * @description A map of the info elements to the card objects that they contain
*/
const info_card_map = new Map();

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

    info_card_map.set(cards.about, [cards.contact, cards.climbing, cards.resume]);
    info_card_map.set(cards.projects, [cards.mandelbulb, cards.thisSite, cards.knightHacks, cards.marchingcubes]);
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
    card.status = 0; //0 is not found, 2 is in hand, 3 is dragging, 4 is in active slot
        
    /** The actual HTML element of the card */
    card.element = document.createElement("DIV");
    // card.element.hidden = true;
    card.element.classList.add("down");
    card.element.style.setProperty('--image-url', `center/100% url(assets/cards/${card.name}.webp)`);
    card.element.addEventListener("mousedown", () => {card.pickUp()});
    card.element.addEventListener("mouseup", () => {if(card.status == 2) {elements.get("playingArea").dispatchEvent(new Event('mouseup'))}});

    /** The corresponding html info element that is revealed when card is active */
    card.infoElement = document.getElementById(`${card.name}Info}`);
    if(!(card.infoElement instanceof HTMLElement)) throw new ReferenceError(`Info element for card ${card.name} not found`);
    const _iframeElement = document.getElementById(`${card.name}Iframe`);
    card.iframeElement = (iframeSrcFunc && _iframeElement instanceof HTMLIFrameElement) ? _iframeElement : null;
    if(!iframeSrcFunc != !card.iframeElement) throw new Error(`Either iframeSrcFunc or iframeElement is not defined for card ${card.name}`);
    
    /** Add it to the dom and cards object*/
    elements.get("globalContainer").appendChild(card.element);
    cards[card.name] = card;
    element_card_map.set(card.element, card);

    return card;
}