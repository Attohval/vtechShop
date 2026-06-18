const fs = require("fs");
const path = require("path");

const root = __dirname;
const contactPhone = "+234 806 857 8671";
const contactEmail = "vtechs24@gmail.com";

const pages = [
  ["index.html", "home", "VtectShop - Modern Marketplace", "Modern marketplace homepage", "Find quality products, trusted sellers, and local deals near you."],
  ["about.html", "about", "About - VtectShop", "About VtectShop", "A premium marketplace frontend designed for buying, selling, trust, and growth."],
  ["contact.html", "contact", "Contact - VtectShop", "Contact Us", "Reach support, seller success, and trust teams through a polished contact flow."],
  ["help.html", "help", "Help Center - VtectShop", "Help Center", "Get help with buying, selling, safety, payments, verification, and messages."],
  ["category.html", "category", "Categories - VtectShop", "Marketplace Categories", "Browse vehicles, property, electronics, fashion, services, jobs, and more."],
  ["subcategory.html", "subcategory", "Subcategories - VtectShop", "Subcategory Listings", "Explore refined buying paths with filters, sorting, and local seller details."],
  ["search.html", "search", "Search Results - VtectShop", "Search Results", "Search listings with autocomplete, filters, sorting, pagination, and dummy data."],
  ["product.html", "product", "Product Details - VtectShop", "Product Details", "View gallery, price, description, specifications, seller info, and related products."],
  ["seller.html", "seller", "Seller Profile - VtectShop", "Seller Profile", "Review seller trust signals, ratings, listings, cover image, and contact actions."],
  ["privacy.html", "privacy", "Privacy Policy - VtectShop", "Privacy Policy", "Sample privacy content prepared for future production legal copy."],
  ["terms.html", "terms", "Terms - VtectShop", "Terms of Use", "Sample terms content for marketplace rules, listings, safety, and disputes."],
  ["404.html", "not-found", "Not Found - VtectShop", "Page Not Found", "The requested page is not available. Return home to continue browsing."],
  ["login.html", "login", "Login - VtectShop", "Welcome Back", "Login form with validation, loading state, password meter support, and feedback."],
  ["register.html", "register", "Register - VtectShop", "Create Your Account", "Registration form with validation, disabled states, and success messaging."],
  ["forgot-password.html", "forgot-password", "Forgot Password - VtectShop", "Recover Password", "Recover account access through a frontend-ready password reset flow."],
  ["reset-password.html", "reset-password", "Reset Password - VtectShop", "Reset Password", "Set a new password with validation and strength feedback."],
  ["email-verification.html", "email-verification", "Email Verification - VtectShop", "Verify Email", "Confirm an email address with a verification-code interface."],
  ["phone-verification.html", "phone-verification", "Phone Verification - VtectShop", "Verify Phone", "Confirm a phone number with a verification-code interface."],
  ["dashboard.html", "dashboard", "Dashboard - VtectShop", "User Dashboard", "Manage listings, messages, favorites, notifications, payments, and profile completion."],
  ["profile.html", "profile", "Profile - VtectShop", "Profile", "View seller identity, verification, ratings, and account details."],
  ["edit-profile.html", "edit-profile", "Edit Profile - VtectShop", "Edit Profile", "Update profile details through validated, backend-ready forms."],
  ["settings.html", "settings", "Settings - VtectShop", "Settings", "Manage account preferences, notifications, privacy, and theme persistence."],
  ["notifications.html", "notifications", "Notifications - VtectShop", "Notifications", "Review marketplace alerts, ad activity, payments, and account updates."],
  ["messages.html", "messages", "Messages - VtectShop", "Messages", "Use a responsive chat interface with threads, compose input, and message bubbles."],
  ["favorites.html", "favorites", "Favorites - VtectShop", "Favorites", "Review saved products and quickly return to interesting listings."],
  ["recently-viewed.html", "recently-viewed", "Recently Viewed - VtectShop", "Recently Viewed", "Return to products you inspected recently."],
  ["my-ads.html", "my-ads", "My Ads - VtectShop", "My Ads", "Manage active listings, views, prices, status, and edit actions."],
  ["create-ad.html", "create-ad", "Create Ad - VtectShop", "Create Ad", "Publish a marketplace listing with validated fields and upload-ready structure."],
  ["edit-ad.html", "edit-ad", "Edit Ad - VtectShop", "Edit Ad", "Update listing details through a polished form surface."],
  ["delete-ad.html", "delete-ad", "Delete Ad - VtectShop", "Delete Ad Confirmation", "Confirm destructive listing actions with clear cancel and delete states."],
  ["upgrade-ad.html", "upgrade-ad", "Upgrade Ad - VtectShop", "Upgrade Ad", "Choose promotional plans and featured placement options."],
  ["payments.html", "payments", "Payments - VtectShop", "Payments", "Review wallet balance, promotions, receipts, and payment states."],
  ["transaction-history.html", "transaction-history", "Transaction History - VtectShop", "Transaction History", "Browse payment references, transaction types, amounts, and statuses."],
  ["security.html", "security", "Security - VtectShop", "Security", "Manage password updates, email verification, phone verification, and account safety."],
  ["logout.html", "logout", "Logout - VtectShop", "Logout Confirmation", "Confirm session logout with a clear account-exit flow."],
  ["admin-dashboard.html", "admin-dashboard", "Admin Dashboard - VtectShop", "Admin Dashboard", "Monitor marketplace metrics, users, products, reports, payments, and analytics."],
  ["admin-users.html", "admin-users", "Admin Users - VtectShop", "Admin Users", "Manage users, verification states, ratings, locations, and activity."],
  ["admin-products.html", "admin-products", "Admin Products - VtectShop", "Admin Products", "Review products, categories, sellers, prices, and moderation status."],
  ["admin-categories.html", "admin-categories", "Admin Categories - VtectShop", "Admin Categories", "Manage category groups, icons, subcategory counts, and visibility."],
  ["admin-subcategories.html", "admin-subcategories", "Admin Subcategories - VtectShop", "Admin Subcategories", "Manage detailed category paths and listing counts."],
  ["admin-reports.html", "admin-reports", "Admin Reports - VtectShop", "Admin Reports", "Review reported listings, reasons, priority levels, and moderation queues."],
  ["admin-reviews.html", "admin-reviews", "Admin Reviews - VtectShop", "Admin Reviews", "Moderate seller reviews, ratings, and buyer feedback."],
  ["admin-payments.html", "admin-payments", "Admin Payments - VtectShop", "Admin Payments", "Track marketplace payments, receipts, statuses, and promotions."],
  ["admin-analytics.html", "admin-analytics", "Admin Analytics - VtectShop", "Admin Analytics", "Inspect frontend analytics cards and dummy chart data."],
  ["admin-settings.html", "admin-settings", "Admin Settings - VtectShop", "Admin Settings", "Configure marketplace name, support email, commission, and announcements."]
];

