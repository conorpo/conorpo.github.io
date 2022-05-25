export const config = {
  updateInterval: 20,
  cardDealSpeed: 8,

  cardHandAngle: 40,
  cardHandRadius: 500,
  cardWidth: 150,//(window.innerHeight/4)*(3/5),
  cardHeight: 250,//window.innerHeight/4,

  wobbleIntensity: 17,
  wobbleSpeed: 3,

  activeScale: 1.20,

  this_site: () => `index.html?${!location.search ? 1 : Number(location.search.split("?").pop()) + 1}`,
  mandelbulb: () => `https://conorpo.github.io/webgl_mandelbulb/`
};
  
export const elements = {
  globalContainer: null,
  playingArea: null,
  thisSite: null
}

export const state = {
  mouse: {x: 0, y: 0, angle: 0, distance: 0},
  cards: [],
  draggedCardIndex: -1,
  activeCardIndex: -1,
  cardQueue: [],
  tableMode: false
}