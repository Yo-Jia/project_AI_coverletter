document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const messageContainer = document.querySelector('.form-message');

    processFormData(name, email, message);

    // Display the thank you message
    messageContainer.textContent = 'Thank you for contacting us! We will get back to you shortly.';

    // Clear the form fields
    event.target.reset();
});

function processFormData(name, email, message) {
    console.log("Form data:");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);
}
