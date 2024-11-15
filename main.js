function _0x25f9() {
    var _0x21160e = [
        "497563ffEXgH",
        "226805wtobix",
        "30fsuTnF",
        "10fhYVwL",
        "179004VXoylm",
        "29439xVzkQL",
        "845154iuIWdT",
        "getElementById",
        "4174569YCGvNd",
        "value",
        "1688DOKabN",
        "345635blBpkd",
        "8qKENAP",
    ];
    _0x25f9 = function () {
        return _0x21160e;
    };
    return _0x25f9();
}

function _0x2df0(_0x3506de, _0x4dd340) {
    var _0x25f9c9 = _0x25f9();
    return (
        (_0x2df0 = function (_0x2df05b, _0x15b412) {
            _0x2df05b = _0x2df05b - 0x1c2;
            var _0x59bf9b = _0x25f9c9[_0x2df05b];
            return _0x59bf9b;
        }),
        _0x2df0(_0x3506de, _0x4dd340)
    );
}
(function (_0x7a201e, _0x498075) {
    var _0x1805be = _0x2df0,
        _0x3c9f36 = _0x7a201e();
    while (!![]) {
        try {
            var _0x35ee1e =
                parseInt(_0x1805be(0x1ca)) / 0x1 +
                -parseInt(_0x1805be(0x1c2)) / 0x2 +
                (parseInt(_0x1805be(0x1cd)) / 0x3) *
                (parseInt(_0x1805be(0x1c8)) / 0x4) +
                (parseInt(_0x1805be(0x1c7)) / 0x5) *
                (parseInt(_0x1805be(0x1cb)) / 0x6) +
                -parseInt(_0x1805be(0x1c4)) / 0x7 +
                (parseInt(_0x1805be(0x1c6)) / 0x8) *
                (parseInt(_0x1805be(0x1ce)) / 0x9) +
                (-parseInt(_0x1805be(0x1cc)) / 0xa) *
                (-parseInt(_0x1805be(0x1c9)) / 0xb);
            if (_0x35ee1e === _0x498075) break;
            else _0x3c9f36["push"](_0x3c9f36["shift"]());
        } catch (_0x4d1db4) {
            _0x3c9f36["push"](_0x3c9f36["shift"]());
        }
    }
})(_0x25f9, 0x63ab6),
(calculate = function () {
    var _0x3cdcf6 = _0x2df0,
        _0x5279d4 = document[_0x3cdcf6(0x1c3)]("a1")[_0x3cdcf6(0x1c5)],
        _0x1b48cb = document[_0x3cdcf6(0x1c3)]("b1")[_0x3cdcf6(0x1c5)],
        _0x1a248f = _0x1b48cb / _0x5279d4,
        _0x2abbee = document[_0x3cdcf6(0x1c3)]("a2")[_0x3cdcf6(0x1c5)],
        _0x468332 = document[_0x3cdcf6(0x1c3)]("a4")[_0x3cdcf6(0x1c5)],
        _0x19214d = document[_0x3cdcf6(0x1c3)]("a5")[_0x3cdcf6(0x1c5)];
    // Calculate the result
  var _0x3d271d = _0x2abbee * _0x1a248f - _0x468332 * _0x1a248f - (_0x468332 * _0x1a248f * "1") / _0x19214d;

  // Display the result with two decimal places
  document[_0x3cdcf6(0x1c3)]("a6")["innerHTML"] = _0x3d271d.toFixed(2);
  // Display the final score
  document.getElementById("finalScore")["innerText"] = _0x3d271d.toFixed(2);

  // Show the modal
  document.getElementById("resultModal").style.display = "flex";
});


