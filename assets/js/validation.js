(function () {
  "use strict";
  function init() {
    document.addEventListener("input", event => {
      const field = event.target.closest("input, textarea");
      if (!field) return;
      const wrap = field.closest(".field");
      if (wrap) validateField(field);
      const counter = wrap?.querySelector("[data-counter]");
      if (counter) counter.textContent = `${field.value.length}/${field.maxLength}`;
      const strength = wrap?.querySelector("[data-strength]");
      if (strength) updateStrength(strength, field.value);
    });
    document.addEventListener("submit", event => {
      const form = event.target.closest("[data-validate]");
      if (!form) return;
      event.preventDefault();
      const fields = Array.from(form.querySelectorAll("input[required], textarea[required]"));
      const valid = fields.every(validateField);
      const btn = form.querySelector("button[type='submit']");
      if (!valid) return;
      btn.disabled = true;
      btn.classList.add("btn-soft");
      setTimeout(() => {
        btn.disabled = false;
        btn.classList.remove("btn-soft");
        const success = form.querySelector("[data-form-success]");
        if (success) success.hidden = false;
        window.JijiToast?.("Form submitted successfully");
      }, 700);
    });
    document.addEventListener("click", event => {
      const btn = event.target.closest(".btn");
      if (!btn) return;
      const circle = document.createElement("span");
      circle.className = "ripple";
      const rect = btn.getBoundingClientRect();
      circle.style.left = `${event.clientX - rect.left - 10}px`;
      circle.style.top = `${event.clientY - rect.top - 10}px`;
      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 560);
    });
  }
  function validateField(field) {
    const error = field.closest(".field")?.querySelector(".error");
    let message = "";
    if (field.validity.valueMissing) message = "This field is required.";
    else if (field.validity.typeMismatch) message = "Enter a valid value.";
    else if (field.validity.tooShort) message = `Use at least ${field.minLength} characters.`;
    if (error) error.textContent = message;
    return !message;
  }
  function updateStrength(el, value) {
    let score = 0;
    if (value.length >= 8) score += 30;
    if (/[A-Z]/.test(value)) score += 20;
    if (/[0-9]/.test(value)) score += 20;
    if (/[^A-Za-z0-9]/.test(value)) score += 30;
    el.style.width = `${Math.max(12, score)}%`;
    el.style.background = score > 70 ? "var(--success)" : score > 40 ? "var(--warning)" : "var(--danger)";
  }
  window.JijiValidation = { init };
})();
