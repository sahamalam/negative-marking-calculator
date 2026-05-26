// ============================================================
// books-modal.js — Tailored for your HTML Layout
// ============================================================

const NMC_TAG = "nmc007-21"; 

// ── 1. CSS Injection ───────────────────────────────────────────
const _nmcStyle = document.createElement("style");
_nmcStyle.textContent = `
  #nmc-book-strip { margin: 18px 0 12px; border-top: 1px solid #f0e0d6; padding-top: 12px; width: 100%; }
  .nmc-strip-title { font-size: 13px; font-weight: 700; color: #FB5416; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; text-align: left; }
  .nmc-strip-tag { background: #FB5416; color: white; font-size: 9px; padding: 2px 7px; border-radius: 20px; font-weight: 700; }
  .nmc-book-item { display: flex; align-items: center; gap: 10px; background: #fff8f5; border: 1px solid #f0e0d6; border-radius: 8px; padding: 10px 12px; text-decoration: none; color: #222; font-size: 13px; margin-bottom: 7px; transition: border-color 0.2s; text-align: left; }
  .nmc-book-item:hover { border-color: #FB5416; background: #fff5f0; }
  .nmc-book-name { flex: 1; font-weight: 500; line-height: 1.4; color: #222; }
  .nmc-book-cta { color: #FB5416; font-weight: 700; font-size: 11px; white-space: nowrap; }
  .nmc-view-more { text-align: center; margin-top: 5px; }
  .nmc-view-more a { font-size: 12px; color: #FB5416; text-decoration: underline; font-weight: 600; }
`;
document.head.appendChild(_nmcStyle);

// ── 2. Real DOM Injector ───────────────────────────────────────
function injectBookStrip() {
  if (document.getElementById("nmc-book-strip")) return;

  // Exact target inside your resultModal
  const modalContent = document.querySelector("#resultModal .modal-content");
  
  if (modalContent) {
    const strip = document.createElement("div");
    strip.id = "nmc-book-strip";
    strip.innerHTML = `
      <div class="nmc-strip-title">
        📚 Recommended Resources
        <span class="nmc-strip-tag">✓ Verified</span>
      </div>
      <div id="nmc-strip-books"></div>
      <div class="nmc-view-more">
        <a id="nmc-strip-more" href="#" target="_blank" rel="noopener">View more books on Amazon →</a>
      </div>
    `;

    // Finding your button-container to insert exactly above it
    const btnContainer = modalContent.querySelector(".button-container");
    if (btnContainer) {
      modalContent.insertBefore(strip, btnContainer);
    } else {
      modalContent.appendChild(strip);
    }
  }
}

function nmcURL(q) {
  return `https://www.amazon.in/s?k=${encodeURIComponent(q)}&tag=${NMC_TAG}`;
}

// ── 3. Action Trigger ──────────────────────────────────────────
window.nmcFetchStrip = function (examName) {
  // Ensure DOM elements are created
  injectBookStrip();

  const books = document.getElementById("nmc-strip-books");
  const more  = document.getElementById("nmc-strip-more");
  
  if (!books) return;

  const cleanExam = examName || "Competitive Exam";
  
  more.href = nmcURL(`${cleanExam} exam books`);
  more.textContent = `View more ${cleanExam} books →`;

  // Render static bypass links matching your selected layout
  books.innerHTML = `
    <a class="nmc-book-item" href="${nmcURL(cleanExam + ' best books set')}" target="_blank" rel="noopener">
      <span style="font-size:16px">📚</span>
      <span class="nmc-book-name"><strong>Best Recommended Books & Guide Packs</strong> for ${cleanExam}</span>
      <span class="nmc-book-cta">Buy Now →</span>
    </a>
    <a class="nmc-book-item" href="${nmcURL(cleanExam + ' previous year solved papers')}" target="_blank" rel="noopener">
      <span style="font-size:16px">📝</span>
      <span class="nmc-book-name"><strong>Previous Years Solved Papers</strong> & Mock Test Series</span>
      <span class="nmc-book-cta">View Offers →</span>
    </a>
  `;
};