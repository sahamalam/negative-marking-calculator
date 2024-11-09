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
    const { jsPDF } = window.jspdf; // Access jsPDF from the window object
    // Prompt for username and course name
  username = prompt("Please enter your name:");
  courseName = prompt("Please enter the exam/ course name:");

  // Check if the user provided both inputs
  if (!username || !courseName) {
      alert("Both name and eaxm/ course name are required to download result sheet and see result.");
      return; // Exit if the user didn't provide the required information
  }
    const currentDateTime = new Date().toLocaleString(); // Current date and time
    const totalQuestions = document.getElementById("a1").value;
    const maxMarks = parseFloat(document.getElementById("b1").value); // Parse as float
    const attempted = document.getElementById("a2").value;
    const wrongAnswers = document.getElementById("a4").value;
    const negativeRatio = document.getElementById("a5").options[
      document.getElementById("a5").selectedIndex
    ].text; // Get the text of the selected option
    const finalScore = parseFloat(document.getElementById("a6").textContent); // Parse as float
  
     // Calculate percentage
   const percentage = (finalScore / maxMarks) * 100;

    const doc = new jsPDF();
    // Set title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Negative Marking Calculator Results", 105, 20, { align: "center" });
  
    // Draw a line under the title
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25); // Horizontal line
  
    // Set font for the body text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
  
    // Add content with some spacing
    const startY = 30; // Starting Y position for the text
    const lineHeight = 10; // Space between lines
  
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${username}`, 10, startY);
    doc.text(`Exam/ Course: ${courseName}`, 10, startY + lineHeight);
    doc.text(`Total Questions: ${totalQuestions}`, 10, startY + lineHeight * 2);
    doc.text(`Maximum Marks: ${maxMarks}`, 10, startY + lineHeight * 3);
    doc.text(`Total Questions Attempted: ${attempted}`, 10, startY + lineHeight * 4);
    doc.text(`Number of Wrong Questions: ${wrongAnswers}`, 10, startY + lineHeight * 5);
    doc.text(`Negative Marking Ratio: ${negativeRatio}`, 10, startY + lineHeight * 6);
    doc.text(`Final Score: ${finalScore.toFixed(2)}`, 10, startY + lineHeight * 7);
    doc.text(`Percentage: ${percentage.toFixed(2)}%`, 10, startY + lineHeight * 8);

  // Draw a line above the final score
    doc.setLineWidth(0.5);
    doc.line(10, startY + lineHeight * 8 + 5, 200, startY + lineHeight * 8 + 5); // Horizontal line

    // Add a thank you note
    doc.setFont("helvetica", "italic");
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    const thankYouY = startY + lineHeight * 9; // Y position for the thank you note
    doc.text("Thank you for using the Negative Marking Calculator!", 10, thankYouY);

    // Add the designer's credit below the line
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Design and developed by Saham Alam", 10, thankYouY + 10); // Position below the line
  
  
  
  // Add the current date and time at the bottom left
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10; // Margin from the bottom
    const dateY = pageHeight - margin; // Y position for the date
    doc.text(`Date & Time: ${currentDateTime}`, 10, dateY); // X position is 10 for left alignment
  
    // Save the PDF
    doc.save("negative_marking_calculator_result.pdf");
  
    // Close the modal after download
    closeModal();
  }
  
  // Global variables to store username and course name
let username = '';
let courseName = '';