document.getElementById("profile-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const company = document.getElementById("company").value;
    const linkedin = document.getElementById("linkedin").value;

    if (name !== "" && company !== "" && linkedin !== "") {
        document.getElementById("display-name").textContent = `Name: ${name}`;
        document.getElementById("display-company").textContent = `Company/University: ${company}`;
        document.getElementById("display-linkedin").textContent = `LinkedIn URL: ${linkedin}`;
    } else {
        alert("Please fill in all fields.");
    }
});