// ============================================================
// books-modal.js — Netlify Backend Powered Book Recommendations
// ============================================================

const NMC_TAG = "nmc007-21"; // Amazon tracking ID

// 🛠️ STEP 3.1: Netlify par deploy karne ke baad jo link milega, use yahan badlein:
const NETLIFY_BACKEND_URL = "https://aesthetic-babka-0eb571.netlify.app/"; 

// ── 1. CSS Injection ───────────────────────────────────────────
const _nmcStyle = document.createElement("style");
_nmcStyle.textContent = `
  #nmc-book-strip { margin:14px 0 10px; border-top:1px solid #f0e0d6; padding-top:12px; }
  .nmc-strip-title { font-size:12px; font-weight:700; color:#FB5416; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
  .nmc-strip-tag { background:#FB5416; color:white; font-size:9px; padding:2px 7px; border-radius:20px; font-weight:700; }
  .nmc-strip-status { font-size:11px; color:#aaa; font-weight:400; }
  .nmc-book-item { display:flex; align-items:center; gap:10px; background:#fff8f5; border:1px solid #f0e0d6; border-radius:8px; padding:9px 12px; text-decoration:none; color:#222; font-size:12px; margin-bottom:7px; transition:border-color 0.2s; }
  .nmc-book-item:hover { border-color:#FB5416; }
  .nmc-book-name { flex:1; font-weight:500; line-height:1.3; }
  .nmc-book-cta { color:#FB5416; font-weight:700; font-size:11px; white-space:nowrap; }
  .nmc-skeleton { height:42px; border-radius:8px; margin-bottom:7px; background:linear-gradient(90deg,#f0e0d6 25%,#ffe8dc 50%,#f0e0d6 75%); background-size:200% 100%; animation:nmcShimmer 1.4s infinite; }
  @keyframes nmcShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .nmc-view-more { text-align:center; margin-top:4px; }
  .nmc-view-more a { font-size:11px; color:#FB5416; text-decoration:underline; }
  #nmc-overlay { display:none; position:fixed; inset:0; background:#fff; z-index:99999; flex-direction:column; align-items:center; overflow-y:auto; }
  #nmc-overlay.nmc-active { display:flex; animation:nmcFadeUp 0.35s ease; }
  @keyframes nmcFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .nmc-ovl-hdr { width:100%; background:#FB5416; padding:18px 20px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:2; }
  .nmc-ovl-title { color:white; font-size:17px; font-weight:700; }
  .nmc-ovl-sub { color:rgba(255,255,255,0.8); font-size:11px; margin-top:2px; }
  .nmc-ovl-close { background:rgba(255,255,255,0.2); border:none; color:white; font-size:18px; width:34px; height:34px; border-radius:50%; cursor:pointer; }
  .nmc-ovl-body { width:100%; max-width:600px; padding:20px; }
  .nmc-ai-row { display:flex; align-items:center; gap:8px; margin-bottom:14px; }
  .nmc-ai-tag { background:#FB5416; color:white; font-size:10px; font-weight:700; padding:3px 10px; border-radius:20px; }
  .nmc-ai-status { font-size:12px; color:#999; }
  .nmc-card { display:flex; align-items:center; gap:14px; background:#fff; border:1.5px solid #f0e0d6; border-radius:12px; padding:14px 18px; text-decoration:none; color:#222; font-size:14px; margin-bottom:10px; transition:border-color 0.2s,box-shadow 0.2s; }
  .nmc-card:hover { border-color:#FB5416; box-shadow:0 2px 12px rgba(251,84,22,0.12); }
  .nmc-card-name { flex:1; font-weight:600; line-height:1.4; }
  .nmc-card-cta { color:#FB5416; font-weight:700; font-size:12px; white-space:nowrap; }
  .nmc-ol-skeleton { height:58px; border-radius:12px; margin-bottom:10px; background:linear-gradient(90deg,#f0e0d6 25%,#ffe8dc 50%,#f0e0d6 75%); background-size:200% 100%; animation:nmcShimmer 1.4s infinite; }
  .nmc-view-more2 { text-align:center; margin:4px 0 20px; }
  .nmc-view-more2 a { font-size:13px; color:#FB5416; text-decoration:underline; }
  .nmc-footer-card { background:#fff8f0; border:1.5px solid #FB5416; border-radius:12px; padding:16px; text-align:center; margin:0 20px 32px; max-width:560px; width:calc(100% - 40px); }
  .nmc-footer-card p { font-size:12px; color:#777; margin-bottom:12px; line-height:1.6; }
  .nmc-goback { background:#f0f0f0; color:#555; border:none; padding:10px 24px; border-radius:8px; font-size:13px; cursor:pointer; }
  .nmc-toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%) translateY(80px); background:#222; color:white; padding:12px 20px; border-radius:10px; font-size:13px; font-weight:600; z-index:999999; display:flex; align-items:center; gap:10px; box-shadow:0 4px 20px rgba(0,0,0,0.3); transition:transform 0.35s ease,opacity 0.35s ease; opacity:0; }
  .nmc-toast.nmc-show { transform:translateX(-50%) translateY(0); opacity:1; }
`;
document.head.appendChild(_nmcStyle);

