// ============================================================
// books-modal.js
// Sirf index.html mein add karo:
// <script src="books-modal.js"></script>
// Kuch aur touch karne ki zaroorat nahi.
// ============================================================

const NMC_TAG = "nmc007-21"; // <-- Apna real Amazon tracking ID yahan

// ── Inject book strip into existing modal ───────────────────
(function () {
  document.addEventListener("DOMContentLoaded", function () {

    // 1. CSS inject
    const style = document.createElement("style");
    style.textContent = `
      #nmc-book-strip {
        margin: 14px 0 10px;
        border-top: 1px solid #f0e0d6;
        padding-top: 12px;
      }
      #nmc-book-strip .nmc-strip-title {
        font-size: 12px;
        font-weight: 700;
        color: #FB5416;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      #nmc-strip-tag {
        background: #FB5416;
        color: white;
        font-size: 9px;
        padding: 2px 7px;
        border-radius: 20px;
        font-weight: 700;
      }
      #nmc-strip-status {
        font-size: 11px;
        color: #aaa;
        font-weight: 400;
      }
      #nmc-book-strip .nmc-book-item {
        display: flex;
        align-items: center;
        gap: 10px;
        background: #fff8f5;
        border: 1px solid #f0e0d6;
        border-radius: 8px;
        padding: 9px 12px;
        text-decoration: none;
        color: #222;
        font-size: 12px;
        margin-bottom: 7px;
        transition: border-color 0.2s;
      }
      #nmc-book-strip .nmc-book-item:hover {
        border-color: #FB5416;
      }
      #nmc-book-strip .nmc-book-name {
        flex: 1;
        font-weight: 500;
        line-height: 1.3;
      }
      #nmc-book-strip .nmc-book-cta {
        color: #FB5416;
        font-weight: 700;
        font-size: 11px;
        white-space: nowrap;
      }
      #nmc-book-strip .nmc-skeleton {
        height: 42px;
        border-radius: 8px;
        margin-bottom: 7px;
        background: linear-gradient(90deg, #f0e0d6 25%, #ffe8dc 50%, #f0e0d6 75%);
        background-size: 200% 100%;
        animation: nmcShimmer 1.4s infinite;
      }
      @keyframes nmcShimmer {
        0%  { background-position: 200% 0; }
        100%{ background-position: -200% 0; }
      }
      #nmc-view-more {
        text-align: center;
        margin-top: 2px;
      }
      #nmc-view-more a {
        font-size: 11px;
        color: #FB5416;
        text-decoration: underline;
      }
    `;
    document.head.appendChild(style);

    // 2. Build strip HTML and inject into modal-content
    const modalContent = document.querySelector("#resultModal .modal-content");
    if (!modalContent) return;

    const strip = document.createElement("div");
    strip.id = "nmc-book-strip";
    strip.innerHTML = `
      <div class="nmc-strip-title">
        📚 Recommended Books
        <span id="nmc-strip-tag">✨ AI</span>
        <span id="nmc-strip-status">Finding books...</span>
      </div>
      <div id="nmc-strip-skeletons">
        <div class="nmc-skeleton"></div>
        <div class="nmc-skeleton"></div>
        <div class="nmc-skeleton"></div>
      </div>
      <div id="nmc-strip-books"></div>
      <div id="nmc-view-more">
        <a id="nmc-more-link" href="#" target="_blank" rel="noopener">View more books on Amazon →</a>
      </div>
    `;

    // Insert before button-container
    const btnContainer = modalContent.querySelector(".button-container");
    if (btnContainer) {
      modalContent.insertBefore(strip, btnContainer);
    } else {
      modalContent.appendChild(strip);
    }

    // 3. Hook into existing calculate() to capture exam context
    // We watch for modal becoming visible, then fetch books
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.type === "attributes" && m.attributeName === "style") {
          const modal = document.getElementById("resultModal");
          if (modal && modal.style.display !== "none") {
            // Modal just opened — get exam name from form if available
            const examInput = document.getElementById("examName") || document.getElementById("exam") || null;
            const examName = examInput ? examInput.value.trim() : "";
            triggerBookFetch(examName);
          }
        }
      });
    });

    const modal = document.getElementById("resultModal");
    if (modal) {
      observer.observe(modal, { attributes: true });
    }

  });
})();

// ── Called when modal opens ──────────────────────────────────
function triggerBookFetch(examName) {
  // Reset strip
  document.getElementById("nmc-strip-skeletons").style.display = "block";
  document.getElementById("nmc-strip-books").innerHTML = "";
  document.getElementById("nmc-strip-status").textContent = "Finding books...";

  const fallbackQuery = examName || "competitive exam";
  document.getElementById("nmc-more-link").href = nmcAmazonURL(fallbackQuery + " exam books");

  fetchNMCBooks(fallbackQuery).then(books => {
    document.getElementById("nmc-strip-skeletons").style.display = "none";
    document.getElementById("nmc-strip-status").textContent = "Top picks for you 👇";

    const list = document.getElementById("nmc-strip-books");
    books.forEach(b => {
      const a = document.createElement("a");
      a.className = "nmc-book-item";
      a.href = nmcAmazonURL(b.search);
      a.target = "_blank";
      a.rel = "noopener";
      a.innerHTML = `
        <span style="font-size:18px">📖</span>
        <span class="nmc-book-name">${b.title}</span>
        <span class="nmc-book-cta">Amazon →</span>
      `;
      list.appendChild(a);
    });

    document.getElementById("nmc-more-link").href = nmcAmazonURL(fallbackQuery + " exam books");
    document.getElementById("nmc-more-link").textContent = `View more ${fallbackQuery} books →`;

  }).catch(() => {
    document.getElementById("nmc-strip-skeletons").style.display = "none";
    document.getElementById("nmc-strip-books").innerHTML = `
      <a class="nmc-book-item" href="${nmcAmazonURL(fallbackQuery + ' exam books')}" target="_blank" rel="noopener">
        <span style="font-size:18px">🛒</span>
        <span class="nmc-book-name">Browse ${fallbackQuery} Books on Amazon</span>
        <span class="nmc-book-cta">Search →</span>
      </a>`;
  });
}

// ── AI book fetch ────────────────────────────────────────────
async function fetchNMCBooks(examName) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [{
        role: "user",
        content: `Book recommender for Indian competitive exam students.
Exam: "${examName}"
Return ONLY a valid JSON array of 3 books. No markdown, no explanation.
[{"title":"Book Title - Author","search":"short amazon search query"},{"title":"Book Title - Author","search":"short amazon search query"},{"title":"Book Title - Author","search":"short amazon search query"}]
Rules: real books on Amazon India, standard books for this exam, search = short precise query.`
      }]
    })
  });
  const data = await res.json();
  const text = data.content.map(i => i.text || "").join("").trim();
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

function nmcAmazonURL(query) {
  return `https://www.amazon.in/s?k=${encodeURIComponent(query)}&tag=${NMC_TAG}`;
}

// ── Expose so downloadResult can update exam name ────────────
// Agar downloadResult mein exam name milti hai toh yeh call karo:
// window.nmcUpdateExam("UPSC") — books refresh ho jaayengi
window.nmcUpdateExam = function (examName) {
  if (examName && examName.length > 1) {
    triggerBookFetch(examName);
  }
};