let menuVisible = false;


$(document).ready(function() {

  window.addEventListener("contextmenu", e => {
    e.preventDefault();
  });

  const menu = document.getElementById("menu");
  let menuVisible = false;

  const toggleMenu = command => {
    menu.style.display = command === "show" ? "block" : "none";
    menuVisible = !menuVisible;
  };

  window.addEventListener("contextmenu", e => {
    e.preventDefault();
    const origin = {
      left: e.pageX,
      top: e.pageY
    };
    setPosition(origin);
    return false;
  });


  const setPosition = ({ top, left }) => {
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    toggleMenu('show');
  };

  window.addEventListener("click", e => {
    if(menuVisible)toggleMenu("hide");
  });

});
