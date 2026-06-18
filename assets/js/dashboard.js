(function () {
  "use strict";
  const UI = window.JijiUI;
  const products = window.JijiData.products;
  const sellers = window.JijiData.sellers;
  const categories = window.JijiData.categories;

  function renderUser(main, page) {
    const title = page.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
    main.innerHTML = `<section class="section"><div class="container dashboard-layout">${UI.dashboardSidebar(page)}<div class="stack"><div>${UI.breadcrumb(["Dashboard", title])}<div class="between"><div><span class="section-kicker">User dashboard</span><h1>${title}</h1><p>Manage profile, listings, messages, payments, favorites, and account security.</p></div><a class="btn btn-primary" href="create-ad.html">${UI.icon("fa-plus")} New ad</a></div></div>${userContent(page)}</div></div></section>`;
  }

  function userContent(page) {
    if (page === "dashboard") return `<div class="grid grid-4">${UI.statCard("Active ads", "18", "fa-list")}${UI.statCard("Messages", "42", "fa-message")}${UI.statCard("Favorites", "31", "fa-heart")}${UI.statCard("Profile complete", "86%", "fa-user-check")}</div><div class="grid grid-2"><div class="card panel"><h3>Listing performance</h3>${chart()}</div><div class="card panel stack"><h3>Recent activity</h3>${activity()}</div></div>`;
    if (["create-ad", "edit-ad"].includes(page)) return adForm(page === "edit-ad");
    if (page === "delete-ad") return confirmPanel("Delete this ad?", "This confirmation page models the destructive listing flow.", "Delete ad", "btn-danger");
    if (page === "logout") return confirmPanel("Logout confirmation", "End this session and return to the marketplace home.", "Logout", "btn-danger");
    if (page === "upgrade-ad") return upgradePlans();
    if (page === "payments") return `<div class="grid grid-3">${UI.statCard("Wallet balance", UI.money(78000), "fa-wallet")}${UI.statCard("Promotions", "6", "fa-bolt")}${UI.statCard("Pending", UI.money(12000), "fa-hourglass")}</div>${paymentTable()}`;
    if (page === "transaction-history") return paymentTable();
    if (page === "favorites" || page === "recently-viewed") return `<div class="grid grid-4">${products.slice(page === "favorites" ? 10 : 28, page === "favorites" ? 18 : 36).map(UI.productCard).join("")}</div>`;
    if (page === "my-ads") return UI.table(["Ad", "Status", "Views", "Price", "Actions"], products.slice(0, 8).map(p => [p.title, "<span class='badge green'>Live</span>", p.views, UI.money(p.price), "<a href='edit-ad.html'>Edit</a>"]));
    if (page === "notifications") return listPanel(["Your ad received 18 new views.", "A seller replied to your message.", "Payment receipt is ready.", "Security settings were updated."]);
    if (page === "security") return securityPanel();
    if (page === "profile") return profilePanel(false);
    if (page === "edit-profile" || page === "settings") return profilePanel(true);
    return listPanel(["No new items yet.", "This page is ready for API content.", "Empty states are styled for production use."]);
  }

  function renderAdmin(main, page) {
    const title = page.replace("admin-", "").split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
    main.innerHTML = `<section class="section admin-shell"><div class="container dashboard-layout">${UI.adminSidebar(page)}<div class="stack"><div>${UI.breadcrumb(["Admin", title])}<span class="section-kicker">Frontend only</span><h1>${title}</h1><p>Admin management views with tables, analytics cards, review queues, reports, and settings.</p></div>${adminContent(page)}</div></div></section>`;
  }

  function adminContent(page) {
    if (page === "admin-dashboard" || page === "admin-analytics") return `<div class="grid grid-4">${UI.statCard("Gross sales", UI.money(12800000), "fa-sack-dollar")}${UI.statCard("Users", sellers.length * 193, "fa-users")}${UI.statCard("Products", products.length, "fa-box")}${UI.statCard("Reports", "27", "fa-flag")}</div><div class="grid grid-2"><div class="card panel"><h3>Marketplace analytics</h3>${chart()}</div><div class="card panel"><h3>Revenue mix</h3>${chart([44,76,38,88,62,91])}</div></div>`;
    if (page === "admin-users") return UI.table(["User", "Location", "Rating", "Reviews", "Status"], sellers.map(s => [s.name, s.location, s.rating, s.reviews, s.verified ? "<span class='badge green'>Verified</span>" : "<span class='badge gold'>Pending</span>"]));
    if (page === "admin-products") return UI.table(["Product", "Category", "Seller", "Price", "Status"], products.slice(0, 18).map(p => [p.title, p.category, p.seller, UI.money(p.price), "<span class='badge green'>Active</span>"]));
    if (page === "admin-categories") return UI.table(["Category", "Subcategories", "Active Ads", "Icon"], categories.map(c => [c.name, c.subcategories.length, c.subcategories.reduce((a, s) => a + s.count, 0), `<i class='fa-solid ${c.icon}'></i>`]));
    if (page === "admin-subcategories") return UI.table(["Subcategory", "Parent", "Count", "Status"], categories.flatMap(c => c.subcategories.slice(0, 3).map(s => [s.name, c.name, s.count, "<span class='badge green'>Visible</span>"])));
    if (page === "admin-reports") return UI.table(["Report", "Listing", "Reason", "Priority"], products.slice(0, 8).map((p, i) => [`RPT-${1000 + i}`, p.title, i % 2 ? "Suspicious price" : "Duplicate listing", i % 3 ? "<span class='badge gold'>Medium</span>" : "<span class='badge red'>High</span>"]));
    if (page === "admin-reviews") return UI.table(["Review", "Seller", "Rating", "Decision"], sellers.slice(0, 10).map(s => ["Accurate listing and fast response.", s.name, `${s.rating} stars`, "<button class='btn btn-soft'>Moderate</button>"]));
    if (page === "admin-payments") return paymentTable();
    if (page === "admin-settings") return settingsForm();
    return `<div class="empty-state card"><i class="fa-solid fa-chart-simple"></i><h2>Admin view ready</h2><p>Connect this surface to backend analytics when APIs are available.</p></div>`;
  }

  function chart(values = [42, 68, 55, 80, 46, 92, 64, 74]) { return `<div class="chart">${values.map(v => `<span class="bar" style="height:${v}%"></span>`).join("")}</div>`; }
  function activity() { return ["Ad boosted", "Buyer message received", "Profile verification pending", "Payment confirmed"].map(t => `<div class="mini-card"><span class="category-icon">${UI.icon("fa-bell")}</span><div><strong>${t}</strong><p>Updated just now</p></div></div>`).join(""); }
  function adForm(edit) { return `<div class="card panel">${form([["Title","text"],["Price","number"],["Location","text"],["Description","textarea"]], edit ? "Save changes" : "Publish ad")}</div>`; }
  function form(fields, button) { return `<form class="form-grid" data-validate novalidate>${fields.map(([l,t]) => t === "textarea" ? `<div class="field"><label>${l}</label><textarea required maxlength="320"></textarea><span class="char-counter" data-counter>0/320</span><span class="error"></span></div>` : `<div class="field"><label>${l}</label><input class="input" type="${t}" required><span class="error"></span></div>`).join("")}<button class="btn btn-primary" type="submit">${UI.icon("fa-cloud-arrow-up")} ${button}</button><p class="success" data-form-success hidden>Saved locally for demo purposes.</p></form>`; }
  function confirmPanel(title, text, button, cls) { return `<div class="card empty-state"><i class="fa-solid fa-triangle-exclamation"></i><h2>${title}</h2><p>${text}</p><div class="row"><a class="btn btn-ghost" href="my-ads.html">Cancel</a><button class="btn ${cls}">${button}</button></div></div>`; }
  function upgradePlans() { return `<div class="grid grid-3">${["Basic Boost", "Featured Pro", "Homepage Prime"].map((p,i) => `<div class="card plan-card ${i===1 ? "featured" : ""}"><span class="badge ${i===1 ? "green" : ""}">${i===1 ? "Recommended" : "Promotion"}</span><h2>${p}</h2><strong class="price">${UI.money((i+1)*6500)}</strong><p>Increase visibility with highlighted placement and priority ranking.</p><button class="btn btn-primary">Choose plan</button></div>`).join("")}</div>`; }
  function paymentTable() { return UI.table(["Reference", "Type", "Amount", "Date", "Status"], Array.from({length: 8}, (_,i) => [`PAY-${3020+i}`, i % 2 ? "Promotion" : "Wallet top-up", UI.money(5000 + i * 2400), `2026-06-${10+i}`, "<span class='badge green'>Paid</span>"])); }
  function listPanel(items) { return `<div class="card panel stack">${items.map(item => `<div class="mini-card"><span class="category-icon">${UI.icon("fa-circle-info")}</span><p>${item}</p></div>`).join("")}</div>`; }
  function securityPanel() { return `<div class="grid grid-2"><div class="card panel stack"><h3>Password</h3>${form([["Current password","password"],["New password","password"]],"Update password")}</div><div class="card panel stack"><h3>Two-factor authentication</h3><p>Phone and email verification flows are available in this frontend.</p><a class="btn btn-soft" href="phone-verification.html">Verify phone</a></div></div>`; }
  function profilePanel(edit) { return edit ? `<div class="card panel">${form([["Full name","text"],["Email","email"],["Phone","tel"],["Bio","textarea"]],"Save profile")}</div>` : `<div class="card panel mini-card"><img class="avatar lg" src="${sellers[0].avatar}" alt="Profile"><div><h2>${sellers[0].name}</h2><p>${sellers[0].bio}</p><span class="badge green">Verified seller</span></div></div>`; }
  function settingsForm() { return `<div class="card panel stack"><div class="row"><span class="chip">${UI.icon("fa-phone")} +234 806 857 8671</span><span class="chip">${UI.icon("fa-envelope")} vtechs24@gmail.com</span></div>${form([["Marketplace name","text"],["Support email","email"],["Default commission","number"],["Announcement","textarea"]],"Save settings")}</div>`; }

  window.JijiDashboard = { renderUser, renderAdmin };
})();
