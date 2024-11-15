// Back-to-Top Button Functionality
const backToTopButton = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    backToTopButton.style.display = window.scrollY > 300 ? 'block' : 'none';
});
backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Course Card Slide-in Observer
const cards = document.querySelectorAll('.course-card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('slide-in');
            observer.unobserve(entry.target); 
        }
    });
}, { threshold: 0.5 });
cards.forEach(card => observer.observe(card));

// Navigation Links Hover Effect
document.querySelectorAll('.nav-links a').forEach(link => {
    if (!link.classList.contains('active')) { // Exclude the active link
        link.addEventListener('mouseenter', () => {
            link.style.color = '#0580e4'; // Change to your desired hover color
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'scale(1)';
            link.style.color = '';
        });
    }
});

// Home Content Staggered Fade-in Animation
window.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.home-content-text h1, .home-content-text p');
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = 1;
            element.style.transition = 'opacity 1s ease-in-out';
        }, index * 500); // Adds a delay between each element
    });
});

// Apply Fade-in on Page Load (Excluding Navigation)
window.addEventListener('load', () => {
    const mainContent = document.querySelectorAll('body > :not(nav)');
    mainContent.forEach(element => element.classList.add('fade-in'));
});


// Share Modal Functionality
function toggleShareModal() {
    const modal = document.getElementById('share-modal');
    if (modal.style.display === "none" || modal.style.display === "") {
        modal.style.display = "block"; // Show the modal
    } else {
        modal.style.display = "none"; // Hide the modal
    }
}

// Close the modal when the user clicks anywhere outside of the modal content
window.onclick = function(event) {
    const modal = document.getElementById('share-modal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// JavaScript function to navigate back to the previous page
function goBack() {
    window.history.back();
}

// Update Login Link Based on User Status (Login/Logout)
document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById('loginBtn');
    const loginLink = document.getElementById('loginLink');

    // Check if the user is already logged in
    if (localStorage.getItem('loggedIn') === 'true') {
        loginLink.textContent = 'Logout'; // Change text to 'Logout'
    } else {
        loginLink.textContent = 'Log In'; // Keep it 'Log In' if not logged in
    }

    // If the login link is clicked and the user is logged in, log them out
    if (loginLink) {
        loginLink.addEventListener('click', (event) => {
            if (loginLink.textContent === 'Logout') {
                localStorage.setItem('loggedIn', 'false');
                alert('You have logged out successfully.');
                loginLink.textContent = 'Log In'; // Change back to 'Log In'
                // Optionally, redirect to home page after logout
                window.location.href = 'index.html'; // Example: redirect to homepage
            }
        });
    }
});
// Function to format the current date and time
function updateTimestamp() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    };
    document.getElementById("timestamp").innerText = `Last updated on: ${now.toLocaleDateString('en-US', options)}`;
}
// Call the function to display the timestamp
updateTimestamp();

let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];

function calculateTotal() {
    // Get all the course checkboxes
    const checkboxes = document.querySelectorAll('.course-checkbox');
    let total = 0;
    let selectedCourses = [];

    // Calculate the base total and store selected courses
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            total += parseFloat(checkbox.getAttribute('data-price'));
            selectedCourses.push(checkbox.parentElement.textContent.trim());
        }
    });

    // Error handling: if no courses are selected, alert the user
    if (selectedCourses.length === 0) {
        alert("Please select at least 1 course.");
        return;
    }

    // Apply discount based on the number of selected courses
    let discount = 0;
    if (selectedCourses.length === 2) {
        discount = 0.05;
    } else if (selectedCourses.length === 3) {
        discount = 0.10;
    } else if (selectedCourses.length > 3) {
        discount = 0.15;
    }

    // Calculate the discounted price
    const discountedTotal = total * (1 - discount);

    // Calculate VAT (15%)
    const VAT_RATE = 0.15;
    const vatAmount = discountedTotal * VAT_RATE;
    const finalTotal = discountedTotal + vatAmount;

    // Display the calculation details
    const totalFeeDisplay = document.getElementById('totalFeeDisplay');
    totalFeeDisplay.innerHTML = `
        <p>Base Total: R${total.toFixed(2)}</p>
        <p>Discount: ${discount * 100}% Discounted Total: R${discountedTotal.toFixed(2)}</p>
        <p>VAT (15%): R${vatAmount.toFixed(2)}</p>
        <p><strong>Final Total: R</strong>${finalTotal.toFixed(2)}</p>
    `;

    // Save the calculated values in local storage
    localStorage.setItem('calculateTabData', JSON.stringify({
        total: total.toFixed(2),
        discount: discount * 100,
        discountedTotal: discountedTotal.toFixed(2),
        vatAmount: vatAmount.toFixed(2),
        finalTotal: finalTotal.toFixed(2),
        selectedCourses: selectedCourses
    }));
}

