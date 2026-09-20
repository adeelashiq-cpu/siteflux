# Siteflux — WebLaunch Tools

A modern, fast, privacy-focused client-side toolkit designed for web developers, SEO specialists, digital marketers, and freelancers. 100% browser-based with zero external runtime dependencies.

![Siteflux WebLaunch Toolkit](https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80)

---

## 🛠️ Included Tools

1. **Meta Tag Generator**
   - Live real-time generation of SEO titles, meta descriptions, canonical URLs, and robots indexing directives.
   - Generates Open Graph (`og:title`, `og:image`, etc.) and Twitter Card tags (`summary_large_image`, `summary`).
   - Character length counters and instant one-click **"Sync to SERP Preview"**.

2. **Google SERP Snippet Preview**
   - Live visual simulation of Google search results with site name, favicon badge, and breadcrumb path.
   - **Desktop vs. Mobile switch** with realistic preview styling.
   - Real-time character count and pixel-width cutoff truncation warnings.

3. **Robots.txt Generator**
   - Quick presets: *Default (Allow All)*, *Block All (Staging)*, *WordPress Standard*, and *E-Commerce*.
   - Support for multiple disallow paths, allow rules, crawl delays, and XML sitemaps.
   - Copy to clipboard or direct **"Download robots.txt"** file export.

4. **Schema JSON-LD Generator**
   - Google Rich Results compliant structured data.
   - Supported schema types:
     - `Organization` (Company details, logo, website)
     - `LocalBusiness` (Complete postal address, geo, phone)
     - `Article` (Author, headline, publish date, image)
     - `FAQPage` (Questions and answers array)
     - `Product` (Price, currency, and stock availability)
   - Toggle to wrap inside `<script type="application/ld+json">` tags and a direct link to test in Google's Rich Results Tester.

5. **UTM Campaign Builder**
   - Quick one-click channel presets: *Google Ads*, *Facebook / Meta*, *Email Newsletter*, *LinkedIn*, and *Twitter / X*.
   - Supports `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, and `utm_content`.
   - Automatic URL parameter encoding and instant test link launcher.

6. **Website Launch Audit Checklist**
   - Categorized audit covering:
     - 🔍 *SEO & Metadata*
     - ⚡ *Performance & Mobile*
     - 🔒 *Security & Legal Compliance*
     - 🎯 *Tracking & Quality Assurance*
   - Add custom launch tasks on the fly.
   - Progress meter with percentage and remaining tasks count.
   - Resilient ID-based storage with `localStorage` persistence.
   - **Export as Markdown** ready to paste into GitHub Issues, Notion, Slack, or Linear.

---

## 🎨 Design & Accessibility Features

- **Dark / Light Mode Switcher**: Seamless theme toggle stored in `localStorage` with system `prefers-color-scheme` support.
- **Category Filter Pills**: Filter toolbox by *SEO*, *Technical*, *Analytics*, or *Launch QA*.
- **Accessible Forms**: Full `<label for="...">` associations for screen readers and keyboard navigation.
- **Micro-Interactions**: Visual `✓ Copied!` state confirmation on all copy buttons with automatic fallback for older browsers.
- **Zero Server Latency**: Complete privacy — user inputs, URLs, and secrets never leave your device.

---

## 🚀 Running Locally

1. Open `index.html` directly in any modern browser:
   ```bash
   # Or using any lightweight static server:
   npx serve .
   # or Python:
   python -m http.server 3000
   ```
2. Navigate to `http://localhost:3000`.

---

## 📦 Deployment

Upload this static folder directly to any static web host:
- **Netlify**: Drag and drop folder into Netlify Drop.
- **Vercel**: Run `vercel` in the project root.
- **GitHub Pages**: Push repository and enable GitHub Pages in repo Settings.
- **Cloudflare Pages**: Connect repository or upload assets.

---

## 📄 License
MIT License. Free for personal and commercial use.
