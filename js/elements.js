
/**
 * @module elements
 * @description Gets elements from the DOM
*/

/** @type {Map<String,HTMLElement>} */
export const elements = new Map();

/**
 * Finds elements by ids
 * @param {string[]} keys The ids of the elements to find
 * @returns {Promise<void>} A promise that resolves when all elements are found, or rejects if an element is not found
*/
export async function findElements(keys){
    return new Promise((resolve, reject) => {
        keys.forEach(key => {
            const ele = document.getElementById(key);
            if(ele == null) reject(`Element with id ${key} not found`);
            elements.set(key, ele);
        });
        resolve();
    });
}