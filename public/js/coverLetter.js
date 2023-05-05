const form = document.getElementById('coverLetterForm');
const popup = document.getElementById('popup');
const popupContent = document.getElementById('popup-content');
const popupClose = document.getElementById('popup-close');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const jobTitle = document.getElementById('jobTitle').value;
    const jobDescription = document.getElementById('jobDescription').value;

    const response = await generateCoverLetter(jobTitle, jobDescription);
    popupContent.textContent = response.choices[0].text;

    // Show the popup
    popup.style.display = 'block';
});

popupClose.addEventListener('click', () => {
    popup.style.display = 'none';
});

async function generateCoverLetter(jobTitle, jobDescription) {
    const apiKey = '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';
    const prompt = `Please write a cover letter for the following job position:\nJob Title: ${jobTitle}\nJob Description: ${jobDescription}\n\nCover Letter:`;

    const response = await fetch('https://api.openai.com/v1/engines/text-davinci-002/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            prompt: prompt,
            max_tokens: 10,
            n: 1,
            stop: null,
            temperature: 0.4,
        }),
    });

    const data = await response.json();
    return data;
}
