document.addEventListener("DOMContentLoaded", function() {
    // Add the event listener to the button after the DOM is fully loaded
    document.getElementById("placeOrderBtn").addEventListener("click", function(event) {
        const name = document.getElementById("nameCont").value.trim();
        const email = document.getElementById("emailCont").value.trim();
        const phone = document.getElementById("phoneCont").value.trim();
        const address = document.getElementById("addressCont").value.trim();
        const postalCode = document.getElementById("postalCodeCont").value.trim();
        const city = document.getElementById("cityCont").value.trim();

        // Name validation
        if (name.length < 2 || name.length > 50) {
            alert("Name must be between 2 and 50 characters.");
            return; // Stop further execution
        }

        // Email validation
        if (!email.includes('@') || email.length > 50) {
            alert("Please enter a valid email address (max 50 characters).");
            return;
        }

        // Phone validation: check for valid format using regex
        const phonePattern = /^[0-9\-\(\)\s]+$/;
        if (!phonePattern.test(phone) || phone.length > 50) {
            alert("Please enter a valid phone number (digits, hyphens, parentheses allowed, max 50 characters).");
            return;
        }

        // Address validation
        if (address.length < 2 || address.length > 50) {
            alert("Street address must be between 2 and 50 characters.");
            return;
        }

        // Postal code validation: exactly 5 digits
        const postalCodePattern = /^[0-9]{5}$/;
        if (!postalCodePattern.test(postalCode)) {
            alert("Postal code must be exactly 5 digits.");
            return;
        }

        // City validation
        if (city.length < 2 || city.length > 50) {
            alert("City must be between 2 and 50 characters.");
            return;
        }

        // If all validations pass
        window.location.href = 'orderPlaced.html'; // Redirect to order confirmation page
    });
});
