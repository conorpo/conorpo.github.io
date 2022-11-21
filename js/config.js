/**
 * @typedef {Object} Config
 * @property {number} updateInterval The time between updates in ms
 * @property {number} cardDealSpeed The amount of updates between card deals
 * @property {number} cardHandAngle The total angle of the card hand facing directy up
 * @property {number} cardHandRadius The radius of the imaginary circle that the cards in the hand are on
 * @property {number} cardWidth The width in pixels of a card
 * @property {number} cardHeight The height in pixels of a card
 * @property {number} wobbleIntensity The angle at which a dragged card wobbles in degrees
 * @property {number} wobbleSpeed An arbitrary value which is proportional to the speed at which a dragged card wobbles
 * @property {number} activeScale A multipler to the scale of dragged and active cards
 */
/**
 * The main config settings
 * @type {Config}
 * @todo Move the 2 iframe url makers to a differnt object
 */
export const config = {
  updateInterval: 15,
  cardDealSpeed: 8,

  cardHandAngle: 40, 
  cardHandRadius: 500,
  cardWidth: 180,//(window.innerHeight/4)*(3/5),
  cardHeight: 300,//window.innerHeight/4,

  wobbleIntensity: 17,
  wobbleSpeed: 3,

  activeScale: 1.20,

  thisSite: () => `index.html?${!location.search ? 1 : Number(location.search.split("?").pop()) + 1}`,
  mandelbulb: () => `https://conorpo.github.io/webgl_mandelbulb/`,
  resume: () => `./assets/resume.pdf`,
};



/**
 * @typedef {Object} Elements
 * @property {HTMLElement} globalContainer The html div that contains everything
 * @property {HTMLElement} playingArea The html div where cards can be played
 * @property {HTMLElement} thisSite The iframe that is used to display the site recursively
 * @property {HTMLElement} cardSlot The actual dashed out slot html div where active cards go
 * @property {HTMLElement} cardTemplate The HTML element to be copied when making cards
 */
/**
 * A collection of HTML elements that we access often in code
 * @type {Elements}
 */
export const elements = {
  globalContainer: null, playingArea:null , thisSite:null , cardSlot:null, soundContainer:null
}

