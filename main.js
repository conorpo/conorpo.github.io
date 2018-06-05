var x = window.matchMedia("(max-width: 810px)");
function init(){
  var main = document.getElementsByClassName("project");
  for(var i = 0; i<main.length;i++){
    var child = main[i];
    var height = child.children[0].height;
    if(!x.matches){
        child.children[1].style.lineHeight = height + "px";
        child.children[1].style.fontSize = height/2+ "px";
    }
    else{
      child.children[1].style.fontSize = "7vw";
      child.children[1].style.lineHeight = "7vw";
    }
    //child.children[2].style.margin = (height/4)-2+"px"+" 0";
  }
}
