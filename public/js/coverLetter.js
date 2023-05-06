const form = document.getElementById('coverLetterForm');
const popup = document.getElementById('popup');
const popupContent = document.getElementById('popup-content');
const popupClose = document.getElementById('popup-close');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // const jobTitle = document.getElementById('jobTitle').value;
    // const jobDescription = document.getElementById('jobDescription').value;

    // const response = await generateCoverLetter(jobTitle, jobDescription);
    // popupContent.textContent = response.choices[0].text;

    // Show the popup
    popup.style.display = 'block';
});



