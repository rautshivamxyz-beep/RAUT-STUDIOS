/* ==========================================================================
   Raut Studio — shared behaviour
   Every page includes this file. Content lives in /content/*.json so the
   admin panel can edit it without touching HTML.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- tiny helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- icon set ---------- */
  var ICONS = {
    assistant: '<path d="M7 17V7l10 10V7"/>',
    desktop: '<rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    layers: '<path d="M12 3 3 7.5l9 4.5 9-4.5L12 3Z"/><path d="M3 12.5 12 17l9-4.5M3 17.5 12 22l9-4.5"/>',
    chart: '<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>'
  };
  function icon(name) {
    var d = ICONS[name] || ICONS.assistant;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>";
  }

  /* ---------- footer year ---------- */
  var yr = $("#yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- mobile navigation ---------- */
  var burger = $(".burger");
  var nav = $(".nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", open ? "false" : "true");
      burger.setAttribute("aria-expanded", open ? "false" : "true");
    });
    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () {
        nav.setAttribute("data-open", "false");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- app cards ---------- */
  function appCard(a) {
    var vClass = a.versionStyle === "wip" ? "chip chip--wip" : "chip chip--ver";
    var chips = (a.chips || []).map(function (c) {
      return '<span class="chip">' + esc(c) + "</span>";
    }).join("");

    var actions = "";
    if (a.primary && a.primary.url) {
      var isDownload = /releases\/download/.test(a.primary.url);
      actions += '<a class="btn ' + (isDownload ? "btn-primary" : "btn-quiet") + ' btn-sm" href="' +
        esc(a.primary.url) + '"' + (isDownload ? "" : ' target="_blank" rel="noopener"') + ">" +
        esc(a.primary.label) + "</a>";
    }
    if (a.secondary && a.secondary.url) {
      actions += '<a class="btn btn-quiet btn-sm" href="' + esc(a.secondary.url) +
        '" target="_blank" rel="noopener">' + esc(a.secondary.label) + "</a>";
    }

    return '<article class="app">' +
      '<div class="app-head">' +
        '<span class="app-icon' + (a.accent === "amber" ? " app-icon--amber" : "") + '">' + icon(a.icon) + "</span>" +
        '<div><div class="app-name">' + esc(a.name) + "</div>" +
        '<div class="app-cat">' + esc(a.category) + "</div></div>" +
      "</div>" +
      '<p class="app-desc">' + esc(a.desc) + "</p>" +
      '<div class="chips">' + (a.version ? '<span class="' + vClass + '">' + esc(a.version) + "</span>" : "") + chips + "</div>" +
      '<div class="app-actions">' + actions + "</div>" +
    "</article>";
  }

  function renderApps() {
    var targets = $$("[data-apps]");
    if (!targets.length) return;

    fetch("content/apps.json", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error("content/apps.json " + r.status); return r.json(); })
      .then(function (data) {
        var all = (data && data.apps) || [];
        targets.forEach(function (t) {
          var list = all;
          if (t.getAttribute("data-featured") === "true") {
            list = list.filter(function (a) { return a.featured; });
          }
          var limit = parseInt(t.getAttribute("data-limit"), 10);
          if (limit > 0) list = list.slice(0, limit);
          t.innerHTML = list.map(appCard).join("");
        });
      })
      .catch(function () {
        targets.forEach(function (t) {
          t.innerHTML = '<p class="empty">The app list could not load. ' +
            '<a href="https://github.com/rautshivamxyz-beep" style="color:var(--brand);font-weight:600" ' +
            'target="_blank" rel="noopener">Browse everything on GitHub</a>.</p>';
        });
      });
  }

  /* ---------- file rows ---------- */
  function renderFiles() {
    var targets = $$("[data-files]");
    if (!targets.length) return;

    fetch("content/files.json", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error("content/files.json " + r.status); return r.json(); })
      .then(function (data) {
        var all = (data && data.files) || [];
        targets.forEach(function (t) {
          var list = all;
          var kind = t.getAttribute("data-kind");
          if (kind) {
            list = list.filter(function (f) { return f.kind === kind; });
          }
          var limit = parseInt(t.getAttribute("data-limit"), 10);
          if (limit > 0) list = list.slice(0, limit);

          if (!list.length) {
            t.innerHTML = '<tr><td colspan="4" class="loading">Nothing here yet.</td></tr>';
            return;
          }
          t.innerHTML = list.map(function (f) {
            var label = [f.app, f.desc].filter(Boolean).join(" · ");
            return "<tr>" +
              '<td class="nm">' + esc(f.name) + "</td>" +
              "<td>" + (f.kind ? '<span class="tag">' + esc(f.kind) + "</span> " : "") +
                esc(label) + "</td>" +
              '<td class="sz">' + esc(f.size) + "</td>" +
              '<td class="dl"><a href="' + esc(f.url) + '">Download</a></td>' +
            "</tr>";
          }).join("");
        });
      })
      .catch(function () {
        targets.forEach(function (t) {
          t.innerHTML = '<tr><td colspan="4" class="loading">File list unavailable. ' +
            'Browse the <a href="https://github.com/rautshivamxyz-beep/NOVA/releases" ' +
            'style="color:var(--brand);font-weight:600" target="_blank" rel="noopener">releases page</a> instead.</td></tr>';
        });
      });
  }

  renderApps();
  renderFiles();
})();
