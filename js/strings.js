/**
 * strings.js
 * Fetches data/strings.json and renders the in-stock string catalog
 * on the stringing page.
 *
 * Each string object supports:
 *   id, name, brand, gauge, price (number), type, tags (array),
 *   color1, color2 (hex; used to paint the placeholder visual),
 *   image (optional path to a real photo — overrides the swatch),
 *   description
 *
 * To edit strings: open data/strings.json in any text editor.
 */

(async function renderStrings() {
  const mount = document.getElementById('string-grid');
  if (!mount) return;

  let strings = [];
  try {
    const res = await fetch('data/strings.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    strings = await res.json();
  } catch (err) {
    mount.innerHTML = `
      <div class="feature-card" style="grid-column:1/-1;">
        <h3>Couldn't load strings catalog</h3>
        <p class="muted">If you're viewing this by double-clicking the HTML file, the browser blocks the data fetch. Serve the site with a local HTTP server, or just deploy it — GitHub Pages serves it correctly. (Error: ${err.message})</p>
      </div>`;
    return;
  }

  // Sort: cheapest first so the $5 options are visible at the top.
  strings.sort((a, b) => a.price - b.price);

  const escape = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const cards = strings.map((s) => {
    const tags = (s.tags || []).map(t => `<span class="tag">${escape(t)}</span>`).join('');
    const visual = s.image
      ? `<img src="${escape(s.image)}" alt="${escape(s.name)}">`
      : `<div class="strand" style="--c1:${escape(s.color1 || '#444')};--c2:${escape(s.color2 || '#222')};"></div>
         <div class="brand-stamp">${escape(s.brand || '')}</div>`;

    return `
      <article class="string-card" id="${escape(s.id)}">
        <div class="string-visual">${visual}</div>
        <div class="string-body">
          <div class="string-top">
            <div>
              <div class="string-name">${escape(s.name)}</div>
              <div class="string-gauge">${escape(s.gauge || '')}${s.type ? ' · ' + escape(s.type) : ''}</div>
            </div>
            <div class="string-price">$${Number(s.price).toFixed(0)}<span class="per">Installed</span></div>
          </div>
          <p class="string-desc">${escape(s.description || '')}</p>
          <div class="string-tags">${tags}</div>
        </div>
      </article>`;
  }).join('');

  mount.innerHTML = cards;
})();