function html(file, page, title, heading, summary) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <meta name="description" content="${summary}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link rel="stylesheet" href="assets/css/variables.css">
    <link rel="stylesheet" href="assets/css/components.css">
    <link rel="stylesheet" href="assets/css/animations.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
    <link rel="stylesheet" href="assets/css/style.css">
  </head>
  <body data-page="${page}">
    <a class="skip-link" href="#main">Skip to content</a>
    <div id="navbar" aria-label="Site navigation placeholder"></div>

    <main id="main" tabindex="-1">
      <section class="section">
        <div class="container">
          <div class="card panel stack">
            <span class="section-kicker">VtectShop</span>
            <h1>${heading}</h1>
            <p>${summary}</p>
            <div class="row">
              <a class="chip" href="tel:+2348068578671">${contactPhone}</a>
              <a class="chip" href="mailto:${contactEmail}">${contactEmail}</a>
            </div>
            <div class="grid grid-3" aria-hidden="true">
              <div class="skeleton" style="height: 120px"></div>
              <div class="skeleton" style="height: 120px"></div>
              <div class="skeleton" style="height: 120px"></div>
            </div>
            <noscript>
              <p>This page uses vanilla JavaScript to render the full marketplace interface. Enable JavaScript to view the complete experience.</p>
            </noscript>
          </div>
        </div>
      </section>
    </main>

    <div id="footer" aria-label="Site footer placeholder"></div>
    <div id="modal-root"></div>
    <div id="toast-root"></div>

    <script src="assets/js/products.js"></script>
    <script src="assets/js/components.js"></script>
    <script src="assets/js/search.js"></script>
    <script src="assets/js/slider.js"></script>
    <script src="assets/js/validation.js"></script>
    <script src="assets/js/dashboard.js"></script>
    <script src="assets/js/messages.js"></script>
    <script src="assets/js/app.js"></script>
  </body>
</html>
`;
}

for (const page of pages) {
  fs.writeFileSync(path.join(root, page[0]), html(...page));
}

console.log(`Generated ${pages.length} readable HTML pages.`);
