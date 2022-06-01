import {config, elements} from './config.js';
import {state} from './state.js';
import { getTransformStringDrag,getRandomTransform } from './transformHelper.js';


const card_proto = {
    activate() {
        console.log(this);
        this.status = 2;

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
    hideInfo(){
        if(this.hasIframe){
            this.iframeTimeout = setTimeout(() => {
                this.infoElement.lastElementChild.src = "";
            }, 500);
        }

        this.infoElement.style.transform = getRandomTransform();
        this.infoElement.classList.add("hidden");
    },
    backToHand(){
        this.status = 0;
        this.element.classList.remove("active");
        this.element.classList.remove("drag");
    },
    showInfo(){
        if(this.hasIframe){
            clearTimeout(this.iframeTimeout);
            this.infoElement.lastElementChild.src = config[this.name]();
        }

        this.infoElement.style.transform = "";
        this.infoElement.classList.remove("hidden");
    }
}

export function create_card(name) {
    const card = Object.create(card_proto);

    card.index = state.cards.length;
    
    /** This is what's used to find the corresponding image and info element */
    card.name = name;
    
    /** 0 is in hand, 1 is being dragged, 2 is active in slot */
    card.status = 0; 

    /** The actual HTML element of the card */
    card.element = elements.cardTemplate.cloneNode(true);
    card.element.id = `${name}Card`;
    card.element.style.setProperty('--image-url', `center/100% url(assets/cards/${name}.png)`);
    card.element.addEventListener("mousedown", () => {card.pickUp()});
    card.element.addEventListener("mouseup", () => {if(card.status == 2) {elements.playingArea.dispatchEvent(new Event('mouseup'))}});

    /** The corresponding html info element that is revealed when card is active */
    card.infoElement = document.getElementsByClassName(name)?.[0];
    if(card.infoElement?.classList.contains("hidden")) card.infoElement.style.transform = getRandomTransform();

    card.hasIframe = card.infoElement?.lastElementChild?.tagName?.toLowerCase() == "iframe";
    card.iframeTimeout = null;

    elements.globalContainer.appendChild(card.element);

    return card;
}