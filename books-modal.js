const NMC_TAG = "nmc007-21"; 

// ── 1. CSS Injection (Sundar Boxes ke Liye) ───────────────────
const _nmcStyle = document.createElement("style");
_nmcStyle.textContent = `
  #nmc-book-strip { 
    margin: 20px 0 !important; 
    border-top: 2px dashed #FB5416 !important; 
    padding-top: 15px !important; 
    width: 100% !important; 
    display: block !important;
    clear: both !important;
  }
  .nmc-strip-title { 
    font-size: 14px !important; 
    font-weight: 700 !important; 
    color: #FB5416 !important; 
    margin-bottom: 12px !important; 
    text-align: left !important;
  }
  .nmc-book-item { 
    display: flex !important; 
    align-items: center !important; 
    gap: 12px !important; 
    background: #FFF5F0 !important; 
    border: 1px solid #FFD0BC !important; 
    border-radius: 8px !important; 
    padding: 12px !important; 
    text-decoration: none !important; 
    margin-bottom: 10px !important; 
    text-align: left !important;
    cursor: pointer !important;
  }
  .nmc-book-item:hover { 
    border-color: #FB5416 !important; 
    background: #FFEBE2 !important; 
  }
  .nmc-book-name { 
    flex: 1 !important; 
    font-weight: 600 !important; 
    font-size: 13px !important;
    line-height: 1.4 !important; 
    color: #222222 !important; 
  }
  .nmc-book-cta { 
    color: #FB5416 !important; 
    font-weight: 700 !important; 
    font-size: 12px !important; 
    white-space: nowrap !important; 
  }
`;
document.head.appendChild(_nmcStyle);

// ── 2. DOM Injector ───────────────────────────────────────────
function injectBookStrip() {
  if (document.getElementById("nmc-book-strip")) return;
  const modalContent = document.querySelector("#resultModal .modal-content") || document.querySelector(".modal-content");
  
  if (modalContent) {
    const strip = document.createElement("div");
    strip.id = "nmc-book-strip";
    strip.innerHTML = `
      <div class="nmc-strip-title">📚 AI Recommended Study Materials</div>
      <div id="nmc-strip-books">Loading best books via AI...</div>
    `;
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

// ── 3. Asli Trigger Function ───────────────────────────
window.nmcFetchStrip = async function (examName) {
  injectBookStrip();
  const booksContainer = document.getElementById("nmc-strip-books");
  if (!booksContainer) return;

  const cleanExam = examName || "Competitive Exam";

  try {
    // 🎯 Brief 2 Fix: Ab hum bina kisi 405 error ke chota Proxy URL call kar rahe hain
    //  Naya Code (Ab GitHub bhi Netlify ke backend se connect ho jayega)
const response = await fetch('https://aesthetic-babka-0eb571.netlify.app/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examName: cleanExam })
    });

    if (!response.ok) throw new Error("Backend failed");
    const booksData = await response.json();
    
    let htmlContent = "";
    booksData.forEach((book) => {
      htmlContent += `
        <a class="nmc-book-item" href="${nmcURL(book.search)}" target="_blank" rel="noopener">
          <span style="font-size:18px !important;">📖</span>
          <span class="nmc-book-name">${book.title}</span>
          <span class="nmc-book-cta">Buy Now →</span>
        </a>
      `;
    });
    booksContainer.innerHTML = htmlContent;

  } catch (error) {
    console.log("Fallback triggered:", error.message);
    // Agar AI fail ho toh user ko khali na dikhe, isliye fallback links:
    booksContainer.innerHTML = `
      <a class="nmc-book-item" href="${nmcURL(cleanExam + ' best books guide')}" target="_blank" rel="noopener">
        <span style="font-size:18px !important;">📚</span>
        <span class="nmc-book-name"><strong>Best Recommended Books & Study Guides</strong> for ${cleanExam}</span>
        <span class="nmc-book-cta">Buy Now →</span>
      </a>
      <a class="nmc-book-item" href="${nmcURL(cleanExam + ' solved papers')}" target="_blank" rel="noopener">
        <span style="font-size:18px !important;">📝</span>
        <span class="nmc-book-name"><strong>Previous Years Solved Papers</strong> & Mock Tests</span>
        <span class="nmc-book-cta">View Deals →</span>
      </a>
    `;
  }
};