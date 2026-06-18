(function () {
  "use strict";
  document.addEventListener("mousemove", event => {
    const zoom = event.target.closest("[data-zoom]");
    if (!zoom) return;
    const img = zoom.querySelector("img");
    const rect = zoom.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
    img.style.transform = "scale(1.75)";
  });
  document.addEventListener("mouseleave", event => {
    const zoom = event.target.closest?.("[data-zoom]");
    if (!zoom) return;
    const img = zoom.querySelector("img");
    img.style.transform = "scale(1)";
  }, true);
})();
