import {config} from './config.js';
import {state} from './state.js';
import { getTransformStringDrag } from './transformHelper.js';
import { sounds } from './sounds.js'
import {elements} from './elements.js';

/**
 * @module Card
 * @description Handles the cards
 * */


/** @typedef {Object} Card
 * @property {number} index The index of the card in the hand
 * @property {string} name The name of the card
 * @property {number} status The status of the card (0 is in hand, 1 is dragging, 2 is in active slot)
 * @property {HTMLElement} element The actual HTML element of the card
 * @property {HTMLElement} infoElement The corresponding html info element that is revealed when card is active
 * @property {boolean} hasIframe Whether the info element has an iframe
 * @property {number} iframeTimeout The timeout for the iframe
 * @property {function} iframeSrcFunc The function to get the iframe src
 * @property {function} activate Activates the card
 * @property {function} setStatus Sets the status of the card
 * @property {function} pickUp Picks up the card
 * @property {function} backToHand Returns the card to the hand
 * @property {function} showInfo Shows the info element
 * @property {function} hideInfo Hides the info element
 * @property {function} sameAs Checks if the card is the same as another card
 * The card object
 * */


/** @type {Card} */
const card_proto = {
    activate() {
        this.status = 2;

        sounds.get("place").play();

        this.element.classList.remove("drag");
        this.element.classList.add("active");
        this.element.style.transform = `translate(calc(4vw + (21vw - ${config.cardWidth }px)/2), calc(20vh + (60vh - ${config.cardHeight}px)/2)) scale(${config.activeScale})`;

        this.showInfo();

        window.location.hash = `#${this.name}`;
    },
    /**
     * Status setter so that optional chaning can be used
     * @param {number} code The code to set, (0 is in hand, 1 is dragging, 2 is in active slot) 
     */
    setStatus(code){ 
        this.status = code;
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
        state.mouse_over_card = null;
        this.element.classList.remove("active");
        this.element.classList.remove("drag");
    },
    showInfo(){
        if(this.hasIframe){
            clearTimeout(this.iframeTimeout);
            this.infoElement.lastElementChild.src = this.iframeSrcFunc();
        }

        this.infoElement.classList.remove("hidden");
        this.infoElement.getAttribute("data-cardsheld")?.split(" ").forEach(str => {
            console.log(str);
            document.getElementById(str+"Card")?.classList.remove("hidden");
        });
    },
    hideInfo(){
        if(this.hasIframe){
            this.iframeTimeout = setTimeout(() => {
                this.infoElement.lastElementChild.src = "";
            }, 500);
        }

        this.infoElement.classList.add("hidden");
        this.infoElement.getAttribute("data-cardsheld")?.split(" ").forEach(str => {
            document.getElementById(str+"Card")?.classList.add("hidden");
        });
    },
    sameAs(other){
        if(other == null || other == undefined) return false;
        return this.index == other.getAttribute("data-cardindex");
    }
}

export function create_cards(){
    const cards = [];
    cards.push()
    return cards;
}

/**
 * Creates a card object
 * @param {string} name The name of the card
 * @param {number} index The index of the card in the hand
 * @param {function} iframeSrcFunc The function to get the iframe src
 * @returns {Card} The card object
 */

export function create_card(name, index, iframeSrcFunc) {
    /** @type {Card} */
    const card = Object.create(card_proto);
    card.index = index;
    card.name = name;
    card.iframeSrcFunc = iframeSrcFunc;
        
    card.setStatus(0);
    
    /** The actual HTML element of the card */
    card.element = document.createElement("DIV");
    card.element.hidden = true;

    card.element.classList.add("card-container");
    card.element.style.setProperty('--image-url', `center/100% url(assets/cards/${card.name}.jpg)`);
    card.element.classList.add("hand");
    card.element.classList.remove("down");
    card.element.addEventListener("mousedown", () => {card.pickUp()});
    card.element.addEventListener("mouseup", () => {if(card.status == 2) {elements.get("playingArea").dispatchEvent(new Event('mouseup'))}});
    
    /** The corresponding html info element that is revealed when card is active */
    card.infoElement = document.getElementById(card.name+"Info");
    card.hasIframe = card.infoElement?.lastElementChild?.tagName?.toLowerCase() == "iframe";
    card.iframeTimeout = null;

    /** Remove the Card from any assocaited info elements */
    if(state.activeCard){
        let cardsHeldString = state.activeCard?.infoElement.getAttribute("data-cardsheld");
        cardsHeldString = cardsHeldString.replace(card.name,"").replace("  "," ").trim();
        state.activeCard?.infoElement.setAttribute("data-cardsheld", cardsHeldString);
    }

    return card;
}