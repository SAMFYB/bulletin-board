// draggable div modified

function draggable(ele, on_mouse_down, before_drag, after_drag) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  ele.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves
    document.onmousemove = elementDrag;

    if (typeof on_mouse_down === 'function')
      on_mouse_down();
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    if (typeof before_drag === 'function')
      before_drag()

    // calculate the new cursor position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position
    ele.style.top = (ele.offsetTop - pos2) + 'px';
    ele.style.left = (ele.offsetLeft - pos1) + 'px';

    if (typeof after_drag === 'function')
      after_drag()
  }

  function closeDragElement() {
    // stop moving when mouse button is released
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
