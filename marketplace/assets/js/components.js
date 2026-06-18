(function () {
  "use strict";

  const fmt = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
  const fallbackImage = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='640' height='480'><rect width='100%' height='100%' fill='#e8f1ff'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#0d6efd' font-family='Arial' font-size='28'>VtectShop</text></svg>");

  function money(value) { return fmt.format(value); }
  function byId(id) { return document.getElementById(id); }
  function icon(name) { return `<i class="fa-solid ${name}" aria-hidden="true"></i>`; }
  function image(src, alt, cls = "") { return `<img class="${cls}" src="${src}" alt="${alt}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackImage}'">`; }

  function nav() {
    const cats = window.JijiData.categories.slice(0, 9).map(cat => `<a class="mini-card" href="category.html?cat=${cat.id}"><span class="category-icon">${icon(cat.icon)}</span><span><strong>${cat.name}</strong><br><small class="muted">${cat.subcategories.length} subcategories</small></span></a>`).join("");
    return `<header class="site-header"><div class="container nav-inner"><a href="index.html" class="brand" aria-label="VtectShop home"><span class="brand-mark">${icon("fa-bag-shopping")}</span><span>VtectShop</span></a><nav class="nav-links" id="navLinks" aria-label="Primary navigation"><a class="nav-link" href="index.html">Home</a><div class="has-mega"><a class="nav-link" href="category.html">Categories</a><div class="mega-menu card"><div class="grid mega-list">${cats}</div></div></div><a class="nav-link" href="search.html">Search</a><a class="nav-link" href="seller.html">Sellers</a><a class="nav-link" href="help.html">Help</a><a class="nav-link" href="admin-dashboard.html">Admin</a></nav><div class="nav-actions"><button class="btn btn-ghost btn-icon hide-mobile" data-search-open aria-label="Open search">${icon("fa-magnifying-glass")}</button><button class="btn btn-ghost btn-icon" data-theme-toggle aria-label="Toggle theme">${icon("fa-moon")}</button><a class="btn btn-ghost hide-mobile" href="login.html">${icon("fa-right-to-bracket")} Login</a><a class="btn btn-primary" href="create-ad.html">${icon("fa-plus")} Sell</a><button class="btn btn-ghost btn-icon mobile-toggle" data-nav-toggle aria-label="Open menu">${icon("fa-bars")}</button></div></div></header><div class="overlay-search" id="searchOverlay"><button class="btn btn-ghost btn-icon" data-search-close aria-label="Close search" style="position:absolute;right:18px;top:18px;color:white">${icon("fa-xmark")}</button>${searchBar("Search phones, cars, property...", true)}</div>`;
  }

  function footer() {
    const groups = [
      ["Marketplace", ["Categories", "Featured Ads", "Top Sellers", "Recently Viewed"]],
      ["Account", ["Dashboard", "Messages", "Favorites", "Payments"]],
      ["Company", ["About", "Contact", "Help Center", "Privacy Policy"]],
      ["Legal", ["Terms", "Security", "Reports", "Reviews"]]
    ];
    const links = groups.map(g => `<div><h3>${g[0]}</h3><div class="footer-links">${g[1].map(v => `<a href="${slugToPage(v)}">${v}</a>`).join("")}</div></div>`).join("");
    return `<footer class="footer"><div class="container"><div class="footer-grid"><div class="stack"><a href="index.html" class="brand"><span class="brand-mark">${icon("fa-bag-shopping")}</span><span>VtectShop</span></a><p>A polished marketplace frontend inspired by leading classified platforms, ready for REST API integration.</p><div class="footer-links"><a href="tel:+2348068578671">${icon("fa-phone")} +234 806 857 8671</a><a href="mailto:vtechs24@gmail.com">${icon("fa-envelope")} vtechs24@gmail.com</a></div><div class="row"><span class="chip">${icon("fa-shield-halved")} Verified sellers</span><span class="chip">${icon("fa-truck-fast")} Local deals</span></div></div>${links}</div><div class="between footer-bottom"><p>&copy; 2026 VtectShop. All rights reserved.</p><div class="row"><a aria-label="Twitter" href="#">${icon("fa-x-twitter")}</a><a aria-label="Instagram" href="#">${icon("fa-instagram")}</a><a aria-label="Facebook" href="#">${icon("fa-facebook")}</a></div></div></div></footer>`;
  }

  function slugToPage(label) {
    const map = { Categories: "category.html", "Featured Ads": "search.html", "Top Sellers": "seller.html", Dashboard: "dashboard.html", Messages: "messages.html", Favorites: "favorites.html", Payments: "payments.html", About: "about.html", Contact: "contact.html", "Help Center": "help.html", "Privacy Policy": "privacy.html", Terms: "terms.html", Security: "security.html", Reports: "admin-reports.html", Reviews: "admin-reviews.html", "Recently Viewed": "recently-viewed.html" };
    return map[label] || "index.html";
  }

  function searchBar(placeholder = "What are you looking for?", compact = false) {
    return `<form class="search-shell" data-search-form><div><label class="sr-only" for="${compact ? "overlayQ" : "searchQ"}">Search</label><input id="${compact ? "overlayQ" : "searchQ"}" class="input" name="q" autocomplete="off" placeholder="${placeholder}"><div class="suggestions" data-suggestions></div></div><select class="select" name="location" aria-label="Location"><option value="">All locations</option>${window.JijiData.locations.map(l => `<option>${l}</option>`).join("")}</select><button class="btn btn-primary btn-icon" aria-label="Search">${icon("fa-magnifying-glass")}</button></form>`;
  }

  function productCard(product) {
    return `<article class="card product-card reveal"><div class="product-media"><a href="product.html?id=${product.id}">${image(product.image, product.title)}</a>${product.discount ? `<span class="badge discount">-${product.discount}%</span>` : ""}<div class="product-actions"><button class="btn btn-icon" data-fav="${product.id}" aria-label="Add ${product.title} to favorites">${icon("fa-heart")}</button><button class="btn btn-icon" data-quick="${product.id}" aria-label="Quick view">${icon("fa-eye")}</button><button class="btn btn-icon" data-share="${product.id}" aria-label="Share">${icon("fa-share-nodes")}</button></div></div><div class="product-body"><div class="between"><span class="badge green">${product.condition}</span><span class="rating">${icon("fa-star")} ${product.rating}</span></div><h3><a href="product.html?id=${product.id}">${product.title}</a></h3><div class="price-row"><span class="price">${money(product.price)}</span>${product.oldPrice ? `<span class="old-price">${money(product.oldPrice)}</span>` : ""}</div><div class="meta"><span>${icon("fa-location-dot")} ${product.location}</span><span>${icon("fa-clock")} ${product.posted}</span></div><div class="between"><span class="chip">${product.sellerVerified ? icon("fa-circle-check") : icon("fa-user")} ${product.seller}</span><a class="btn btn-soft" href="product.html?id=${product.id}">View</a></div></div></article>`;
  }

  function categoryCard(cat) {
    return `<a class="card category-card reveal" href="category.html?cat=${cat.id}"><span class="category-icon">${icon(cat.icon)}</span><h3>${cat.name}</h3><p>${cat.subcategories.length} subcategories and ${cat.subcategories.reduce((a, s) => a + s.count, 0).toLocaleString()} active ads</p></a>`;
  }

  function breadcrumb(items) {
    return `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a>${items.map(item => `<span>/</span><span>${item}</span>`).join("")}</nav>`;
  }

  function dashboardSidebar(active) {
    const links = [["dashboard", "Dashboard", "fa-chart-line"], ["profile", "Profile", "fa-user"], ["edit-profile", "Edit Profile", "fa-pen"], ["settings", "Settings", "fa-gear"], ["notifications", "Notifications", "fa-bell"], ["messages", "Messages", "fa-message"], ["favorites", "Favorites", "fa-heart"], ["recently-viewed", "Recently Viewed", "fa-clock"], ["my-ads", "My Ads", "fa-list"], ["create-ad", "Create Ad", "fa-plus"], ["payments", "Payments", "fa-credit-card"], ["transaction-history", "Transactions", "fa-receipt"], ["security", "Security", "fa-shield-halved"], ["logout", "Logout", "fa-right-from-bracket"]];
    return `<aside class="card sidebar">${links.map(l => `<a class="${active === l[0] ? "active" : ""}" href="${l[0]}.html">${icon(l[2])} ${l[1]}</a>`).join("")}</aside>`;
  }

  function adminSidebar(active) {
    const links = [["admin-dashboard", "Dashboard", "fa-chart-pie"], ["admin-users", "Users", "fa-users"], ["admin-products", "Products", "fa-box"], ["admin-categories", "Categories", "fa-layer-group"], ["admin-subcategories", "Subcategories", "fa-sitemap"], ["admin-reports", "Reports", "fa-flag"], ["admin-reviews", "Reviews", "fa-star"], ["admin-payments", "Payments", "fa-credit-card"], ["admin-analytics", "Analytics", "fa-chart-simple"], ["admin-settings", "Settings", "fa-gear"]];
    return `<aside class="card sidebar">${links.map(l => `<a class="${active === l[0] ? "active" : ""}" href="${l[0]}.html">${icon(l[2])} ${l[1]}</a>`).join("")}</aside>`;
  }

  function statCard(label, value, iconName, tone = "") {
    return `<article class="card stat-card"><span class="category-icon ${tone}">${icon(iconName)}</span><strong>${value}</strong><p>${label}</p></article>`;
  }

  function table(headers, rows) {
    return `<div class="card table-wrap"><table class="table"><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }

  window.JijiUI = { money, byId, icon, image, nav, footer, searchBar, productCard, categoryCard, breadcrumb, dashboardSidebar, adminSidebar, statCard, table, fallbackImage };
})();