// Retrieve and display calculation values from local storage if available
function loadCalculateTabData() {
    const storedData = localStorage.getItem('calculateTabData');
    if (storedData) {
        const { total, discount, discountedTotal, vatAmount, finalTotal, selectedCourses } = JSON.parse(storedData);
        const totalFeeDisplay = document.getElementById('totalFeeDisplay');
        totalFeeDisplay.innerHTML = `
            <p>Base Total: R${total}</p>
            <p>Discount: ${discount}% Discounted Total: R${discountedTotal}</p>
            <p>VAT (15%): R${vatAmount}</p>
            <p><strong>Final Total: R</strong>${finalTotal}</p>
        `;
        
        // Optionally re-check selected courses
        const checkboxes = document.querySelectorAll('.course-checkbox');
        checkboxes.forEach(checkbox => {
            if (selectedCourses.includes(checkbox.parentElement.textContent.trim())) {
                checkbox.checked = true;
            }
        });
    }
}

// Call loadCalculateTabData when the page loads to display previously saved data
window.addEventListener('DOMContentLoaded', loadCalculateTabData);


    // Prepare the data for the API request (only if form details are needed)
    if (name && phone && email) {
        var data = {
            service_id: 'service_vu7s899',
            template_id: 'template_z7ziia5',
            user_id: 'pWpJMPjJardiNVH0o',
            template_params: {
                'name': name,
                'phone': phone,
                'email': email,
                'message': 'Courses: ' + selectedCourses.join(', ') + ' | Total: ' + finalTotal.toFixed(2) + ' ZAR'
            }
        };

        // Send the data via a POST request using EmailJS
        $.ajax('https://api.emailjs.com/api/v1.0/email/send', {
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json'
        }).done(function() {
            alert('Your details have been sent successfully!');
        }).fail(function(error) {
            alert('Oops... Something went wrong: ' + JSON.stringify(error));
        });
    }
    /// Function to toggle the calculate tab
document.getElementById('cart-button').addEventListener('click', function() {
    const calculateTab = document.querySelector('.calculateTab');
    calculateTab.classList.toggle('visible');
});

// Function to close the tab when the "CLOSE" button is clicked
function closeTab() {
    document.querySelector('.calculateTab').classList.remove('visible');
}

// Function to add to cart and check the course in .calculateTab
function addToCart(courseName, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if course is already in the cart
    if (!cart.some(item => item.name === courseName)) {
        cart.push({ name: courseName, price: price });
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Check the course checkbox in .calculateTab if present
    updateCheckBoxes(courseName);
}

// Function to remove from cart and uncheck the course in .calculateTab
function removeFromCart(courseName, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Filter out the course that needs to be removed
    cart = cart.filter(item => item.name !== courseName);
    localStorage.setItem('cart', JSON.stringify(cart));

    // Uncheck the course checkbox in .calculateTab if present
    uncheckCheckBoxes(courseName);
}

// Function to update checkboxes based on course name
function updateCheckBoxes(courseName) {
    const checkboxes = document.querySelectorAll('.course-checkbox');
    
    checkboxes.forEach(checkbox => {
        const courseText = checkbox.parentElement.textContent.trim();
        if (courseText.includes(courseName)) {
            checkbox.checked = true; // Check the checkbox
        }
    });
}

// Function to uncheck checkboxes based on course name
function uncheckCheckBoxes(courseName) {
    const checkboxes = document.querySelectorAll('.course-checkbox');
    
    checkboxes.forEach(checkbox => {
        const courseText = checkbox.parentElement.textContent.trim();
        if (courseText.includes(courseName)) {
            checkbox.checked = false; // Uncheck the checkbox
        }
    });
}

// Function to synchronize checkboxes with localStorage data on page load
function syncCartWithCheckBoxes() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.forEach(course => updateCheckBoxes(course.name));
}

// Ensure the function runs when the page loads
window.onload = () => {
    syncCartWithCheckBoxes();
};

// Toggle Add/Added state for the button
function toggleAddToCart(button, courseName, price) {
    // Check if the button has the 'added' text already
    if (button.textContent === 'Remove') {
        // Change button text back to 'Add' and remove the item from the cart
        button.textContent = 'Add';
        removeFromCart(courseName, price);
    } else {
        // Change button text to 'Added'
        button.textContent = 'Remove';
        addToCart(courseName, price);
    }
}






