// ── 2. DOM Ready Elements Injection ───────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  // Overlay HTML
  const ovl = document.createElement("div");
  ovl.id = "nmc-overlay";
  ovl.innerHTML = `
    <div class="nmc-ovl-hdr">
      <div>
        <div class="nmc-ovl-title">📚 Recommended Books</div>
        <div class="nmc-ovl-sub" id="nmc-ovl-sub">Best books for your exam</div>
      </div>
      <button class="nmc-ovl-close" onclick="nmcCloseOverlay()">✕</button>
    </div>
    <div class="nmc-ovl-body">
      <div class="nmc-ai-row">
        <span class="nmc-ai-tag">✨ AI Powered</span>
        <span class="nmc-ai-status" id="nmc-ovl-status">Searching...</span>
      </div>
      <div id="nmc-ovl-skeletons">
        <div class="nmc-ol-skeleton"></div>
        <div class="nmc-ol-skeleton"></div>
        <div class="nmc-ol-skeleton"></div>
      </div>
      <div id="nmc-ovl-books"></div>
      <div class="nmc-view-more2">
        <a id="nmc-ovl-more" href="#" target="_blank" rel="noopener">View more on Amazon →</a>
      </div>
    </div>
    <div class="nmc-footer-card">
      <p>🛒 Clicking any book opens Amazon India.<br>Buying <strong>anything</strong> within 30 mins supports this free calculator!</p>
      <button class="nmc-goback" onclick="nmcCloseOverlay()">← Back to Calculator</button>
    </div>
  `;
  document.body.appendChild(ovl);

  // Toast HTML
  const toast = document.createElement("div");
  toast.className = "nmc-toast";
  toast.id = "nmc-toast";
  toast.innerHTML = `<span>✅</span><span id="nmc-toast-msg">PDF Downloaded!</span>`;
  document.body.appendChild(toast);

  // Book strip injection inside result modal
  const modalContent = document.querySelector("#resultModal .modal-content");
  if (modalContent) {
    const strip = document.createElement("div");
    strip.id = "nmc-book-strip";
    strip.innerHTML = `
      <div class="nmc-strip-title">
        📚 Recommended Books
        <span class="nmc-strip-tag">✨ AI</span>
        <span class="nmc-strip-status" id="nmc-strip-status">Finding books...</span>
      </div>
      <div id="nmc-strip-skeletons">
        <div class="nmc-skeleton"></div>
        <div class="nmc-skeleton"></div>
        <div class="nmc-skeleton"></div>
      </div>
      <div id="nmc-strip-books"></div>
      <div class="nmc-view-more">
        <a id="nmc-strip-more" href="#" target="_blank" rel="noopener">View more books on Amazon →</a>
      </div>
    `;
    const btnContainer = modalContent.querySelector(".button-container");
    btnContainer ? modalContent.insertBefore(strip, btnContainer) : modalContent.appendChild(strip);
  }

  // ── Anti-Spam MutationObserver ───────────────────────────────
  const modal = document.getElementById("resultModal");
  let isFetching = false;

  if (modal) {
    new MutationObserver(function () {
      if (modal.style.display === "flex" || modal.style.display === "block") {
        if (isFetching) return; 
        isFetching = true;

        const examEl = document.getElementById("examName")
          || document.getElementById("exam-name")
          || document.getElementById("examname");
        
        nmcFetchStrip(examEl ? examEl.value.trim() : "competitive exam");
        setTimeout(() => { isFetching = false; }, 3000); // 3 Second lock
      }
    }).observe(modal, { attributes: true, attributeFilter: ["style"] });
  }
});

