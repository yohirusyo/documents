export const dpi = (val) => {
  var div = document.createElement("div");
  div.style.display = "block";
  div.style.height = val;
  document.body.appendChild(div);
  var px = parseFloat(window.getComputedStyle(div, null).height);
  div.parentNode.removeChild(div);
  return Math.ceil(px);
};
