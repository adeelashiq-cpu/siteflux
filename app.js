/**
 * Siteflux — WebLaunch Tools
 * Interactive Client-Side Logic & Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. Helper Utilities
     ========================================================================== */
  const $ = (id) => document.getElementById(id);
  const esc = (s = '') =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const toastEl = $('toast');
  const toastMsg = $('toastMessage');
  let toastTimer = null;

  function showToast(msg = 'Copied to clipboard') {
    if (toastTimer) clearTimeout(toastTimer);
    toastMsg.textContent = msg;
    toastEl.classList.add('show');
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 1800);
  }

  // Copy to clipboard with fallback & button visual state
  async function copyToClipboard(text, triggerBtn = null) {
    if (!text) return;
    let success = false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch (err) {
        success = false;
      }
    }

    // Fallback using textarea execCommand
    if (!success) {
      try {
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = text;
        tempTextarea.style.position = 'fixed';
        tempTextarea.style.opacity = '0';
        tempTextarea.style.left = '-9999px';
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        success = document.execCommand('copy');
        document.body.removeChild(tempTextarea);
      } catch (err) {
        success = false;
      }
    }

    if (success) {
      showToast('Copied to clipboard!');
      if (triggerBtn) {
        const originalHtml = triggerBtn.innerHTML;
        triggerBtn.classList.add('copied');
        triggerBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Copied!</span>
        `;
        setTimeout(() => {
          triggerBtn.classList.remove('copied');
          triggerBtn.innerHTML = originalHtml;
        }, 1600);
      }
    } else {
      showToast('Unable to copy automatically');
    }
  }

  // Global Delegated Copy Buttons
  document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('[data-copy]');
    if (copyBtn) {
      const targetId = copyBtn.dataset.copy;
      const targetElem = $(targetId);
      if (targetElem) {
        copyToClipboard(targetElem.textContent, copyBtn);
      }
    }
  });

  // Dynamic Year in Footer
  if ($('year')) {
    $('year').textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     2. Theme Toggle (Light / Dark Mode)
     ========================================================================== */
  const themeToggleBtn = $('themeToggleBtn');
  const themeMoonIcon = $('themeMoonIcon');
  const themeSunIcon = $('themeSunIcon');

  function getPreferredTheme() {
    const saved = localStorage.getItem('siteflux-theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('siteflux-theme', theme);
    if (theme === 'dark') {
      themeMoonIcon.style.display = 'none';
      themeSunIcon.style.display = 'block';
    } else {
      themeMoonIcon.style.display = 'block';
      themeSunIcon.style.display = 'none';
    }
  }

  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ==========================================================================
     3. Category Filter Tabs
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const toolCards = document.querySelectorAll('.tool-card');
  const toolShells = document.querySelectorAll('.tool-shell');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      toolCards.forEach((card) => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      toolShells.forEach((shell) => {
        if (filter === 'all' || shell.dataset.category === filter) {
          shell.classList.remove('is-hidden');
        } else {
          shell.classList.add('is-hidden');
        }
      });
    });
  });

  /* ==========================================================================
     4. Tool 1: Meta Tag Generator
     ========================================================================== */
  const metaTitle = $('metaTitle');
  const metaDesc = $('metaDesc');
  const canonicalUrl = $('canonicalUrl');
  const ogImageUrl = $('ogImageUrl');
  const twitterCardType = $('twitterCardType');
  const twitterHandle = $('twitterHandle');
  const robotsMeta = $('robotsMeta');
  const metaOutput = $('metaOutput');
  const titleCount = $('titleCount');
  const descCount = $('descCount');
  const generateMetaBtn = $('generateMetaBtn');
  const syncToSerpBtn = $('syncToSerpBtn');

  function updateMetaCounters() {
    if (titleCount && metaTitle) {
      titleCount.textContent = `${metaTitle.value.length}/60`;
    }
    if (descCount && metaDesc) {
      descCount.textContent = `${metaDesc.value.length}/160`;
    }
  }

  function generateMetaTags() {
    const title = metaTitle.value.trim();
    const desc = metaDesc.value.trim();
    const canonical = canonicalUrl.value.trim();
    const ogImg = ogImageUrl.value.trim();
    const twCard = twitterCardType.value;
    const twHandle = twitterHandle.value.trim();
    const robots = robotsMeta.value;

    const lines = [];

    // Check if any meaningful field has data
    if (!title && !desc && !canonical && !ogImg && !twHandle) {
      metaOutput.textContent = '<!-- Enter a title, description, or URL to generate meta tags -->';
      return;
    }

    // Standard SEO Tags
    if (title) lines.push(`<title>${esc(title)}</title>`);
    if (desc) lines.push(`<meta name="description" content="${esc(desc)}">`);
    if (canonical) lines.push(`<link rel="canonical" href="${esc(canonical)}">`);
    if (robots) lines.push(`<meta name="robots" content="${esc(robots)}">`);

    // Open Graph Tags
    lines.push(`\n<!-- Open Graph / Facebook -->`);
    lines.push(`<meta property="og:type" content="website">`);
    if (title) lines.push(`<meta property="og:title" content="${esc(title)}">`);
    if (desc) lines.push(`<meta property="og:description" content="${esc(desc)}">`);
    if (canonical) lines.push(`<meta property="og:url" content="${esc(canonical)}">`);
    if (ogImg) lines.push(`<meta property="og:image" content="${esc(ogImg)}">`);

    // Twitter Tags
    lines.push(`\n<!-- Twitter Card -->`);
    lines.push(`<meta name="twitter:card" content="${esc(twCard)}">`);
    if (twHandle) lines.push(`<meta name="twitter:site" content="${esc(twHandle)}">`);
    if (title) lines.push(`<meta name="twitter:title" content="${esc(title)}">`);
    if (desc) lines.push(`<meta name="twitter:description" content="${esc(desc)}">`);
    if (ogImg) lines.push(`<meta name="twitter:image" content="${esc(ogImg)}">`);

    metaOutput.textContent = lines.join('\n');
  }

  [metaTitle, metaDesc, canonicalUrl, ogImageUrl, twitterHandle].forEach((el) => {
    if (el) {
      el.addEventListener('input', () => {
        updateMetaCounters();
        generateMetaTags();
      });
    }
  });

  [twitterCardType, robotsMeta].forEach((el) => {
    if (el) el.addEventListener('change', generateMetaTags);
  });

  if (generateMetaBtn) {
    generateMetaBtn.addEventListener('click', generateMetaTags);
  }

  // Sync to SERP preview
  if (syncToSerpBtn) {
    syncToSerpBtn.addEventListener('click', () => {
      if (metaTitle.value) $('serpTitle').value = metaTitle.value;
      if (canonicalUrl.value) $('serpUrl').value = canonicalUrl.value;
      if (metaDesc.value) $('serpDesc').value = metaDesc.value;

      updateSerpPreview();
      showToast('Synced to SERP Preview');
      $('serp-preview').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     5. Tool 2: SERP Snippet Preview
     ========================================================================== */
  const serpTitle = $('serpTitle');
  const serpUrl = $('serpUrl');
  const serpDesc = $('serpDesc');
  const serpSiteName = $('serpSiteName');
  const serpTitleOut = $('serpTitleOut');
  const serpUrlOut = $('serpUrlOut');
  const serpDescOut = $('serpDescOut');
  const serpSiteNameOut = $('serpSiteNameOut');
  const serpFavicon = $('serpFavicon');
  const serpPixelWarning = $('serpPixelWarning');
  const googleResultBox = $('googleResultBox');
  const serpModeDesktop = $('serpModeDesktop');
  const serpModeMobile = $('serpModeMobile');

  function updateSerpPreview() {
    const titleVal = serpTitle.value.trim() || 'Modern Web Development Agency in Austin';
    const urlVal = serpUrl.value.trim() || 'https://example.com/services/web-design';
    const descVal = serpDesc.value.trim() || 'Craft high-performance websites with modern web standards and responsive aesthetics.';
    const siteVal = serpSiteName.value.trim() || 'Siteflux Studio';

    serpTitleOut.textContent = titleVal;
    serpUrlOut.textContent = urlVal;
    serpDescOut.textContent = descVal;
    serpSiteNameOut.textContent = siteVal;

    // Favicon letter
    serpFavicon.textContent = siteVal.charAt(0).toUpperCase() || 'S';

    // Title pixel length approximation (~600px cutoff on desktop, ~60 chars)
    const titleLen = titleVal.length;
    if (titleLen > 60) {
      serpPixelWarning.textContent = `Warning: Title may be truncated (${titleLen}/60 chars)`;
      serpPixelWarning.className = 'pixel-badge warning';
    } else {
      serpPixelWarning.textContent = `Optimal Title Length (${titleLen}/60 chars)`;
      serpPixelWarning.className = 'pixel-badge';
    }
  }

  [serpTitle, serpUrl, serpDesc, serpSiteName].forEach((el) => {
    if (el) el.addEventListener('input', updateSerpPreview);
  });

  if (serpModeDesktop && serpModeMobile) {
    serpModeDesktop.addEventListener('click', () => {
      serpModeDesktop.classList.add('active');
      serpModeMobile.classList.remove('active');
      googleResultBox.classList.remove('mobile');
    });

    serpModeMobile.addEventListener('click', () => {
      serpModeMobile.classList.add('active');
      serpModeDesktop.classList.remove('active');
      googleResultBox.classList.add('mobile');
    });
  }

  /* ==========================================================================
     6. Tool 3: Robots.txt Generator
     ========================================================================== */
  const robotPreset = $('robotPreset');
  const robotAgent = $('robotAgent');
  const robotDisallow = $('robotDisallow');
  const robotAllow = $('robotAllow');
  const robotSitemap = $('robotSitemap');
  const robotCrawlDelay = $('robotCrawlDelay');
  const robotsOutput = $('robotsOutput');
  const generateRobotsBtn = $('generateRobotsBtn');
  const downloadRobotsBtn = $('downloadRobotsBtn');

  function applyRobotPreset() {
    const preset = robotPreset.value;
    if (preset === 'allow-all') {
      robotAgent.value = '*';
      robotDisallow.value = '';
      robotAllow.value = '';
    } else if (preset === 'block-all') {
      robotAgent.value = '*';
      robotDisallow.value = '/';
      robotAllow.value = '';
    } else if (preset === 'wordpress') {
      robotAgent.value = '*';
      robotDisallow.value = '/wp-admin/\n/trackback/\n/xmlrpc.php';
      robotAllow.value = '/wp-admin/admin-ajax.php';
    } else if (preset === 'ecommerce') {
      robotAgent.value = '*';
      robotDisallow.value = '/cart/\n/checkout/\n/account/\n/search/';
      robotAllow.value = '';
    }
    generateRobotsTxt();
  }

  function generateRobotsTxt() {
    const agent = robotAgent.value.trim() || '*';
    const disallowRaw = robotDisallow.value.trim();
    const allowRaw = robotAllow.value.trim();
    const sitemap = robotSitemap.value.trim();
    const delay = robotCrawlDelay.value.trim();

    let output = `# robots.txt generated by Siteflux (https://siteflux.dev)\n`;
    output += `User-agent: ${agent}\n`;

    if (disallowRaw) {
      disallowRaw.split('\n').forEach((path) => {
        const clean = path.trim();
        if (clean) output += `Disallow: ${clean}\n`;
      });
    } else {
      output += `Disallow:\n`;
    }

    if (allowRaw) {
      allowRaw.split('\n').forEach((path) => {
        const clean = path.trim();
        if (clean) output += `Allow: ${clean}\n`;
      });
    }

    if (delay) {
      output += `Crawl-delay: ${delay}\n`;
    }

    if (sitemap) {
      output += `Sitemap: ${sitemap}\n`;
    }

    robotsOutput.textContent = output.trim();
  }

  if (robotPreset) robotPreset.addEventListener('change', applyRobotPreset);
  [robotAgent, robotDisallow, robotAllow, robotSitemap, robotCrawlDelay].forEach((el) => {
    if (el) el.addEventListener('input', generateRobotsTxt);
  });

  if (generateRobotsBtn) generateRobotsBtn.addEventListener('click', generateRobotsTxt);

  if (downloadRobotsBtn) {
    downloadRobotsBtn.addEventListener('click', () => {
      const text = robotsOutput.textContent;
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'robots.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Downloaded robots.txt');
    });
  }

  /* ==========================================================================
     7. Tool 4: Schema JSON-LD Generator
     ========================================================================== */
  const schemaType = $('schemaType');
  const schemaName = $('schemaName');
  const schemaUrl = $('schemaUrl');
  const schemaLogo = $('schemaLogo');
  const schemaWrapScript = $('schemaWrapScript');
  const schemaOutput = $('schemaOutput');
  const generateSchemaBtn = $('generateSchemaBtn');

  // Schema Sub-field Containers
  const localBusinessFields = $('localBusinessFields');
  const articleFields = $('articleFields');
  const faqFields = $('faqFields');
  const productFields = $('productFields');

  function updateSchemaFieldsVisibility() {
    const type = schemaType.value;
    localBusinessFields.style.display = type === 'LocalBusiness' ? 'grid' : 'none';
    articleFields.style.display = type === 'Article' ? 'grid' : 'none';
    faqFields.style.display = type === 'FAQPage' ? 'grid' : 'none';
    productFields.style.display = type === 'Product' ? 'grid' : 'none';
  }

  function generateSchemaJson() {
    const type = schemaType.value;
    const name = schemaName.value.trim() || 'Acme Studio';
    const url = schemaUrl.value.trim() || 'https://example.com';
    const logo = schemaLogo.value.trim();

    let schemaObj = {
      '@context': 'https://schema.org',
      '@type': type
    };

    if (type === 'Organization') {
      schemaObj.name = name;
      schemaObj.url = url;
      if (logo) schemaObj.logo = logo;
    } else if (type === 'LocalBusiness') {
      schemaObj.name = name;
      schemaObj.url = url;
      if (logo) schemaObj.image = logo;

      const phone = $('schemaPhone').value.trim();
      const street = $('schemaStreet').value.trim();
      const city = $('schemaCity').value.trim();
      const postal = $('schemaPostal').value.trim();
      const country = $('schemaCountry').value.trim() || 'US';

      if (phone) schemaObj.telephone = phone;
      if (street || city || postal) {
        schemaObj.address = {
          '@type': 'PostalAddress',
          streetAddress: street || undefined,
          addressLocality: city || undefined,
          postalCode: postal || undefined,
          addressCountry: country || undefined
        };
      }
    } else if (type === 'Article') {
      schemaObj.headline = $('schemaHeadline').value.trim() || name;
      schemaObj.url = url;
      if (logo) schemaObj.image = logo;

      const author = $('schemaAuthor').value.trim();
      const datePub = $('schemaDatePublished').value;

      if (author) {
        schemaObj.author = {
          '@type': 'Person',
          name: author
        };
      }
      if (datePub) schemaObj.datePublished = datePub;
    } else if (type === 'FAQPage') {
      const q1 = $('schemaFaqQ1').value.trim();
      const a1 = $('schemaFaqA1').value.trim();
      const q2 = $('schemaFaqQ2').value.trim();
      const a2 = $('schemaFaqA2').value.trim();

      const mainEntity = [];
      if (q1 && a1) {
        mainEntity.push({
          '@type': 'Question',
          name: q1,
          acceptedAnswer: { '@type': 'Answer', text: a1 }
        });
      }
      if (q2 && a2) {
        mainEntity.push({
          '@type': 'Question',
          name: q2,
          acceptedAnswer: { '@type': 'Answer', text: a2 }
        });
      }
      schemaObj.mainEntity = mainEntity;
    } else if (type === 'Product') {
      schemaObj.name = name;
      schemaObj.url = url;
      if (logo) schemaObj.image = logo;

      const price = $('schemaProdPrice').value.trim();
      const currency = $('schemaProdCurrency').value.trim() || 'USD';
      const avail = $('schemaProdAvail').value;

      if (price) {
        schemaObj.offers = {
          '@type': 'Offer',
          price: price,
          priceCurrency: currency,
          availability: avail
        };
      }
    }

    const formattedJson = JSON.stringify(schemaObj, null, 2);
    if (schemaWrapScript.checked) {
      schemaOutput.textContent = `<script type="application/ld+json">\n${formattedJson}\n</script>`;
    } else {
      schemaOutput.textContent = formattedJson;
    }
  }

  if (schemaType) {
    schemaType.addEventListener('change', () => {
      updateSchemaFieldsVisibility();
      generateSchemaJson();
    });
  }

  if (schemaWrapScript) {
    schemaWrapScript.addEventListener('change', generateSchemaJson);
  }

  if (generateSchemaBtn) {
    generateSchemaBtn.addEventListener('click', generateSchemaJson);
  }

  document.querySelectorAll('#schema-generator input, #schema-generator textarea, #schema-generator select').forEach((el) => {
    el.addEventListener('input', generateSchemaJson);
  });

  /* ==========================================================================
     8. Tool 5: UTM Campaign Builder
     ========================================================================== */
  const utmUrl = $('utmUrl');
  const utmSource = $('utmSource');
  const utmMedium = $('utmMedium');
  const utmCampaign = $('utmCampaign');
  const utmTerm = $('utmTerm');
  const utmContent = $('utmContent');
  const utmOutput = $('utmOutput');
  const generateUtmBtn = $('generateUtmBtn');
  const openUtmBtn = $('openUtmBtn');

  function generateUtmUrl() {
    const rawUrl = utmUrl.value.trim();
    if (!rawUrl) {
      utmOutput.textContent = 'Enter a destination website URL above.';
      if (openUtmBtn) openUtmBtn.style.display = 'none';
      return;
    }

    try {
      const urlObj = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
      const params = [
        ['utm_source', utmSource.value.trim()],
        ['utm_medium', utmMedium.value.trim()],
        ['utm_campaign', utmCampaign.value.trim()],
        ['utm_term', utmTerm.value.trim()],
        ['utm_content', utmContent.value.trim()]
      ];

      params.forEach(([key, val]) => {
        if (val) {
          urlObj.searchParams.set(key, val);
        } else {
          urlObj.searchParams.delete(key);
        }
      });

      const finalUrl = urlObj.toString();
      utmOutput.textContent = finalUrl;

      if (openUtmBtn) {
        openUtmBtn.href = finalUrl;
        openUtmBtn.style.display = 'inline-flex';
      }
    } catch (err) {
      utmOutput.textContent = 'Please enter a valid website URL format.';
      if (openUtmBtn) openUtmBtn.style.display = 'none';
    }
  }

  // Preset buttons
  document.querySelectorAll('#utmPresets .preset-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      utmSource.value = chip.dataset.source || '';
      utmMedium.value = chip.dataset.medium || '';
      utmCampaign.value = chip.dataset.campaign || '';
      generateUtmUrl();
      showToast(`Applied ${chip.textContent} preset`);
    });
  });

  [utmUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent].forEach((el) => {
    if (el) el.addEventListener('input', generateUtmUrl);
  });

  if (generateUtmBtn) generateUtmBtn.addEventListener('click', generateUtmUrl);

  /* ==========================================================================
     9. Tool 6: Website Launch Checklist
     ========================================================================== */
  const defaultChecklistCategories = [
    {
      name: 'SEO & Metadata',
      icon: '🔍',
      items: [
        { id: 'seo-titles', text: 'Page titles and meta descriptions verified on key pages' },
        { id: 'seo-canonical', text: 'Canonical URL tags verified to prevent duplicate content' },
        { id: 'seo-sitemap', text: 'XML sitemap generated and verified in Google Search Console' },
        { id: 'seo-robots', text: 'Robots.txt tested and not accidentally blocking indexable assets' },
        { id: 'seo-redirects', text: '301 permanent redirects mapped for any changed or old URLs' }
      ]
    },
    {
      name: 'Performance & Mobile',
      icon: '⚡',
      items: [
        { id: 'perf-images', text: 'Images compressed with modern formats (WebP/AVIF)' },
        { id: 'perf-responsive', text: 'Tested responsive layout on mobile, tablet, and desktop' },
        { id: 'perf-lazy', text: 'Lazy loading enabled for offscreen images and embeds' },
        { id: 'perf-cache', text: 'Browser caching and gzip/brotli compression verified' }
      ]
    },
    {
      name: 'Security & Legal Compliance',
      icon: '🔒',
      items: [
        { id: 'sec-https', text: 'Valid SSL/HTTPS certificate active with automatic HTTP redirect' },
        { id: 'sec-headers', text: 'Security headers reviewed (X-Content-Type-Options, CSP)' },
        { id: 'sec-privacy', text: 'Privacy Policy, Terms of Service, and Cookie banner published' }
      ]
    },
    {
      name: 'Tracking & Quality Assurance',
      icon: '🎯',
      items: [
        { id: 'qa-analytics', text: 'Google Analytics 4 / tracking tags firing accurately' },
        { id: 'qa-forms', text: 'All contact forms, CTAs, and automated confirmation emails tested' },
        { id: 'qa-404', text: 'Custom 404 error page configured with navigation back home' },
        { id: 'qa-favicon', text: 'Favicon, apple-touch-icon, and Open Graph share cards verified' }
      ]
    }
  ];

  const checklistContainer = $('checklistContainer');
  const progressBar = $('progressBar');
  const progressText = $('progressText');
  const progressPercent = $('progressPercent');
  const resetChecklist = $('resetChecklist');
  const exportChecklistMarkdown = $('exportChecklistMarkdown');
  const newChecklistInput = $('newChecklistInput');
  const addChecklistBtn = $('addChecklistBtn');

  // Load Saved State & Custom Tasks
  function getChecklistState() {
    try {
      // Check for new ID-based storage
      const saved = localStorage.getItem('siteflux-checklist');
      if (saved) return JSON.parse(saved);

      // Backward compatibility with legacy index-based array storage
      const legacy = localStorage.getItem('weblaunch-checklist');
      if (legacy) {
        const arr = JSON.parse(legacy);
        const migrated = {};
        let flatIdx = 0;
        defaultChecklistCategories.forEach((cat) => {
          cat.items.forEach((item) => {
            if (arr[flatIdx]) migrated[item.id] = true;
            flatIdx++;
          });
        });
        return migrated;
      }
    } catch (e) {
      return {};
    }
    return {};
  }

  function saveChecklistState(state) {
    localStorage.setItem('siteflux-checklist', JSON.stringify(state));
  }

  function getCustomTasks() {
    try {
      return JSON.parse(localStorage.getItem('siteflux-custom-tasks') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveCustomTasks(tasks) {
    localStorage.setItem('siteflux-custom-tasks', JSON.stringify(tasks));
  }

  function renderChecklist() {
    const state = getChecklistState();
    const customTasks = getCustomTasks();
    checklistContainer.innerHTML = '';

    let totalTasks = 0;
    let completedTasks = 0;

    // Render categorized standard tasks
    defaultChecklistCategories.forEach((cat) => {
      const groupEl = document.createElement('div');
      groupEl.className = 'checklist-category-group';

      const titleEl = document.createElement('div');
      titleEl.className = 'checklist-category-title';
      titleEl.innerHTML = `${cat.icon} ${cat.name} <span>${cat.items.length}</span>`;
      groupEl.appendChild(titleEl);

      const listEl = document.createElement('div');
      listEl.className = 'checklist';

      cat.items.forEach((item) => {
        totalTasks++;
        const isChecked = !!state[item.id];
        if (isChecked) completedTasks++;

        const checkItem = document.createElement('div');
        checkItem.className = `check-item ${isChecked ? 'completed' : ''}`;

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = item.id;
        input.checked = isChecked;

        const label = document.createElement('label');
        label.htmlFor = item.id;
        label.textContent = item.text;

        input.addEventListener('change', () => {
          const s = getChecklistState();
          s[item.id] = input.checked;
          saveChecklistState(s);
          renderChecklist();
        });

        checkItem.appendChild(input);
        checkItem.appendChild(label);
        listEl.appendChild(checkItem);
      });

      groupEl.appendChild(listEl);
      checklistContainer.appendChild(groupEl);
    });

    // Render custom tasks if any exist
    if (customTasks.length > 0) {
      const customGroup = document.createElement('div');
      customGroup.className = 'checklist-category-group';

      const customTitle = document.createElement('div');
      customTitle.className = 'checklist-category-title';
      customTitle.innerHTML = `✨ Custom Tasks <span>${customTasks.length}</span>`;
      customGroup.appendChild(customTitle);

      const customList = document.createElement('div');
      customList.className = 'checklist';

      customTasks.forEach((task) => {
        totalTasks++;
        const isChecked = !!state[task.id];
        if (isChecked) completedTasks++;

        const checkItem = document.createElement('div');
        checkItem.className = `check-item ${isChecked ? 'completed' : ''}`;

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = task.id;
        input.checked = isChecked;

        const label = document.createElement('label');
        label.htmlFor = task.id;
        label.textContent = task.text;

        input.addEventListener('change', () => {
          const s = getChecklistState();
          s[task.id] = input.checked;
          saveChecklistState(s);
          renderChecklist();
        });

        checkItem.appendChild(input);
        checkItem.appendChild(label);
        customList.appendChild(checkItem);
      });

      customGroup.appendChild(customList);
      checklistContainer.appendChild(customGroup);
    }

    // Update progress meter
    const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    progressText.textContent = `${completedTasks} of ${totalTasks} complete`;
    progressPercent.textContent = `${pct}%`;
    progressBar.style.width = `${pct}%`;
  }

  // Add Custom Task
  if (addChecklistBtn && newChecklistInput) {
    const handleAddTask = () => {
      const text = newChecklistInput.value.trim();
      if (!text) return;
      const tasks = getCustomTasks();
      const newTask = {
        id: `custom-${Date.now()}`,
        text: text
      };
      tasks.push(newTask);
      saveCustomTasks(tasks);
      newChecklistInput.value = '';
      renderChecklist();
      showToast('Custom task added');
    };

    addChecklistBtn.addEventListener('click', handleAddTask);
    newChecklistInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAddTask();
    });
  }

  // Reset Checklist
  if (resetChecklist) {
    resetChecklist.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all checklist progress?')) {
        localStorage.removeItem('siteflux-checklist');
        localStorage.removeItem('siteflux-custom-tasks');
        localStorage.removeItem('weblaunch-checklist');
        renderChecklist();
        showToast('Checklist reset');
      }
    });
  }

  // Export as Markdown
  if (exportChecklistMarkdown) {
    exportChecklistMarkdown.addEventListener('click', () => {
      const state = getChecklistState();
      const customTasks = getCustomTasks();
      let md = `# Website Launch Checklist Audit — Siteflux\n\n`;

      defaultChecklistCategories.forEach((cat) => {
        md += `### ${cat.name}\n`;
        cat.items.forEach((item) => {
          const checked = state[item.id] ? '[x]' : '[ ]';
          md += `- ${checked} ${item.text}\n`;
        });
        md += `\n`;
      });

      if (customTasks.length > 0) {
        md += `### Custom Launch Tasks\n`;
        customTasks.forEach((item) => {
          const checked = state[item.id] ? '[x]' : '[ ]';
          md += `- ${checked} ${item.text}\n`;
        });
        md += `\n`;
      }

      copyToClipboard(md, exportChecklistMarkdown);
      showToast('Markdown checklist copied to clipboard!');
    });
  }

  /* ==========================================================================
     10. Initial Invocations
     ========================================================================== */
  updateMetaCounters();
  generateMetaTags();
  updateSerpPreview();
  generateRobotsTxt();
  updateSchemaFieldsVisibility();
  generateSchemaJson();
  generateUtmUrl();
  renderChecklist();
});
