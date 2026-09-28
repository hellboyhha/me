function setTheme(light, persist) {
  document.body.classList.toggle('light', light);
  document.getElementById('to-light').setAttribute('aria-pressed', String(light));
  document.getElementById('to-dark').setAttribute('aria-pressed', String(!light));
  if (persist !== false) { try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch (e) {} }
}
document.getElementById('to-light').addEventListener('click', () => setTheme(true));
document.getElementById('to-dark').addEventListener('click', () => setTheme(false));
try { const s = localStorage.getItem('theme'); setTheme(s ? s === 'light' : window.matchMedia('(prefers-color-scheme: light)').matches, false); } catch (e) { setTheme(false, false); }

(function () {
  'use strict';

  const S = window.SITE || {};
  const $ = (id) => document.getElementById(id);

  /* ------------------------------------------------------------- escaping */
  const esc = (v) => String(v == null ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const safeHref = (u) => (/^(https?:|mailto:)/i.test(String(u || '')) ? esc(u) : '#');
  const isExternal = (u) => /^https?:/i.test(String(u || ''));

  /* ------------------------------------------------------------- durations */
  const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };

  const nowMonths = () => {
    const d = new Date();
    return d.getFullYear() * 12 + d.getMonth();
  };

  const monthToken = (token) => {
    const t = String(token || '').trim().toLowerCase();
    if (/^\d{4}$/.test(t)) return { y: Number(t), m: 0 };
    const bits = t.split(/\s+/);
    if (bits.length !== 2 || !/^\d{4}$/.test(bits[1])) return null;
    const m = MONTHS[bits[0].slice(0, 3)];
    return m === undefined ? null : { y: Number(bits[1]), m: m };
  };

  const periodParts = (period) => String(period || '').split(/\s*[\u2014\u2013]\s*|\s+-\s+/).filter(Boolean);

  const spanMonths = (period) => {
    const parts = periodParts(period);
    if (parts.length < 2) return null;
    const start = monthToken(parts[0]);
    if (!start) return null;
    const open = /present|now|current/i.test(parts[1]);
    const endTok = open ? null : monthToken(parts[1]);
    if (!open && !endTok) return null;
    const end = open ? nowMonths() : endTok.y * 12 + endTok.m;
    const from = start.y * 12 + start.m;
    return end < from ? null : end - from;
  };

  const fmtSpan = (n) => {
    if (n == null) return '—';
    if (n < 1) return '<1mo';
    const y = Math.floor(n / 12);
    const m = n % 12;
    if (!y) return m + 'mo';
    return m ? y + 'y ' + m + 'mo' : y + 'y';
  };

  const ageOf = (period) => {
    const n = spanMonths(period);
    return n == null ? String(period || '—') : fmtSpan(n);
  };

  // the live career total is computed in data.js (SITE.career) so every view agrees

  const repoSlug = (u) => {
    const clean = String(u || '').replace(/\/+$/, '');
    const bits = clean.split('/').filter(Boolean);
    return bits.length >= 2 ? bits.slice(-2).join('/') : clean;
  };

  const tenure = (period, current) => {
    if (current || /present|now|current/i.test(String(period || ''))) return { text: 'running', tone: 'green' };
    return { text: 'completed', tone: 'soft' };
  };

  const pillHTML = (st) => (st
    ? '<span class="pill ' + esc(st.tone) + '"><span class="p-dot"></span>' + esc(st.text) + '</span>'
    : '<span class="muted-dash">—</span>');

  /* ----------------------------------------------------------- data shapes */
  const VIEWS = {
    about: {
      label: 'About', group: 'overview', kind: 'profile', placeholder: 'filter about',
      columns: [
        { k: 'name', label: 'name' },
        { k: 'status', label: 'status', cls: 'col-status' },
        { k: 'age', label: 'experience', cls: 'col-age' }
      ],
      rows: () => {
        const slug = String(S.name || '').trim().toLowerCase().replace(/\s+/g, '-') || 'profile';
        const status = { text: 'running', tone: 'green' };
        return [{
          id: 'profile', name: slug, sub: S.role, status: status, age: S.career.label(), payload: null,
          search: [slug, S.role, S.location, S.about, (S.services || []).join(' ')].join(' ')
        }];
      }
    },
    experience: {
      label: 'Experience', group: 'workloads', kind: 'role', placeholder: 'filter experience',
      columns: [
        { k: 'name', label: 'name' },
        { k: 'status', label: 'status', cls: 'col-status' },
        { k: 'age', label: 'age', cls: 'col-age' }
      ],
      rows: () => (S.experience || []).map((e, i) => ({
        id: 'xp-' + i,
        name: e.role,
        sub: [e.company, e.place].filter(Boolean).join(' · '),
        status: tenure(e.period, e.current),
        age: ageOf(e.period),
        payload: e,
        search: [e.role, e.company, e.place, e.period, e.current ? 'running current' : 'completed'].join(' ')
      }))
    },
    projects: {
      label: 'Projects', group: 'workloads', kind: 'repository', placeholder: 'filter projects',
      columns: [
        { k: 'name', label: 'name' },
        { k: 'tech', label: 'tech', cls: 'col-tech' },
        { k: 'year', label: 'year', cls: 'col-age' }
      ],
      rows: () => (S.projects || []).map((p, i) => ({
        id: 'proj-' + i,
        name: p.name,
        sub: p.blurb,
        tech: p.tech,
        year: p.year || '—',
        url: p.url,
        payload: p,
        search: [p.name, p.blurb, p.tech, p.year, repoSlug(p.url)].join(' ')
      }))
    },
    certs: {
      label: 'Certifications', group: 'config', kind: 'credential', placeholder: 'filter certifications',
      groupBy: 'issuer', groupOrder: ['CNCF', 'Microsoft', 'AWS', 'HashiCorp', 'Databricks'],
      /* Groups are keyed by their short name so filtering on `cncf` still works,
         but the header can read as the full name. */
      groupLabel: { CNCF: 'Cloud Native Computing Foundation', AWS: 'Amazon Web Services' },
      columns: [
        { k: 'name', label: 'name' },
        { k: 'code', label: 'code', cls: 'col-code' }
      ],
      rows: () => (S.certs || []).map((c, i) => ({
        id: 'cert-' + i,
        name: c.name,
        issuer: c.issuer,
        code: c.code,
        badge: c.badge,
        url: c.url,
        payload: c,
        search: [c.name, c.issuer, c.code].join(' ')
      }))
    },
    education: {
      label: 'Education', group: 'config', kind: 'education', placeholder: 'filter education',
      columns: [
        { k: 'name', label: 'name' },
        { k: 'status', label: 'status', cls: 'col-status' },
        { k: 'age', label: 'years', cls: 'col-age' }
      ],
      rows: () => {
        const ed = S.education || {};
        return [{
          id: 'edu', name: ed.school, sub: [ed.degree, ed.place].filter(Boolean).join(' · '), status: tenure(ed.years, false), age: ageOf(ed.years), payload: ed,
          search: [ed.school, ed.degree, ed.major, ed.place, ed.years].join(' ')
        }];
      }
    },
    contact: {
      label: 'Contact', group: 'network', kind: 'channel', placeholder: 'filter contact',
      columns: [
        { k: 'name', label: 'name' },
        { k: 'value', label: 'value', cls: 'col-value' },
        { k: 'status', label: 'status', cls: 'col-status' }
      ],
      rows: () => (S.contact || []).map((c, i) => ({
        id: 'ch-' + i,
        name: c.label,
        value: c.value,
        url: c.url,
        status: { text: 'reachable', tone: 'green' },
        payload: c,
        search: [c.label, c.value].join(' ')
      }))
    }
  };

  const NAV = [
    { group: 'OVERVIEW', items: ['about'] },
    { group: 'WORKLOADS', items: ['experience', 'projects'] },
    { group: 'CONFIG', items: ['certs', 'education'] },
    { group: 'NETWORK', items: ['contact'] }
  ];

  const ICONS = {
    about: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.4"/><path d="M5.6 19.4c1.3-3.1 3.6-4.7 6.4-4.7s5.1 1.6 6.4 4.7"/></svg>',
    experience: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7.5" width="18" height="12" rx="2.2"/><path d="M9 7.5V6.2A2.2 2.2 0 0 1 11.2 4h1.6A2.2 2.2 0 0 1 15 6.2v1.3M3 12.6h18"/></svg>',
    projects: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.4 20 8v8l-8 4.6L4 16V8z"/><path d="M4 8l8 4.6L20 8M12 12.6v8"/></svg>',
    certs: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="5"/><path d="M8.7 13.4 7.2 21l4.8-2.5 4.8 2.5-1.5-7.6"/></svg>',
    education: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9.4 12 5l9 4.4-9 4.4z"/><path d="M7.2 11.7V16c0 1.4 2.1 2.5 4.8 2.5s4.8-1.1 4.8-2.5v-4.3"/></svg>',
    contact: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2.2"/><path d="m3.6 7 8.4 6 8.4-6"/></svg>'
  };

  const rowCache = {};
  function rowsOf(id) {
    if (!rowCache[id]) {
      const view = VIEWS[id];
      let rows = view.rows();
      if (view.groupBy && view.groupOrder) {
        const rank = (r) => {
          const i = view.groupOrder.indexOf(r[view.groupBy]);
          return i < 0 ? view.groupOrder.length : i;
        };
        // sort() is stable, so rows keep their authored order inside each group
        rows = rows.slice().sort((a, b) => rank(a) - rank(b));
      }
      rowCache[id] = rows.map((r) => Object.assign(r, { view: id, kind: view.kind }));
    }
    return rowCache[id];
  }

  /* ------------------------------------------------------------------ cells */
  const cellLink = (url, text) =>
    '<a class="cell-link" href="' + safeHref(url) + '"' + (isExternal(url) ? ' target="_blank" rel="noopener"' : '') + ' title="' + esc(text) + '">' +
      '<span class="ell">' + esc(text) + '</span>' +
      (isExternal(url) ? '<span class="arw" aria-hidden="true">↗</span>' : '') +
    '</a>';

  function cellHTML(k, r) {
    if (k === 'name') {
      return '<span class="cellname">' + esc(r.name) + '</span>' +
        (r.sub ? '<span class="cellsub">' + esc(r.sub) + '</span>' : '');
    }
    if (k === 'status') return pillHTML(r.status);
    if (k === 'age') return '<span class="cellage">' + esc(r.age || '—') + '</span>';
    if (k === 'year') return '<span class="cellage">' + esc(r.year || '—') + '</span>';
    if (k === 'tech') return '<span class="celltech">' + esc(r.tech || '—') + '</span>';
    if (k === 'issuer') return '<span class="celltech">' + esc(r.issuer || '—') + '</span>';
    if (k === 'code') {
      /* A credential without an exam code can carry its badge artwork instead.
         alt is empty because the row already names it. */
      if (r.badge) return '<img class="code-badge" src="' + esc(r.badge) + '" alt="">';
      return r.code ? '<span class="code">' + esc(r.code) + '</span>' : '<span class="muted-dash">—</span>';
    }
    if (k === 'value') return r.url ? cellLink(r.url, r.value) : esc(r.value || '—');
    return '';
  }

  function rowHTML(r, on, alt) {
    const cells = VIEWS[state.view].columns.map((c) =>
      '<td' + (c.cls ? ' class="' + c.cls + '"' : '') + '>' + cellHTML(c.k, r) + '</td>'
    ).join('');
    return '<tr tabindex="-1" data-key="' + esc(r.id) + '"' +
      (on ? ' aria-current="true"' : '') + (alt ? ' class="alt"' : '') + '>' + cells + '</tr>';
  }

  /* Heads each group with its own row. Headers carry no data-key, so selection,
     keyboard nav and the row cache all skip over them untouched. */
  function bodyHTML(view, rows, idx) {
    const cols = view.columns.length;
    let band = 0;
    return rows.map((r, i) => {
      let head = '';
      if (view.groupBy) {
        const name = r[view.groupBy];
        if (i === 0 || rows[i - 1][view.groupBy] !== name) {
          band = 0; /* every group starts on an unbanded row */
          const label = (view.groupLabel && view.groupLabel[name]) || name;
          head = '<tr class="grp-row">' +
            '<th class="grp-cell" scope="colgroup" colspan="' + cols + '">' + esc(label) + '</th>' +
          '</tr>';
        }
      }
      const row = rowHTML(r, i === idx, band % 2 === 1);
      band += 1;
      return head + row;
    }).join('');
  }

  /* ---------------------------------------------------------------- details */
  const chipsHTML = (list) => (list || []).map((t) => '<span class="chip">' + esc(t) + '</span>').join('');

  const kv = (k, vHTML) =>
    '<div class="kv-row"><span class="kv-k">' + esc(k) + '</span><span class="kv-v">' + vHTML + '</span></div>';

  function employerFor(company) {
    const needle = String(company || '').toLowerCase();
    if (!needle) return null;
    return (S.employers || []).find((e) => needle.indexOf(String(e.name || '').toLowerCase()) !== -1) || null;
  }

  const DETAIL = {
    profile: () => {
      const current = (S.experience || []).find((e) => e.current);
      return [
        '<div class="d-kind">profile</div>',
        '<h2>' + esc(S.name) + '</h2>',
        '<p class="dmeta">' + esc(S.role) + ' · ' + esc(S.location) + '</p>',
        '<p class="prose">' + esc(S.about) + '</p>',
        '<div class="kv">',
          kv('based', esc(S.location)),
          current ? kv('currently', esc(current.role) + ' — ' + esc(current.company)) : '',
          kv('status', pillHTML({ text: 'running', tone: 'green' })),
        '</div>',
        '<h3 class="dlabel">what i do</h3>',
        '<div class="chips">' + chipsHTML(S.services) + '</div>'
      ].join('');
    },

    role: (r) => {
      const e = r.payload;
      const emp = employerFor(e.company);
      const company = emp
        ? '<a class="emp" href="' + safeHref(emp.url) + '" target="_blank" rel="noopener"><img src="' + esc(emp.logo) + '" alt="" loading="lazy"><span>' + esc(e.company) + '</span></a>'
        : esc(e.company);
      return [
        '<div class="d-kind">role</div>',
        '<h2>' + esc(e.role) + '</h2>',
        '<p class="dmeta">' + esc(e.company) + ' · ' + esc(e.place) + '</p>',
        '<div class="kv">',
          kv('company', company),
          kv('place', esc(e.place)),
          kv('period', esc(e.period)),
          kv('status', pillHTML(r.status)),
          kv('duration', esc(r.age)),
        '</div>'
      ].join('');
    },

    repository: (r) => {
      const p = r.payload;
      const stack = String(p.tech || '').split('·').map((t) => t.trim()).filter(Boolean);
      return [
        '<div class="d-kind">repository</div>',
        '<h2>' + esc(p.name) + '</h2>',
        (p.blurb ? '<p class="dlead">' + esc(p.blurb) + '</p>' : ''),
        '<p class="dmeta">' + esc(repoSlug(p.url)) + '</p>',
        '<h3 class="dlabel">stack</h3>',
        '<div class="chips">' + chipsHTML(stack) + '</div>',
        '<div class="kv">',
          kv('built', esc(p.year || '—')),
          kv('tech', esc(p.tech)),
          kv('repo', esc(repoSlug(p.url))),
        '</div>',
        '<div class="dactions">',
          '<a class="btn primary" href="' + safeHref(p.url) + '" target="_blank" rel="noopener">open on GitHub ↗</a>',
        '</div>'
      ].join('');
    },

    credential: (r) => {
      const c = r.payload;
      const view = VIEWS[r.view] || {};
      const issuer = (view.groupLabel && view.groupLabel[c.issuer]) || c.issuer;
      return [
        '<div class="d-kind">credential</div>',
        '<h2>' + esc(c.name) + '</h2>',
        '<p class="dmeta">' + esc(issuer) + '</p>',
        '<div class="kv">',
          kv('issuer', esc(issuer)),
          kv('code', c.code ? '<span class="code">' + esc(c.code) + '</span>' : '<span class="muted-dash">—</span>'),
        '</div>',
        c.url
          ? '<div class="dactions"><a class="btn primary" href="' + safeHref(c.url) + '"' +
              /* Hosts that refuse framing (Credly, Microsoft Learn, cncf.io) get a
                 plain new tab — a blank window would be worse than no window. */
              (c.embed === false
                ? ' target="_blank" rel="noopener"'
                : ' data-preview data-title="' + esc(c.name) + '"') +
            '>verify ↗</a></div>'
          : ''
      ].join('');
    },

    education: (r) => {
      const ed = r.payload;
      return [
        '<div class="d-kind">education</div>',
        '<h2>' + esc(ed.school) + '</h2>',
        '<p class="dmeta">' + esc([ed.degree, ed.major, ed.place].filter(Boolean).join(' · ')) + '</p>',
        '<div class="kv">',
          kv('degree', esc(ed.degree)),
          ed.major ? kv('major', esc(ed.major)) : '',
          kv('place', esc(ed.place)),
          kv('years', esc(ed.years)),
          kv('status', pillHTML(r.status)),
        '</div>'
      ].join('');
    },

    channel: (r) => {
      const c = r.payload;
      return [
        '<div class="d-kind">channel</div>',
        '<h2>' + esc(c.label) + '</h2>',
        '<p class="dmeta">' + esc(c.value) + '</p>',
        '<div class="kv">',
          kv('address', '<a class="ilink" href="' + safeHref(c.url) + '"' + (isExternal(c.url) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(c.value) + '</a>'),
        '</div>',
        '<div class="dactions">',
          '<a class="btn primary" href="' + safeHref(c.url) + '"' + (isExternal(c.url) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(c.action || c.label) + (isExternal(c.url) ? ' ↗' : '') + '</a>',
        '</div>'
      ].join('');
    }
  };

  function renderDetail(row) {
    if (!row) {
      detailEl.innerHTML =
        '<div class="d-kind">no selection</div>' +
        '<p class="prose">Nothing matches the current filter. Clear the search box to bring the rows back.</p>';
      return;
    }
    const build = DETAIL[row.kind];
    if (build) detailEl.innerHTML = build(row);
  }

  /* --------------------------------------------------------------- elements */
  const nav = $('nav');
  const rowsEl = $('rows');
  const theadEl = $('thead');
  const tableEl = $('table');
  const listEl = $('tablescroll');
  const q = $('q');
  const countEl = $('count');
  const kbdEl = $('kbd');
  const detailEl = $('detail');
  const crumbsEl = $('crumbs');
  const nsEl = $('ns');

  const state = { view: 'projects', q: '' };
  let selected = null;

  /* ------------------------------------------------------------------ render */
  /* The hash is a view's address: #certs survives a refresh and can be shared. */
  const viewFromHash = () => String(location.hash || '').replace(/^#\/?/, '').toLowerCase();

  const visibleRows = () => {
    const all = rowsOf(state.view);
    const needle = state.q.trim().toLowerCase();
    if (!needle) return all;
    return all.filter((r) => r.search.toLowerCase().indexOf(needle) !== -1);
  };

  function renderStrip() {
    const v = VIEWS[state.view];
    crumbsEl.innerHTML =
      '<span>career</span>' +
      '<span class="crumb-sep" aria-hidden="true">›</span>' +
      '<span>' + esc(v.group) + '</span>' +
      '<span class="crumb-sep" aria-hidden="true">›</span>' +
      '<b>' + esc(v.label.toLowerCase()) + '</b>';
    const place = String(S.location || '').split(',')[0].trim().toLowerCase();
    nsEl.innerHTML =
      '<span class="dot" aria-hidden="true"></span>' +
      /* The context half is dropped under 560px rather than left to overflow. */
      '<span class="ctx">context: <b>' + esc(S.domain || '—') + '</b><span class="sep" aria-hidden="true">·</span></span>' +
      '<span class="nsp">namespace: <b>' + esc(S.namespace || place || '—') + '</b></span>';
  }

  function renderTable() {
    const view = VIEWS[state.view];
    const rows = visibleRows();
    let idx = rows.findIndex((r) => r.id === selected);
    if (idx < 0 && rows.length) idx = 0;
    selected = idx >= 0 ? rows[idx].id : null;

    theadEl.innerHTML = view.columns.map((c) =>
      '<th' + (c.cls ? ' class="' + c.cls + '"' : '') + ' scope="col">' + esc(c.label) + '</th>'
    ).join('');

    rowsEl.innerHTML = rows.length
      ? bodyHTML(view, rows, idx)
      : '<tr class="empty"><td colspan="' + view.columns.length + '">no rows match “' + esc(state.q) + '” — press esc to clear the filter</td></tr>';

    countEl.textContent = rows.length + (rows.length === 1 ? ' match' : ' matches');
    renderDetail(rows[idx] || null);
  }

  function paintSelection() {
    const trs = rowsEl.querySelectorAll('tr[data-key]');
    for (let i = 0; i < trs.length; i += 1) {
      if (trs[i].dataset.key === selected) trs[i].setAttribute('aria-current', 'true');
      else trs[i].removeAttribute('aria-current');
    }
  }

  /* -------------------------------------------------------------- behaviour */
  function selectView(id) {
    if (!VIEWS[id]) return;
    state.view = id;
    state.q = '';
    q.value = '';
    q.placeholder = VIEWS[id].placeholder;
    const items = nav.querySelectorAll('.nav-item');
    for (let i = 0; i < items.length; i += 1) {
      items[i].setAttribute('aria-current', String(items[i].dataset.view === id));
    }
    tableEl.dataset.view = id;
    tableEl.setAttribute('aria-label', VIEWS[id].label.toLowerCase() + ', table');
    listEl.setAttribute('aria-label', VIEWS[id].label.toLowerCase() + ', rows');
    selected = null;
    listEl.scrollTop = 0;
    renderTable();
    renderStrip();
    if (viewFromHash() !== id) {
      // replaces rather than pushes, so Back leaves the site instead of walking views
      try { history.replaceState(null, '', '#' + id); } catch (e) { location.hash = id; }
    }
  }

  function selectKey(key) {
    const row = visibleRows().find((r) => r.id === key);
    if (!row) return;
    selected = key;
    paintSelection();
    renderDetail(row);
  }

  function move(dir) {
    const rows = visibleRows();
    if (!rows.length) return;
    let idx = rows.findIndex((r) => r.id === selected);
    if (idx < 0) idx = 0;
    idx = Math.min(rows.length - 1, Math.max(0, idx + dir));
    if (rows[idx].id === selected) return;
    selected = rows[idx].id;
    paintSelection();
    renderDetail(rows[idx]);
    const tr = rowsEl.querySelector('tr[data-key="' + selected + '"]');
    if (tr && tr.scrollIntoView) tr.scrollIntoView({ block: 'nearest' });
  }

  function revealDetail() {
    if (!detailEl) return;
    if (!window.matchMedia('(max-width: 900px)').matches) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    detailEl.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
  }

  function openSelected() {
    const row = visibleRows().find((r) => r.id === selected);
    if (!row) return;
    if (row.url) {
      window.open(row.url, '_blank', 'noopener');
      return;
    }
    revealDetail();
  }

  function buildNav() {
    nav.innerHTML = NAV.map((g) => {
      const gid = 'grp-' + g.group.toLowerCase();
      const items = g.items.map((id) =>
        '<button type="button" class="nav-item" data-view="' + esc(id) + '" aria-current="false">' +
          (ICONS[id] || '') +
          '<span class="n-label">' + esc(VIEWS[id].label) + '</span>' +
          '<span class="n-count">' + rowsOf(id).length + '</span>' +
        '</button>'
      ).join('');
      return '<div class="grp" id="' + gid + '">' +
        '<button type="button" class="grp-btn" aria-expanded="true" aria-controls="' + gid + '-items">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 7 7-7 7"/></svg>' +
          '<span>' + esc(g.group) + '</span>' +
        '</button>' +
        '<div class="grp-items" id="' + gid + '-items">' + items + '</div>' +
      '</div>';
    }).join('');
  }

  function syncHeader() {
    const h = document.querySelector('header');
    if (!h) return;
    const setText = (sel, text) => {
      const el = h.querySelector(sel);
      if (el && text) el.textContent = text;
    };
    setText('.name', S.name);
    setText('.role', S.role);
    setText('.location b', S.location);
    const avatar = h.querySelector('.avatar');
    if (avatar && S.name) avatar.setAttribute('alt', S.name);
    const links = { email: S.email ? 'mailto:' + S.email : '', linkedin: S.links && S.links.linkedin, github: S.links && S.links.github };
    Object.keys(links).forEach((key) => {
      const el = h.querySelector('a[data-link="' + key + '"]');
      if (el && links[key]) el.setAttribute('href', links[key]);
    });
  }

  const onMac = () => /mac|iphone|ipad|ipod/i.test(String(navigator.platform || navigator.userAgent || ''));

  /* ------------------------------------------------------------------ events */
  nav.addEventListener('click', (e) => {
    const gb = e.target.closest('.grp-btn');
    if (gb) {
      const grp = gb.closest('.grp');
      const closed = grp.classList.toggle('closed');
      gb.setAttribute('aria-expanded', String(!closed));
      return;
    }
    const item = e.target.closest('.nav-item');
    if (item) selectView(item.dataset.view);
  });

  window.addEventListener('hashchange', () => {
    const id = viewFromHash();
    if (VIEWS[id] && id !== state.view) selectView(id);
  });

  q.addEventListener('input', () => {
    state.q = q.value;
    renderTable();
  });

  q.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && q.value) {
      e.preventDefault();
      q.value = '';
      state.q = '';
      renderTable();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      move(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      move(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      openSelected();
    }
  });

  listEl.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      move(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      move(-1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openSelected();
    }
  });

  rowsEl.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    const tr = e.target.closest('tr[data-key]');
    if (tr) selectKey(tr.dataset.key);
  });

  /* ------------------------------------------------------- credential viewer */
  const viewer = $('viewer');
  const vbody = $('vbody');
  const vfoot = $('vfoot');
  const vtitle = $('vtitle');
  const vclose = $('vclose');
  let vreturn = null;

  function openViewer(url, label) {
    const name = label || 'certificate';
    const host = (() => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return ''; } })();
    vtitle.innerHTML = '<b>verify</b> / ' + esc(name);
    vbody.innerHTML = '<iframe src="' + safeHref(url) + '" title="' + esc(name) + '"></iframe>';
    vfoot.innerHTML = '<span>' + (host ? 'source · ' + esc(host) : '') + '</span><span>esc closes</span>';
    viewer.hidden = false;
    document.body.classList.add('viewer-open');
    vreturn = document.activeElement;
    vclose.focus();
  }

  function closeViewer() {
    viewer.hidden = true;
    vbody.innerHTML = ''; /* drops the frame, so the document stops loading */
    vfoot.innerHTML = '';
    document.body.classList.remove('viewer-open');
    if (vreturn && vreturn.isConnected) vreturn.focus();
    vreturn = null;
  }

  detailEl.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-preview]');
    if (!link) return;
    e.preventDefault();
    openViewer(link.getAttribute('href'), link.getAttribute('data-title'));
  });

  viewer.addEventListener('click', (e) => { if (e.target === viewer) closeViewer(); });
  vclose.addEventListener('click', closeViewer);

  document.addEventListener('keydown', (e) => {
    if (!viewer.hidden) {
      if (e.key === 'Escape') { e.preventDefault(); closeViewer(); }
      return;
    }
    if ((e.metaKey || e.ctrlKey) && String(e.key).toLowerCase() === 'k') {
      e.preventDefault();
      q.focus();
      q.select();
    }
  });

  /* -------------------------------------------------------------------- init */
  syncHeader();
  buildNav();
  kbdEl.textContent = onMac() ? '⌘K' : 'Ctrl+K';
  selectView(VIEWS[viewFromHash()] ? viewFromHash() : 'about');
})();
