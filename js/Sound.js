const sound_proto = {
    play(){
        this.ele.play();
    },
    stop(){
        this.ele.stop();
    }
};

export function create_sound(src){
   const sound = Object.create(sound_proto);
   sound.ele = document.createElement("audio");
   sound.ele.classList.add("sound");
   sound.ele.src = src;
   sound.ele.setAttribute("preload","auto");
   sound.ele.setAttribute("controls","none");
   return sound;
}

export const sounds = {
    flip: null,
    pickup: null,
    place: null,
    draw: null
}