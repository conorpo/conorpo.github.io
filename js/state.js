/**
 * @module state
 * @description Handles the state of the site
 */


/**
 * @typedef {Object} State
 * @property {boolean} tableMode The current viewing mode
 * @property {number} frame The current frame for animations
 * @property {number} lastTime The last time that the update function was called 
*/

/**
 * The State of the Site 
 * @type {State} */
export const state = {
    tableMode: false,
    frame: 0,
    lastTime: 0,
}
  

export const save = {
    tableMode: false,
}