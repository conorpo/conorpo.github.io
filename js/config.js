/**
 * @module config
 * @description Holds the main config for the site
 */

/**
 * @typedef {Object} Config
 * @property {number} cardUpdateInterval The time between updates in ms
 * @property {number} cardDealSpeed The amount of updates between card deals
 * @property {number} cardHandAngle The total angle of the card hand facing directy up
 * @property {number} cardHandRadius The radius of the imaginary circle that the cards in the hand are on
 * @property {number} cardWidth The width in pixels of a card
 * @property {number} cardHeight The height in pixels of a card
 * @property {number} wobbleIntensity The angle at which a dragged card wobbles in degrees
 * @property {number} wobbleSpeed An arbitrary value which is proportional to the speed at which a dragged card wobbles
 * @property {number} activeScale A multipler to the scale of dragged and active cards
 * 
 * @property {function} updateCSS Updates the css variables that are based on the config
 */
/**
 * The main config settings
 * @type {Config}
 * @todo Move the 2 iframe url makers to a differnt object
 */
export const config = {
  cardUpdateInterval: 15,
  cardDealSpeed: 8,

  cardHandAngle: 40, 
  cardHandRadius: 1100,
  cardWidth: window.matchMedia("(max-width:1399px)").matches ? 90 : 150,//(window.innerHeight/4)*(3/5),
  cardHeight: window.matchMedia("(max-width:1399px)").matches ? 150 : 250,//window.innerHeight/4,

  wobbleIntensity: 17,
  wobbleSpeed: 3,

  activeScale: 1.20,
  /** Updates */
  updateCSS() {
    document.documentElement.style.setProperty('--cardWidth', `${this.cardWidth}px`);
    document.documentElement.style.setProperty('--cardHeight', `${this.cardHeight}px`);
    document.documentElement.style.setProperty('--activeScale', `${this.activeScale}`);
  }
};

// @ts-ignore
window.config = config;