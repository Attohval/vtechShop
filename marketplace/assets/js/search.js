(function () {
  "use strict";
  function init() {
    document.addEventListener("input", event => {
      const input = event.target.closest("[data-search-form] input[name='q']");
      if (!input) return;
      const box = input.closest("[data-search-form]").querySelector("[data-suggestions]");
      const q = input.value.trim().toLowerCase();
      if (!q) { box.style.display = "none"; return; }
      const matches = window.JijiData.products.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0, 6);
      box.innerHTML = matches.map(p => `<button type="button" data-suggestion="${p.title}"><i class="fa-solid fa-magnifying-glass"></i> ${p.title}<small class="muted"> - ${p.location}</small></button>`).join("");
      box.style.display = matches.length ? "block" : "none";
    });
    document.addEventListener("click", event => {
      const suggestion = event.target.closest("[data-suggestion]");
      if (suggestion) {
        const form = suggestion.closest("[data-search-form]");
        form.querySelector("input[name='q']").value = suggestion.dataset.suggestion;
        form.querySelector("[data-suggestions]").style.display = "none";
      }
      const pageBtn = event.target.closest("[data-page-num]");
      if (pageBtn) {
        document.querySelectorAll("[data-page-num]").forEach(btn => btn.classList.remove("active"));
        pageBtn.classList.add("active");
        window.JijiToast?.(`Page ${pageBtn.dataset.pageNum} loaded`);
      }
      const apply = event.target.closest("[data-apply-filters]");
      if (apply) window.JijiToast?.("Filters applied to dummy listings");
    });
    document.addEventListener("submit", event => {
      const form = event.target.closest("[data-search-form]");
      if (!form) return;
      event.preventDefault();
      const q = encodeURIComponent(new FormData(form).get("q") || "");
      location.href = `search.html?q=${q}`;
    });
  }
  window.JijiSearch = { init };
})();
