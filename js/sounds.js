/**
 * @module sounds
 * @description Handles the sounds
 */

/** 
 * @typedef {Object} Sound
 * @property {function} play Plays the sound
 * @property {function} stop Stops playing the sound
 * @property {HTMLAudioElement} ele The HTML audio element
 * The sound object
*/

/** @type {Map<String,Sound>} */
export const sounds = new Map();

/**
 * Creates sound elements
 * @param {string[]} names The names of the sounds to create
 * @param {HTMLElement} parent The parent to append the sounds to
 * @returns {Map<String,Sound>} An object with the names as keys and the sound objects as values
*/
export function createSoundElements(names, parent){
    names.forEach(name => {
        const [soundName, fileType] = name.split(".")
        const sound = createSound(`./assets/sounds/${soundName}.${fileType}`);
        sounds.set(soundName, sound);
        parent.appendChild(sound.ele);
    });
}


/** @type {Sound} */
const sound_proto = {
    ele: null,
    play(){
        this.ele.play();
    },
    stop(){
        this.ele.stop();
    },
};


/**
 * Creates a sound object
 * @param {string} src The source of the sound
 * @returns {Sound} The sound object
*/
function createSound(src){
   /** @type {Sound} */
   const sound = Object.create(sound_proto);
   sound.ele = document.createElement("audio");
   sound.ele.classList.add("sound");
   sound.ele.src = src;
   sound.ele.setAttribute("preload","auto");
   sound.ele.setAttribute("controls","none");
   return sound;
}
