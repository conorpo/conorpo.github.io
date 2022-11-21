import {config, elements} from './config.js';
import {state} from './state.js';
import { getTransformStringDrag } from './transformHelper.js';
import {sounds} from './Sound.js'


const card_proto = {
    activate() {
        this.status = 2;

        sounds.place.play();

        this.element.classList.remove("drag");
        this.element.classList.add("active");
        this.element.style.transform = `translate(calc(4vw + (21vw - ${config.cardWidth }px)/2), calc(20vh + (60vh - ${config.cardHeight}px)/2)) scale(${config.activeScale})`;

        this.showInfo();
    },
    /**
     * Status setter so that optional chaning can be used
     * @param {number} code The code to set, (0 is in hand, 1 is dragging, 2 is in active slot) 
     */
    setStatus(code){ 
        this.status = code;
    },
    pickUp(){
        sounds.pickup.play();

        state.draggedCard = this;

        this.element.classList.add("drag");
        this.element.style.transform = getTransformStringDrag();
        
        elements.globalContainer.style.cursor = "pointer";

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
            console.log("test");
            clearTimeout(this.iframeTimeout);
            this.infoElement.lastElementChild.src = config[this.name]();
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

export function activate_card(ele) {
    const card = Object.create(card_proto);
    
    sounds.flip.play();
    
    card.index = ele.getAttribute("data-cardindex");
    
    /** This is what's used to find the corresponding image and info element */
    card.name = ele.getAttribute("data-cardname");
    
    /** 0 is in hand, 1 is being dragged, 2 is active in slot */
    card.setStatus(0);
    
    /** The actual HTML element of the card */
    card.element = ele;
    card.element.style.setProperty('--image-url', `center/100% url(assets/cards/${card.name}.png)`);
    card.element.classList.add("hand");
    card.element.classList.remove("down");
    card.element.addEventListener("mousedown", () => {card.pickUp()});
    card.element.addEventListener("mouseup", () => {if(card.status == 2) {elements.playingArea.dispatchEvent(new Event('mouseup'))}});
    
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