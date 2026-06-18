(function () {
  "use strict";
  function render(main) {
    const sellers = window.JijiData.sellers.slice(0, 8);
    main.innerHTML = `<section class="section"><div class="container dashboard-layout">${window.JijiUI.dashboardSidebar("messages")}<div><div class="section-head"><div><span class="section-kicker">Inbox</span><h1>Messages</h1><p>Frontend chat interface with conversation list, empty states, and compose input.</p></div></div><div class="card message-app"><aside class="thread-list">${sellers.map((s,i) => `<button class="thread ${i===0 ? "active" : ""}" data-thread="${s.id}"><img class="avatar" src="${s.avatar}" alt="${s.name}"><span><strong>${s.name}</strong><br><small class="muted">Is this still available?</small></span></button>`).join("")}</aside><section class="chat"><div class="panel between"><strong id="chatName">${sellers[0].name}</strong><span class="badge green">Online</span></div><div class="chat-body" id="chatBody"><div class="bubble"><p>Hello, the listing is available and inspection is welcome.</p></div><div class="bubble me"><p>Great. Can we meet tomorrow?</p></div><div class="bubble"><p>Yes, I can reserve it for you.</p></div></div><form class="panel row" data-message-form><input class="input" name="message" placeholder="Write a message" aria-label="Message"><button class="btn btn-primary">${window.JijiUI.icon("fa-paper-plane")} Send</button></form></section></div></div></div></section>`;
  }
  document.addEventListener("click", event => {
    const thread = event.target.closest("[data-thread]");
    if (!thread) return;
    document.querySelectorAll("[data-thread]").forEach(t => t.classList.remove("active"));
    thread.classList.add("active");
    document.getElementById("chatName").textContent = thread.querySelector("strong").textContent;
  });
  document.addEventListener("submit", event => {
    const form = event.target.closest("[data-message-form]");
    if (!form) return;
    event.preventDefault();
    const input = form.elements.message;
    if (!input.value.trim()) return;
    document.getElementById("chatBody").insertAdjacentHTML("beforeend", `<div class="bubble me"><p>${input.value}</p></div>`);
    input.value = "";
  });
  window.JijiMessages = { render };
})();