function clearFields() {
    (document.getElementById("a1").value = ""),
      (document.getElementById("b1").value = ""),
      (document.getElementById("a2").value = ""),
      (document.getElementById("a4").value = ""),
      (document.getElementById("a5").value = ""),
      (document.getElementById("a6").innerHTML = "");
  }

  function copyToClipboard(text) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    // Show the popup message
    const popup = document.getElementById('popup');
    popup.classList.add('show'); // Add the show class to display it

    // Remove the popup after 3 seconds
    setTimeout(() => {
        popup.classList.remove('show'); // Remove the show class to hide it
    }, 3000);
}

function closeModal() {
    document.getElementById("resultModal").style.display = "none";
  }
  
  function downloadResult() {
    const { jsPDF } = window.jspdf;
  
    // Prompt for username and course name
    username = prompt("Please enter your name:");
    courseName = prompt("Please enter the exam name:");
  
    // Check if the user provided both inputs
    if (!username || !courseName) {
      alert("Both name and exam/course name are required to download the result sheet and see the result.");
      return; // Exit if the user didn't provide the required information
    }
  
    // Define your Google Apps Script URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbw-CE0H-x3rz_T1OBF1ky7He61Fo8rSR9evwpHl_CMikePYNqq7B4XcnNKU14CUyITq/exec'; // Replace with your actual script URL
  
    // Prepare the data payload to be sent
    const payload = {
      username: username,
      courseName: courseName
    };
  
    // Send the data to Google Sheets
    fetch(scriptURL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(() => {
      console.log("Data successfully sent to Google Sheets");
    }).catch(error => {
      console.error("Error sending data to Google Sheets:", error);
    });
  
    // Proceed to generate the PDF
    const currentDateTime = new Date().toLocaleString();
    const totalQuestions = document.getElementById("a1").value;
    const maxMarks = parseFloat(document.getElementById("b1").value);
    const attempted = document.getElementById("a2").value;
    const wrongAnswers = document.getElementById("a4").value;
    const negativeRatio = document.getElementById("a5").options[document.getElementById("a5").selectedIndex].text;
    const finalScore = parseFloat(document.getElementById("a6").textContent);
    const percentage = (finalScore / maxMarks) * 100;
  
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Negative Marking Calculator Results", 105, 20, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25);
  
    doc.setFont("special-elite", "normal");
    doc.setFontSize(14);
    doc.text(`Name: ${username}`, 10, 35);
    doc.text(`Exam: ${courseName}`, 10, 45);
  
    const rows = [
      { field: "Total Questions", value: totalQuestions },
      { field: "Maximum Marks", value: maxMarks },
      { field: "Total Questions Attempted", value: attempted },
      { field: "Number of Wrong Questions", value: wrongAnswers },
      { field: "Negative Marking Ratio", value: negativeRatio },
      { field: "Final Score", value: finalScore.toFixed(2) },
      { field: "Percentage", value: `${percentage.toFixed(2)}%` }
    ];
  
    let startY = 55;
    rows.forEach((row, index) => {
      doc.setFillColor(index % 2 === 0 ? 255 : 245);
      doc.rect(10, startY, 190, 10, 'F');
      doc.setTextColor(0, 0, 0);
      doc.text(`${row.field}:`, 15, startY + 7);
      doc.text(row.value.toString(), 100, startY + 7);
      startY += 10;
    });
  
    doc.line(10, startY + 5, 200, startY + 5);
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    startY += 10;
    doc.text("Thank you for using the Negative Marking Calculator!", 10, startY);
  
    doc.setFontSize(12);
    doc.text("Developed by Saham Alam", 10, startY + 10);
    // Add the current date and time at the bottom left
const pageHeight = doc.internal.pageSize.getHeight();
const margin = 10; // Margin from the bottom
const dateY = pageHeight - margin; // Y position for the date
doc.setTextColor(0, 0, 0);
doc.text(`Date & Time: ${currentDateTime}`, 10, dateY); // X position is 10 for left alignment  
    doc.save("negative_marking_calculator_result.pdf");
  
    // Close the modal after download
    closeModal();
  }
  
  
  // Global variables to store username and course name
let username = '';
let courseName = '';


