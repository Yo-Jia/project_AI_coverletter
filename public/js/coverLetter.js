// const form = document.getElementById('coverLetterForm');
// const popup = document.getElementById('popup');
// const popupContent = document.getElementById('popup-content');
const popupClose = document.getElementById('popup-close');

// form.addEventListener('submit', async (event) => {
//     event.preventDefault();

//     // const jobTitle = document.getElementById('jobTitle').value;
//     // const jobDescription = document.getElementById('jobDescription').value;

//     // const response = await generateCoverLetter(jobTitle, jobDescription);
//     // popupContent.textContent = response.choices[0].text;

//     // Show the popup
//     popup.style.display = 'block';
// });

document.getElementById("copyButton").addEventListener("click", function () {
    const textToCopy = document.getElementById("popup-content").textContent;
    navigator.clipboard.writeText(textToCopy).then(function () {
        console.log("Text copied to clipboard");
    }).catch(function (err) {
        console.error("Failed to copy text: ", err);
    });
});

popupClose.addEventListener('click', function() {
    popup.style.display = 'none';
});

document.getElementById('downloadButton').addEventListener('click', function () {
    var cvResponse = document.getElementById('popup-content').textContent;
    var filename = 'cover_letter.txt';

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(cvResponse));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
});