(function () {
  "use strict";

  const { products, categories, sellers } = window.JijiData;
  const UI = window.JijiUI;
  const page = document.body.dataset.page || "home";
  const main = document.getElementById("main");

  function init() {
    document.getElementById("navbar").innerHTML = UI.nav();
    document.getElementById("footer").innerHTML = UI.footer();
    main.classList.add("page-enter");
    renderPage();
    bindGlobal();
    window.JijiSearch.init();
    window.JijiValidation.init();
    revealOnScroll();
  }

  function renderPage() {
    if (page === "home") return renderHome();
    if (["category", "subcategory"].includes(page)) return renderCategory();
    if (page === "search") return renderSearch();
    if (page === "product") return renderProduct();
    if (page === "seller") return renderSeller();
    if (["about", "contact", "help", "privacy", "terms", "not-found"].includes(page)) return renderPublicPage(page);
    if (["login", "register", "forgot-password", "reset-password", "email-verification", "phone-verification"].includes(page)) return renderAuth(page);
    if (page === "messages") return window.JijiMessages.render(main);
    if (page.startsWith("admin-")) return window.JijiDashboard.renderAdmin(main, page);
    return window.JijiDashboard.renderUser(main, page);
  }

  function renderHome() {
    main.innerHTML = `<section class="hero"><div class="container hero-content"><span class="eyebrow">Nigeria's cleanest marketplace experience</span><h1>Buy smarter. Sell faster. Meet trusted local sellers.</h1><p>Discover vehicles, homes, phones, fashion, jobs, services, and everyday essentials with polished search, rich listings, and seller-first workflows.</p>${UI.searchBar()}<div class="hero-stats"><div class="hero-stat"><strong>120+</strong><br><span>live demo ads</span></div><div class="hero-stat"><strong>20</strong><br><span>trusted sellers</span></div><div class="hero-stat"><strong>150</strong><br><span>category paths</span></div></div></div></section>
    ${section("Categories", "Explore curated buying paths", `<div class="grid grid-4">${categories.slice(0, 8).map(UI.categoryCard).join("")}</div>`)}
    ${section("Featured Ads", "High-interest listings from verified sellers", productGrid(products.filter(p => p.discount).slice(0, 8)))}
    ${section("Latest Ads", "Fresh deals added by active sellers", productGrid(products.slice(16, 24)))}
    ${section("Popular Categories", "Fast routes to what buyers search for most", `<div class="grid grid-3">${categories.slice(8, 14).map(UI.categoryCard).join("")}</div>`)}
    ${section("Top Sellers", "Responsive shops with strong ratings", sellerGrid())}
    ${section("Trending Products", "Items getting the most attention", productGrid(products.slice(50, 58)))}
    ${howItWorks()}${testimonials()}${downloadApp()}${newsletter()}`;
  }

  function renderCategory() {
    const cat = categories[Number(new URLSearchParams(location.search).get("cat")) - 1] || categories[0];
    const list = products.filter(p => p.categoryId === cat.id);
    main.innerHTML = `<section class="section"><div class="container">${UI.breadcrumb([page === "subcategory" ? "Subcategory" : "Category", cat.name])}<div class="section-head"><div><span class="section-kicker">${cat.subcategories.length} refined paths</span><h1>${cat.name}</h1><p>Browse verified ${cat.name.toLowerCase()} listings with filters, sorting, and quick seller actions.</p></div><a class="btn btn-primary" href="create-ad.html">${UI.icon("fa-plus")} Post in ${cat.name}</a></div><div class="grid grid-4">${cat.subcategories.map(sub => `<a class="chip" href="subcategory.html?cat=${cat.id}&sub=${sub.id}">${sub.name} <span>${sub.count}</span></a>`).join("")}</div></div></section>${listingLayout(list, cat.name)}`;
  }

  function renderSearch() {
    main.innerHTML = `<section class="section tight"><div class="container">${UI.breadcrumb(["Search Results"])}<div class="section-head"><div><span class="section-kicker">Search system</span><h1>Find exactly what you need</h1><p>Use autocomplete, filters, sorting, pagination, and infinite-scroll style loading with dummy data.</p></div></div>${UI.searchBar("Search all listings")}</div></section>${listingLayout(products, "All Listings")}`;
  }

  function listingLayout(list, title) {
    return `<section class="section tight"><div class="container filters-layout"><aside class="card panel filters" aria-label="Search filters"><h3>Filters</h3><div class="field"><label>Category</label><select class="select" data-filter="category"><option value="">All</option>${categories.map(c => `<option>${c.name}</option>`).join("")}</select></div><div class="range-row"><div class="field"><label>Min price</label><input class="input" type="number" placeholder="0" data-filter="min"></div><div class="field"><label>Max price</label><input class="input" type="number" placeholder="5000000" data-filter="max"></div></div><div class="field"><label>Condition</label><select class="select" data-filter="condition"><option value="">Any</option>${window.JijiData.conditions.map(c => `<option>${c}</option>`).join("")}</select></div><div class="field"><label>Brand</label><select class="select" data-filter="brand"><option value="">Any</option>${window.JijiData.brands.map(c => `<option>${c}</option>`).join("")}</select></div><div class="field"><label>Rating</label><select class="select"><option>4 stars and above</option><option>Newest</option><option>Popular</option></select></div><button class="btn btn-primary" data-apply-filters>${UI.icon("fa-sliders")} Apply filters</button></aside><div><div class="between" style="margin-bottom:16px"><h2>${title}</h2><select class="select" style="max-width:190px" data-sort><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="popular">Popular</option><option value="price-low">Price low</option><option value="price-high">Price high</option></select></div><div class="grid grid-3" id="listingGrid" data-list='${JSON.stringify(list.map(p => p.id))}'>${list.slice(0, 12).map(UI.productCard).join("")}</div><div class="pagination">${[1,2,3,4,5].map(n => `<button class="page-btn ${n === 1 ? "active" : ""}" data-page-num="${n}">${n}</button>`).join("")}</div><div class="empty-state" id="loadMoreState"><button class="btn btn-soft" data-load-more>${UI.icon("fa-angles-down")} Load more listings</button></div></div></div></section>`;
  }

  function renderProduct() {
    const id = Number(new URLSearchParams(location.search).get("id")) || 1;
    const product = products.find(p => p.id === id) || products[0];
    const seller = sellers.find(s => s.id === product.sellerId);
    const specs = Object.entries(product.specs).map(([k, v]) => `<div class="between"><strong>${k}</strong><span class="muted">${v}</span></div>`).join("");
    main.innerHTML = `<section class="section"><div class="container">${UI.breadcrumb([product.category, product.title])}<div class="product-detail"><div><div class="gallery-main" data-zoom>${UI.image(product.gallery[0], product.title, "gallery-image")}</div><div class="thumb-row">${product.gallery.map((src, i) => `<button class="thumb ${i === 0 ? "active" : ""}" data-thumb="${src}" aria-label="View image ${i + 1}">${UI.image(src, product.title)}</button>`).join("")}</div></div><aside class="card panel stack"><div class="between"><span class="badge green">${product.condition}</span><button class="btn btn-ghost btn-icon" data-fav="${product.id}" aria-label="Favorite">${UI.icon("fa-heart")}</button></div><h1>${product.title}</h1><div class="price-row"><span class="price">${UI.money(product.price)}</span>${product.oldPrice ? `<span class="old-price">${UI.money(product.oldPrice)}</span><span class="badge red">-${product.discount}%</span>` : ""}</div><div class="meta"><span>${UI.icon("fa-location-dot")} ${product.location}</span><span>${UI.icon("fa-clock")} ${product.posted}</span><span>${UI.icon("fa-eye")} ${product.views} views</span></div><div class="row"><a class="btn btn-primary" href="tel:+2348068578671">${UI.icon("fa-phone")} +234 806 857 8671</a><a class="btn btn-soft" href="mailto:vtechs24@gmail.com">${UI.icon("fa-envelope")} Email seller</a><button class="btn btn-soft" data-share="${product.id}">${UI.icon("fa-share-nodes")} Share</button><button class="btn btn-ghost" data-report>${UI.icon("fa-flag")} Report</button></div><hr><div class="mini-card"><img class="avatar" src="${seller.avatar}" alt="${seller.name}"><div><strong>${seller.name} ${seller.verified ? UI.icon("fa-circle-check") : ""}</strong><p>${seller.location} - ${seller.rating} rating - ${seller.reviews} reviews</p></div></div><a class="btn btn-secondary" href="seller.html?id=${seller.id}">${UI.icon("fa-store")} View seller profile</a></aside></div><section class="section tight"><div class="card panel"><div class="tabs" role="tablist"><button class="tab-btn active" data-tab="desc">Description</button><button class="tab-btn" data-tab="specs">Specifications</button><button class="tab-btn" data-tab="reviews">Reviews</button></div><div class="tab-panel active" id="desc"><p>${product.description}</p></div><div class="tab-panel" id="specs"><div class="stack">${specs}</div></div><div class="tab-panel" id="reviews"><p>Buyers praise this seller for quick replies, accurate descriptions, and fair negotiation.</p></div></div></section></div></section>${section("Related Products", "Similar listings and recently viewed products", productGrid(products.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 8)))}`;
  }

  function renderSeller() {
    const id = Number(new URLSearchParams(location.search).get("id")) || 1;
    const seller = sellers.find(s => s.id === id) || sellers[0];
    const list = products.filter(p => p.sellerId === seller.id);
    main.innerHTML = `<section class="section"><div class="container">${UI.breadcrumb(["Seller Profile"])}<article class="card seller-hero"><div class="seller-cover" style="background-image:url('${seller.cover}')"></div><div class="seller-info"><img class="avatar lg" src="${seller.avatar}" alt="${seller.name}"><div class="stack" style="flex:1"><h1>${seller.name} ${seller.verified ? UI.icon("fa-circle-check") : ""}</h1><div class="meta"><span>${UI.icon("fa-calendar")} Member since ${seller.memberSince}</span><span>${UI.icon("fa-location-dot")} ${seller.location}</span><span>${UI.icon("fa-star")} ${seller.rating} from ${seller.reviews} reviews</span><span>${UI.icon("fa-phone")} +234 806 857 8671</span><span>${UI.icon("fa-envelope")} vtechs24@gmail.com</span></div><p>${seller.bio}</p></div><a class="btn btn-primary" href="tel:+2348068578671">${UI.icon("fa-message")} Contact seller</a></div></article></div></section>${section("All Listings", `${seller.name}'s active marketplace ads`, productGrid(list.concat(products.slice(0, 8)).slice(0, 12)))}`;
  }

  function renderPublicPage(kind) {
    const titles = { about: "About VtectShop", contact: "Contact Us", help: "Help Center", privacy: "Privacy Policy", terms: "Terms of Use", "not-found": "Page Not Found" };
    if (kind === "not-found") {
      main.innerHTML = `<section class="auth-shell"><div class="container"><div class="card empty-state"><i class="fa-solid fa-compass"></i><h1>404</h1><p>The page you opened is not available.</p><a class="btn btn-primary" href="index.html">Back home</a></div></div></section>`;
      return;
    }
    const contactForm = kind === "contact" ? contactDetails() + formShell("Send us a message", [["Full name", "text"], ["Email address", "email"], ["Phone number", "tel"], ["Message", "textarea"]]) : "";
    const help = kind === "help" ? accordion() : "";
    main.innerHTML = `<section class="section"><div class="container policy">${UI.breadcrumb([titles[kind]])}<span class="section-kicker">VtectShop</span><h1>${titles[kind]}</h1><p>${publicCopy(kind)}</p>${contactForm}${help}${kind === "privacy" || kind === "terms" ? legalBlocks(kind) : ""}</div></section>`;
  }

  function renderAuth(kind) {
    const titles = { login: "Welcome Back", register: "Create Your Account", "forgot-password": "Recover Password", "reset-password": "Reset Password", "email-verification": "Verify Email", "phone-verification": "Verify Phone" };
    const fields = authFields(kind);
    main.innerHTML = `<section class="auth-shell"><div class="container"><div class="card auth-card stack"><div><span class="section-kicker">Secure access</span><h1>${titles[kind]}</h1><p>Frontend validation, loading states, disabled states, character counters, and success feedback are included.</p></div>${formShell(titles[kind], fields, authButton(kind))}</div></div></section>`;
  }

  function formShell(title, fields, button = "Continue") {
    return `<form class="form-grid" data-validate novalidate aria-label="${title} form">${fields.map(([label, type]) => field(label, type)).join("")}<button class="btn btn-primary" type="submit">${UI.icon("fa-circle-check")} ${button}</button><p class="success" data-form-success hidden>Success. This frontend is ready to connect to an API.</p></form>`;
  }

  function field(label, type) {
    const name = label.toLowerCase().replaceAll(" ", "-");
    if (type === "textarea") return `<div class="field"><label>${label}</label><textarea name="${name}" required maxlength="240"></textarea><span class="char-counter" data-counter>0/240</span><span class="error"></span></div>`;
    return `<div class="field"><label>${label}</label><input class="input" name="${name}" type="${type}" required ${type === "password" ? "minlength='8'" : ""}><span class="error"></span>${type === "password" ? "<div class='strength'><span data-strength></span></div>" : ""}</div>`;
  }

  function authFields(kind) {
    if (kind === "login") return [["Email address", "email"], ["Password", "password"]];
    if (kind === "register") return [["Full name", "text"], ["Email address", "email"], ["Phone number", "tel"], ["Password", "password"]];
    if (kind.includes("password")) return [["Email address", "email"], ["New password", "password"]];
    return [[kind.includes("phone") ? "Phone number" : "Email address", kind.includes("phone") ? "tel" : "email"], ["Verification code", "text"]];
  }

  function authButton(kind) { return kind === "login" ? "Login" : kind === "register" ? "Create account" : "Submit"; }
  function section(title, subtitle, body) { return `<section class="section"><div class="container"><div class="section-head"><div><span class="section-kicker">${subtitle}</span><h2>${title}</h2></div><a class="btn btn-ghost" href="search.html">View all</a></div>${body}</div></section>`; }
  function productGrid(list) { return `<div class="grid grid-4">${list.map(UI.productCard).join("")}</div>`; }
  function sellerGrid() { return `<div class="grid grid-4">${sellers.slice(0, 8).map(s => `<a class="card panel stack reveal" href="seller.html?id=${s.id}"><img class="avatar lg" src="${s.avatar}" alt="${s.name}"><h3>${s.name} ${s.verified ? UI.icon("fa-circle-check") : ""}</h3><p>${s.location}</p><span class="rating">${UI.icon("fa-star")} ${s.rating} - ${s.reviews} reviews</span></a>`).join("")}</div>`; }
  function howItWorks() { return section("How It Works", "Simple buyer and seller flow", `<div class="grid grid-3">${["Search trusted listings", "Chat with verified sellers", "Inspect and close the deal"].map((t, i) => `<div class="card panel stack reveal"><span class="category-icon">${UI.icon(["fa-magnifying-glass","fa-comments","fa-handshake"][i])}</span><h3>${t}</h3><p>Clear actions, feedback states, and accessible controls support a smooth marketplace journey.</p></div>`).join("")}</div>`); }
  function testimonials() { return section("Testimonials", "Buyer confidence", `<div class="grid grid-3">${["The filters feel fast and precise.", "Listings are clean and easy to compare.", "The seller profile makes trust obvious."].map((t, i) => `<blockquote class="card panel reveal"><p>${t}</p><footer class="row" style="margin-top:12px"><img class="avatar" src="https://i.pravatar.cc/120?img=${i + 20}" alt="Customer"><strong>Customer ${i + 1}</strong></footer></blockquote>`).join("")}</div>`); }
  function downloadApp() { return section("Download App", "Mobile-first experience", `<div class="card panel between"><div><h2>Shop and sell comfortably on any screen</h2><p>Responsive layouts cover 320px through ultrawide desktop sizes.</p></div><div class="row"><button class="btn btn-primary">${UI.icon("fa-apple")} App Store</button><button class="btn btn-secondary">${UI.icon("fa-google-play")} Google Play</button></div></div>`); }
  function newsletter() { return section("Newsletter", "Fresh deals weekly", `<form class="search-shell" data-validate><input class="input" type="email" required placeholder="Email address"><select class="select"><option>Weekly digest</option><option>Daily alerts</option></select><button class="btn btn-primary btn-icon" aria-label="Subscribe">${UI.icon("fa-paper-plane")}</button></form>`); }
  function publicCopy(kind) { return { about: "VtectShop is an original, premium marketplace frontend built for fast browsing, clear seller trust, and future REST API integration.", contact: "Reach our support, trust, and seller success teams through +234 806 857 8671 or vtechs24@gmail.com.", help: "Find answers about buying, selling, safety, verification, payments, messages, and account settings.", privacy: "This demo presents privacy sections that can be replaced by production legal copy before launch.", terms: "These frontend terms sections define sample marketplace rules, acceptable use, listings, transactions, and disputes." }[kind]; }
  function contactDetails() { return `<div class="grid grid-2" style="margin:22px 0"><a class="card panel mini-card" href="tel:+2348068578671"><span class="category-icon">${UI.icon("fa-phone")}</span><div><strong>Phone</strong><p>+234 806 857 8671</p></div></a><a class="card panel mini-card" href="mailto:vtechs24@gmail.com"><span class="category-icon">${UI.icon("fa-envelope")}</span><div><strong>Email</strong><p>vtechs24@gmail.com</p></div></a></div>`; }
  function legalBlocks(kind) { return `<div class="policy">${["Account Responsibilities", "Listing Quality", "Payments and Promotions", "Safety and Trust", "Data and Notifications"].map(h => `<h2>${h}</h2><p>${kind === "privacy" ? "We model clear consent, user controls, and transparent data handling sections for later legal review." : "We model clear marketplace obligations, content rules, moderation paths, and dispute handling sections."}</p>`).join("")}</div>`; }
  function accordion() { return `<div class="card panel" style="margin-top:22px">${["How do I contact a seller?", "How do I create an ad?", "How do I report a listing?", "How do promoted ads work?"].map(q => `<div class="accordion-item"><button class="accordion-btn">${q}<i class="fa-solid fa-chevron-down"></i></button><div class="accordion-content"><p>Use the relevant button on the page. This demo shows the complete interaction pattern with dummy data.</p></div></div>`).join("")}</div>`; }

  function bindGlobal() {
    document.addEventListener("click", e => {
      const nav = e.target.closest("[data-nav-toggle]");
      if (nav) document.getElementById("navLinks").classList.toggle("open");
      const theme = e.target.closest("[data-theme-toggle]");
      if (theme) { const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = next; localStorage.setItem("VtectShop-theme", next); }
      const fav = e.target.closest("[data-fav]");
      if (fav) { fav.classList.toggle("btn-primary"); toast("Favorite updated"); }
      const quick = e.target.closest("[data-quick]");
      if (quick) quickView(Number(quick.dataset.quick));
      const share = e.target.closest("[data-share]");
      if (share) shareProduct(Number(share.dataset.share));
      const open = e.target.closest("[data-search-open]");
      if (open) document.getElementById("searchOverlay").classList.add("open");
      const close = e.target.closest("[data-search-close]");
      if (close) document.getElementById("searchOverlay").classList.remove("open");
      const tab = e.target.closest("[data-tab]");
      if (tab) switchTab(tab);
      const acc = e.target.closest(".accordion-btn");
      if (acc) acc.parentElement.classList.toggle("open");
      const thumb = e.target.closest("[data-thumb]");
      if (thumb) switchThumb(thumb);
      const load = e.target.closest("[data-load-more]");
      if (load) loadMore();
      const report = e.target.closest("[data-report]");
      if (report) toast("Report form opened for moderation review");
    });
    const saved = localStorage.getItem("VtectShop-theme");
    if (saved) document.documentElement.dataset.theme = saved;
  }

  function quickView(id) {
    const p = products.find(item => item.id === id);
    document.getElementById("modal-root").innerHTML = `<div class="modal-backdrop open" data-modal><div class="modal card"><div class="panel stack"><div class="between"><h2>${p.title}</h2><button class="btn btn-ghost btn-icon" onclick="this.closest('[data-modal]').remove()">${UI.icon("fa-xmark")}</button></div>${UI.image(p.image, p.title)}<p>${p.description}</p><div class="between"><strong class="price">${UI.money(p.price)}</strong><a class="btn btn-primary" href="product.html?id=${p.id}">View details</a></div></div></div></div>`;
  }

  function shareProduct(id) {
    const p = products.find(item => item.id === id);
    const url = `${location.origin}${location.pathname.replace(/[^/]+$/, "")}product.html?id=${id}`;
    if (navigator.share) navigator.share({ title: p.title, url }).catch(() => {});
    else { navigator.clipboard?.writeText(url); toast("Product link copied"); }
  }

  function switchTab(tab) {
    tab.parentElement.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    tab.classList.add("active");
    tab.closest(".card").querySelectorAll(".tab-panel").forEach(panel => panel.classList.toggle("active", panel.id === tab.dataset.tab));
  }

  function switchThumb(thumb) {
    const img = document.querySelector(".gallery-image");
    if (img) img.src = thumb.dataset.thumb;
    document.querySelectorAll(".thumb").forEach(t => t.classList.remove("active"));
    thumb.classList.add("active");
  }

  function loadMore() {
    const grid = document.getElementById("listingGrid");
    const ids = JSON.parse(grid.dataset.list || "[]");
    const current = grid.children.length;
    const next = ids.slice(current, current + 8).map(id => UI.productCard(products.find(p => p.id === id))).join("");
    grid.insertAdjacentHTML("beforeend", next);
    revealOnScroll();
    if (current + 8 >= ids.length) document.getElementById("loadMoreState").innerHTML = `<div class="empty-state"><i class="fa-solid fa-box-open"></i><p>No more listings to load.</p></div>`;
  }

  function toast(message) {
    const root = document.getElementById("toast-root");
    const wrap = root.querySelector(".toast-wrap") || root.appendChild(Object.assign(document.createElement("div"), { className: "toast-wrap" }));
    const item = document.createElement("div");
    item.className = "toast";
    item.textContent = message;
    wrap.appendChild(item);
    setTimeout(() => item.remove(), 2600);
  }

  function revealOnScroll() {
    const items = document.querySelectorAll(".reveal:not(.visible)");
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); io.unobserve(entry.target); }
    }), { threshold: .08 });
    items.forEach(item => io.observe(item));
  }

  window.JijiToast = toast;
  init();
})();
