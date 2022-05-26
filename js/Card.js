import {config, elements, state} from './config.js';
import { getTransformStringDrag,getRandomTransform } from './transformHelper.js';


export class Card {
    constructor(name){
        this.index = state.cards.length;
        
        this.name = name;

        this.status = 0; //0 is in hand, 1 is dragging, 2 is in active slot

        this.element = document.createElement("div");
        this.element.classList.add("card");
        this.element.style.height = config.cardHeight + "px";
        this.element.style.width = config.cardWidth + "px";
        this.element.style.bottom = "-" + (config.cardHandRadius + 2) + "px";
        this.element.style.backgroundImage = `url(assets/cards/${name}.png)`;
        this.element.style.backgroundPosition = "center";
        this.element.style.backgroundColor = "#CCCCCC";
        this.element.addEventListener("mousedown", () => {this.pickUp()});
        this.element.addEventListener("mouseup", () => {if(this.status == 2) {elements.playingArea.dispatchEvent(new Event('mouseup'))}});

        this.infoElement = document.getElementsByClassName(name)?.[0];
        if(this.infoElement) this.infoElement.style.transform = getRandomTransform();

        this.hasIframe = this.infoElement?.lastElementChild?.tagName?.toLowerCase() == "iframe";
        this.iframeTimeout = null;

        elements.globalContainer.appendChild(this.element);

    };

    activate(){
        this.status = 2;

        this.element.classList.remove("drag");
        this.element.classList.add("active");
        this.element.style.transform = `translate(calc(4vw + (21vw - ${config.cardWidth }px)/2), calc(20vh + (60vh - ${config.cardHeight}px)/2)) scale(${config.activeScale})`;

        this.showInfo();
    }


    setStatus(code){ //So you can do optional left hand chaining
        this.status = code;
    }

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
    };
    
    hideInfo(){
        if(this.hasIframe){
            this.iframeTimeout = setTimeout(() => {
                this.infoElement.lastElementChild.src = "";
            }, 500);
        }

        this.infoElement.style.transform = getRandomTransform();
        this.infoElement.classList.add("hidden");
    };

    backToHand(){
        this.status = 0;
        this.element.classList.remove("active");
        this.element.classList.remove("drag");
    }

    showInfo(){
        if(this.hasIframe){
            clearTimeout(this.iframeTimeout);
            this.infoElement.lastElementChild.src = config[this.name]();
        }

        this.infoElement.style.transform = "";
        this.infoElement.classList.remove("hidden");
    };
}