// ── 3. Netlify Backend API Call ───────────────────────────────
async function nmcFetchBooks(examName) {
  try {
    const res = await fetch(NETLIFY_BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examName: examName })
    });

    if (res.status === 429) throw new Error("RATE_LIMIT_EXCEEDED");
    if (!res.ok) throw new Error("API_ERROR");

    const data = await res.json();
    const text = data.candidates[0].content.parts[0].text.trim();
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (error) {
    console.error("Backend API Error:", error.message);
    throw error;
  }
}

function nmcURL(q) {
  return `https://www.amazon.in/s?k=${encodeURIComponent(q)}&tag=${NMC_TAG}`;
}

// ── 4. Strip UI Rendering ─────────────────────────────────────
function nmcFetchStrip(examName) {
  const skels  = document.getElementById("nmc-strip-skeletons");
  const books  = document.getElementById("nmc-strip-books");
  const status = document.getElementById("nmc-strip-status");
  const more   = document.getElementById("nmc-strip-more");
  if (!skels) return;

  skels.style.display = "block";
  books.innerHTML = "";
  status.textContent = "Finding books...";
  more.href = nmcURL(examName + " exam books");

  nmcFetchBooks(examName).then(list => {
    skels.style.display = "none";
    status.textContent = "Top picks 👇";
    more.href = nmcURL(examName + " exam books");
    more.textContent = `View more ${examName} books →`;
    list.forEach(b => {
      const a = document.createElement("a");
      a.className = "nmc-book-item";
      a.href = nmcURL(b.search); a.target = "_blank"; a.rel = "noopener";
      a.innerHTML = `<span style="font-size:18px">📖</span><span class="nmc-book-name">${b.title}</span><span class="nmc-book-cta">Amazon →</span>`;
      books.appendChild(a);
    });
  }).catch((error) => {
    skels.style.display = "none";
    status.textContent = error.message === "RATE_LIMIT_EXCEEDED" ? "Direct search enabled 👇" : "Browse books 👇";
    books.innerHTML = `
      <a class="nmc-book-item" href="${nmcURL(examName + ' best books')}" target="_blank" rel="noopener">
        <span style="font-size:18px">📚</span><span class="nmc-book-name">Best Recommended Books for ${examName}</span><span class="nmc-book-cta">Search →</span>
      </a>
      <a class="nmc-book-item" href="${nmcURL(examName + ' solved papers')}" target="_blank" rel="noopener">
        <span style="font-size:18px">📝</span><span class="nmc-book-name">Previous Year Solved Papers & Mock Tests</span><span class="nmc-book-cta">Search →</span>
      </a>`;
  });
}

// ── 5. Full Overlay Rendering ──────────────────────────────────
window.nmcShowOverlay = function (examName) {
  const skels  = document.getElementById("nmc-ovl-skeletons");
  const books  = document.getElementById("nmc-ovl-books");
  const status = document.getElementById("nmc-ovl-status");
  const sub    = document.getElementById("nmc-ovl-sub");
  const more   = document.getElementById("nmc-ovl-more");

  skels.style.display = "block";
  books.innerHTML = "";
  status.textContent = "Searching for best books...";
  sub.textContent = `Best books for ${examName}`;
  more.href = nmcURL(examName + " exam books");
  more.textContent = `View more ${examName} books on Amazon →`;

  document.getElementById("nmc-overlay").classList.add("nmc-active");
  window.scrollTo(0, 0);

  nmcFetchBooks(examName).then(list => {
    skels.style.display = "none";
    status.textContent = "Top picks for your preparation 👇";
    list.forEach(b => {
      const a = document.createElement("a");
      a.className = "nmc-card";
      a.href = nmcURL(b.search); a.target = "_blank"; a.rel = "noopener";
      a.innerHTML = `<span style="font-size:22px">📖</span><span class="nmc-card-name">${b.title}</span><span class="nmc-card-cta">Buy on Amazon →</span>`;
      books.appendChild(a);
    });
  }).catch(() => {
    skels.style.display = "none";
    books.innerHTML = `<a class="nmc-card" href="${nmcURL(examName+' exam books')}" target="_blank" rel="noopener"><span style="font-size:22px">🛒</span><span class="nmc-card-name">Browse ${examName} Books on Amazon</span><span class="nmc-card-cta">Search →</span></a>`;
  });
};

window.nmcCloseOverlay = function () {
  document.getElementById("nmc-overlay").classList.remove("nmc-active");
};

window.nmcShowToast = function (msg) {
  const t = document.getElementById("nmc-toast");
  document.getElementById("nmc-toast-msg").textContent = msg;
  t.classList.add("nmc-show");
  setTimeout(() => t.classList.remove("nmc-show"), 3500);
};