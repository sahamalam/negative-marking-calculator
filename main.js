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

         // Calculate the penalty marks
         const penaltyMarks = _0x468332 * (1 / _0x19214d);

    // Calculate the result
  var _0x3d271d = _0x2abbee * _0x1a248f - _0x468332 * _0x1a248f - (_0x468332 * _0x1a248f * "1") / _0x19214d;

  // Display the result with two decimal places
  document[_0x3cdcf6(0x1c3)]("a6")["innerHTML"] = _0x3d271d.toFixed(2);
  // Display the final score
  document.getElementById("finalScore")["innerText"] = _0x3d271d.toFixed(2);

  // Show the modal
  document.getElementById("resultModal").style.display = "flex";

  // Store penaltyMarks globally (for use in the PDF)
  window.penaltyMarks = penaltyMarks.toFixed(2);
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
    const username = prompt("Please enter your name:");
    const courseName = prompt("Please enter the exam name:");

    // Check if the user provided both inputs
    if (!username || !courseName) {
        alert("Both name and exam/course name are required to download the result sheet.");
        return;
    }
     // Google Apps Script URL (Replace with your actual script URL)
     const scriptURL = 'https://script.google.com/macros/s/AKfycbw-CE0H-x3rz_T1OBF1ky7He61Fo8rSR9evwpHl_CMikePYNqq7B4XcnNKU14CUyITq/exec';
     const payload = { username: username, courseName: courseName };
 
     // Send the data to Google Sheets
     fetch(scriptURL, {
         method: 'POST',
         mode: 'no-cors',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload)
     });

    // Retrieve score details from the form
    const totalQuestions = parseInt(document.getElementById("a1").value);
    const maxMarks = parseFloat(document.getElementById("b1").value);
    const attempted = parseInt(document.getElementById("a2").value);
    const wrongAnswers = parseInt(document.getElementById("a4").value);
    const negativeRatio = document.getElementById("a5").options[document.getElementById("a5").selectedIndex].text;
    const finalScore = parseFloat(document.getElementById("a6").textContent);
    const percentage = (finalScore / maxMarks) * 100;
    const penaltyMarks = window.penaltyMarks || (wrongAnswers * negativeRatio).toFixed(2);
    const currentDateTime = new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Calculate correct answers and unattempted questions
    const correctAnswers = attempted - wrongAnswers;
    const unattempted = totalQuestions - attempted;

    // Ensure the chart data adds up to 100% of total questions
    const data = [
        correctAnswers,  // Correct answers count
        wrongAnswers,    // Incorrect answers count
        unattempted      // Unattempted questions count
    ];

    const labels = ['Correct Answers', 'Incorrect Answers', 'Unattempted Questions'];
    const backgroundColors = ['#4caf50', '#f44336', '#ff9800'];

    // Create jsPDF document
    const doc = new jsPDF();
    doc.setFont("times", "bold");
    doc.setFontSize(24);
    doc.text("Negative Marking Calculator Result", 105, 20, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25);

    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text(`Name: ${username}`, 10, 35);
    doc.text(`Exam: ${courseName}`, 10, 45);

    // Display score details
    const rows = [
        { field: "Total Questions", value: totalQuestions },
        { field: "Maximum Marks", value: maxMarks },
        { field: "Total Questions Attempted", value: attempted },
        { field: "Number of Wrong Questions", value: wrongAnswers },
        { field: "Negative Marking Ratio", value: negativeRatio },
        { field: "Penalty Marks", value: penaltyMarks }, // Added Penalty Marks
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
    startY += 10;

    // Define the canvas for Chart.js
    const chartCanvas = document.createElement('canvas');
    chartCanvas.width = 300;
    chartCanvas.height = 300;
    const ctx = chartCanvas.getContext('2d');

    // Generate a pie chart
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 0,  // Ensure no border around slices
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true }
            }
        }
    });

    setTimeout(() => {
      const chartImage = chartCanvas.toDataURL('image/png');
      const chartWidth = 80;
      const chartHeight = 80;
      const chartX = (doc.internal.pageSize.getWidth() - chartWidth) / 2;
      const pieChartY = startY;
  
      // Add pie chart to the PDF
      doc.addImage(chartImage, 'PNG', chartX, pieChartY, chartWidth, chartHeight);
  
      // Add color labels below the pie chart
      const labelStartY = pieChartY + chartHeight + 10; // Adjusted Y position below the pie chart
      const labelX = 10; // Left margin for labels
      doc.setFontSize(10);
  
      // Draw the color labels below the pie chart
      labels.forEach((label, i) => {
          // Set color for each label
          doc.setFillColor(backgroundColors[i]);
          // Draw a small color box for each label
          doc.rect(labelX, labelStartY + (i * 10), 4, 4, 'F');
          // Add text next to the color box
          doc.text(`${label}: ${data[i]}`, labelX + 6, labelStartY + (i * 10 + 4));
      });
  
      // Footer
      const pageHeight = doc.internal.pageSize.getHeight();
      const footerY = pageHeight - 20;
      doc.setFontSize(10);
      doc.text("Developed by Saham Alam", 10, footerY);
      doc.text(`${currentDateTime}`, 165, footerY);
      doc.text("Thank you for using the Negative Marking Calculator!", 10, pageHeight - 10);
  
      // Save PDF
      doc.save("negative_marking_calculator_result.pdf");
  }, 1000);
  



    // Close the modal after download
    closeModal();
  }
  
  
  // Global variables to store username and course name
let username = '';
let courseName = '';


