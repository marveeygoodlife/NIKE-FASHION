"use strict";

const userName = document.getElementById("contact-name");
const userEmail = document.getElementById("contact-email");
const userSubject = document.getElementById("contact-subject");
const userMessage = document.getElementById("contact-message");
const form = document.getElementById("contact-form");
const messageModal = document.getElementById("message-modal");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const closeModal = document.getElementById("close-modal");


/* helper functions */
function addClass(input) {
    input.classList.add("form-input-error");
}
function removeClass(input) {
    input.classList.remove("form-input-error");
}
function showError(input, message) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = message;
}
function clearError(input) {
    const errorElement = input.nextElementSibling;
		errorElement.textContent = "";
}
/* Show modal */
let modalTimeout;
function showModal(title, message) {
	modalTitle.textContent = title;
	modalMessage.textContent = message;

	clearTimeout(modalTimeout);

	messageModal.showModal();

	//clear modal after 5 seconds
	modalTimeout = setTimeout(() => {
		messageModal.close();
	}, 5000);
};

/* Close modal */
closeModal.addEventListener("click", () => {
    clearTimeout(modalTimeout);
	messageModal.close();
});

// validation
function validateUserName(input) {
    //regex
    const nameRegex = /^[a-zA-Z][a-zA-Z\s'-]{1,49}$/;
    //name value
    const username = input.value.trim();
    //validate
    if (!nameRegex.test(username)) {
        addClass(input);
        showError(input, "Please enter a valid name (2-50 characters).");
        return false;
    }
    //show/clear error
    clearError(input);
    removeClass(input);
    return true;
    // return true/false
}
function validateUserEmail(input) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const useremail = input.value.trim();
    if (!emailRegex.test(useremail)) {
        addClass(input);
        showError(input, "Please enter a valid email address.")
        return false;
    }
    removeClass(input);
    clearError(input);
    return true;
}

function validateUserSubject(input) {
    const subjectRegex = /^[\s\S]{3,10}$/;
    const usersubject = input.value.trim();
	
    if (!subjectRegex.test(usersubject)) {
        addClass(input);
        showError(input, "Subject must be between 3 to 10 characters.");
        return false;
    }
    removeClass(input);
    clearError(input);
    return true;
}
function validateUserMessage(input) {
    const messageRegex = /^[\s\S]{10,1000}$/;
    const usermessage = input.value.trim();
    if (!messageRegex.test(usermessage)) {
        addClass(input);
        showError(input, "Message must be between 10 and 1000 characters.");
        return false;
    }

    removeClass(input);
    clearError(input);
    return true;
}

//validate when user leaves input field
userName.addEventListener("blur", (e) => {
    validateUserName(e.target)
})
userEmail.addEventListener("blur", (e) => {
    validateUserEmail(e.target)
})
userSubject.addEventListener("blur", (e) => {
    validateUserSubject(e.target)
})
userMessage.addEventListener("blur", (e) => {
    validateUserMessage(e.target)
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = "https://formspree.io/f/mljjawbw";
    const formData = new FormData(form);

    const validName = validateUserName(userName);
    const validEmail = validateUserEmail(userEmail);
    const validSubject = validateUserSubject(userSubject);
    const validMessage = validateUserMessage(userMessage);

    if (!validName || !validEmail || !validSubject || !validMessage) return;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: formData
        });
        
        const data = await response.json();

        if (response.ok) {

            form.reset();

            [userName, userEmail, userSubject, userMessage].forEach(element => {
                removeClass(element);
                clearError(element);
            });

            showModal("Message Sent!", "Your message has been sent successfully. We will get back to you soon.");

        } else {

            showModal("Something Went Wrong", "Your message could not be sent. Please try again.");
        }

    } catch (error) {
        console.error("Error", error.message);
        showModal("Failed to Send", "Unable to connect to the server. Please check your internet connection and try again.");
    };
});