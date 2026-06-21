import validator from 'https://cdn.jsdelivr.net/npm/validator@latest/+esm';
//for phones
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    sidebar.classList.toggle('active');

    if (sidebar.classList.contains('active')) {
        overlay.style.display = 'block';
        // Slight delay to allow display:block to apply before animating opacity
        setTimeout(() => overlay.style.opacity = '1', 10);
    } else {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 400);
    }
}

// faster loading
const links = document.querySelectorAll('.navigation-link');
const contentArea = document.getElementById('content-area');

async function navigateTo(targetUrl) {
    try {
        const response = await fetch(targetUrl);
        const newHtmlContent = await response.text();
        const parser = new DOMParser();
        const tempDoc = parser.parseFromString(newHtmlContent, 'text/html');
        const contentToBeReplaced = tempDoc.getElementById('content-area')
        contentArea.className = contentToBeReplaced.className;
        contentArea.innerHTML = contentToBeReplaced.innerHTML;
        loadLoadCalendar()
    }
    catch (err) {
        console.log(`error : ${err}`)
    }
}

// Listen for clicks anywhere on the document
document.addEventListener('click', async function (event) {
    // Check if the clicked element (or its parent) has the class '.navigation-link'
    const link = event.target.closest('.navigation-link');

    // If it's not a navigation link, ignore the click and do nothing
    if (!link) return;

    try {
        event.preventDefault(); // Stop the browser from doing a hard reload
        const targetUrl = link.getAttribute('href');
        window.history.pushState(null, '', targetUrl); // Update the URL bar

        await navigateTo(targetUrl); // Wait for the new page content to load
        initializePage();
    }
    catch (err) {
        console.log(`error : ${err}`);
    }
});

window.addEventListener('popstate', async function (event) { // 1. Added 'event' here
    let targetUrl = 'index.html';

    // 2. Check the memory first
    if (event.state && event.state.path) {
        targetUrl = event.state.path; // Assigned to targetUrl instead of currentPath
    }
    // 3. ONLY split the URL if the memory is empty!
    else {
        const urlParts = window.location.pathname.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        if (lastPart) {
            targetUrl = lastPart;
        }
    }

    await navigateTo(targetUrl);
    initializePage();
});

//schedule
// --- MODAL FUNCTIONS ---
// We attach these to 'window' so they can be called from anywhere
window.openEventModal = function (name, date, location, time) {
    document.getElementById('modalEventName').innerText = name;
    document.getElementById('modalEventDate').innerText = date;

    // Show or hide location/time based on if they exist for that day
    if (location) {
        document.getElementById('modalLocationContainer').style.display = 'block';
        document.getElementById('modalEventLocation').innerText = location;
    } else {
        document.getElementById('modalLocationContainer').style.display = 'none';
    }

    if (time) {
        document.getElementById('modalTimeContainer').style.display = 'block';
        document.getElementById('modalEventTime').innerText = time;
    } else {
        document.getElementById('modalTimeContainer').style.display = 'none';
    }

    document.getElementById('eventModalOverlay').classList.add('active');
    document.getElementById('eventModal').classList.add('active');
};

window.closeEventModal = function () {
    document.getElementById('eventModalOverlay').classList.remove('active');
    document.getElementById('eventModal').classList.remove('active');
};

// --- SCHEDULE LOGIC ---
function loadLoadCalendar() {
    const calendarGrid = document.querySelector('.calendar-grid');

    if (calendarGrid) {
        // Create the Modal HTML and inject it into the page exactly once
        if (!document.getElementById('eventModal')) {
            const modalHTML = `
            <div class="event-modal-overlay" id="eventModalOverlay" onclick="closeEventModal()"></div>
            <div class="event-modal" id="eventModal">
                <button class="modal-close-btn" onclick="closeEventModal()">&times;</button>
                <h4 id="modalEventName"></h4>
                <p><strong>Date:</strong> <span id="modalEventDate"></span></p>
                <p id="modalLocationContainer"><strong>Location:</strong> <span id="modalEventLocation"></span></p>
                <p id="modalTimeContainer"><strong>Time:</strong> <span id="modalEventTime"></span></p>
            </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        const yearSelect = document.getElementById("yearSelect");
        yearSelect.innerHTML = ''
        for (let year = 2024; year <= 2100; year++) {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }

        const date = new Date();
        const month = (date.getMonth() + 1);
        const year = date.getFullYear();

        const calendarChooseMonth = document.getElementById('monthSelect');
        calendarChooseMonth.value = month;
        const calendarChooseYear = document.getElementById('yearSelect');
        calendarChooseYear.value = year;

        function getDaysInMonth(month, year) {
            return (new Date(year, month, 0)).getDate();
        }

        function loadCalendar() {
            const existingDays = calendarGrid.querySelectorAll('.cal-day');
            existingDays.forEach(day => day.remove());

            const selectedMonth = calendarChooseMonth.value;
            const selectedYear = calendarChooseYear.value;
            const numberOfEmptyBoxes = (new Date(selectedYear, selectedMonth - 1, 1)).getDay();

            let daysHtml = '';

            // Empty Boxes
            for (let i = 0; i < numberOfEmptyBoxes; i++) {
                daysHtml += `<div class="cal-day empty"></div>`;
            }

            // Numbered Days
            const numberOfDays = getDaysInMonth(selectedMonth, selectedYear);
            for (let i = 1; i <= numberOfDays; i++) {
                const dayOfTheWeek = (new Date(selectedYear, selectedMonth - 1, i)).getDay();

                // TUESDAY (Day 2)
                if (dayOfTheWeek === 2) {
                    daysHtml += `
                    <div class="cal-day has-event" onclick="openEventModal('Hanuman Chalisa', '${i} / ${selectedMonth} / ${selectedYear}', 'Proposed Innovation Garage, Opp. 1.8K Hostel', '7:00 PM')">
                        <div class="cal-date-number day${dayOfTheWeek}">${i}</div>
                        <div class="cal-event-name">Hanuman Chalisa</div>
                    </div>`;
                }
                // SATURDAY (Day 6)
                else if (dayOfTheWeek === 6) {
                    daysHtml += `
                    <div class="cal-day has-event" onclick="openEventModal('Hanuman Chalisa', '${i} / ${selectedMonth} / ${selectedYear}', 'Kazipet Railway Station', '7:00 PM')">
                        <div class="cal-date-number day${dayOfTheWeek}">${i}</div>
                        <div class="cal-event-name">Hanuman Chalisa</div>
                    </div>`;
                }
                // REGULAR DAYS
                else {
                    daysHtml += `
                    <div class="cal-day">
                        <div class="cal-date-number day${dayOfTheWeek}">${i}</div>
                    </div>`;
                }
            }
            calendarGrid.innerHTML += daysHtml;
        }
        calendarChooseMonth.removeEventListener('change', loadCalendar);
        calendarChooseYear.removeEventListener('change', loadCalendar);
        calendarChooseMonth.addEventListener('change', loadCalendar);
        calendarChooseYear.addEventListener('change', loadCalendar);
        loadCalendar();
    }
}
loadLoadCalendar();
//for receiving suggestion & question form data
document.addEventListener('submit', async (event) => {
    const form = event.target;

    if (form.matches('.suggestionsForm')) {
        event.preventDefault();
        const suggestion = document.getElementById('suggestionInput').value;
        try {
            await fetch('/api/suggestions', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ suggestion })
            });
            document.getElementById('suggestionInput').value = '';
        } catch (err) {
            console.log(`error: ${err}`);
        }
    }

    if (form.matches('.questionForm')) {
        event.preventDefault();
        const question = document.getElementById('questionInput').value;
        try {
            await fetch('/api/questions', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ question })
            });
            document.getElementById('questionInput').value = '';
        } catch (err) {
            console.log(`error: ${err}`);
        }
    }
});
/* --- AUTHENTICATION (LOGIN/REGISTER) BACKEND LOGIC --- */

function authLogic() {
    const authForm = document.querySelector('.auth-form');

    if (authForm) {
        authForm.addEventListener('submit', async function (e) {
            e.preventDefault(); // Stop standard HTML form submission

            // Grab the values
            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;
            const confirmPassword = document.getElementById('confirm-password')?.value;

            const submitBtn = this.querySelector('.auth-btn');

            // Set button to loading state
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'PLEASE WAIT...';
            submitBtn.style.opacity = '0.7';
            submitBtn.style.pointerEvents = 'none';

            try {
                // --- REGISTER ROUTE ---
                if (confirmPassword !== undefined) {
                    if (password !== confirmPassword) {
                        alert("Oops! Your passwords don't match.");
                        resetButton(submitBtn, originalText);
                        return;
                    }
                    if (!validator.isEmail(email)) {
                        alert("invalid email format")
                        resetButton(submitBtn, originalText);
                        return;
                    }
                    if (!validator.isStrongPassword(password)) {
                        alert("weak password")
                        resetButton(submitBtn, originalText);
                        return;
                    }
                    // 1. Send data to your Register endpoint
                    const response = await fetch('/api/register', { // <-- REPLACE with your actual backend URL
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    });

                    const data = await response.json();

                    // 2. Handle the server's response
                    if (response.ok) {
                        alert("Registration successful! Please log in.");
                        window.location.replace('login.html');
                    } else {
                        // Display error from the server (e.g., "Email already exists")
                        alert(data.message || "Registration failed. Please try again.");
                        resetButton(submitBtn, originalText);
                    }
                }
                // --- LOGIN ROUTE ---
                else {
                    // 1. Send data to your Login endpoint
                    const response = await fetch('/api/login', { // <-- REPLACE with your actual backend URL
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    });

                    const data = await response.json();

                    // 2. Handle the server's response
                    if (response.ok) {
                        // Usually, you'd save a token here, e.g., localStorage.setItem('token', data.token);
                        alert("Login successful!");
                        window.location.replace('index.html');
                    } else {
                        // Display error from server (e.g., "Invalid credentials")
                        alert(data.message || "Login failed. Please check your credentials.");
                        resetButton(submitBtn, originalText);
                    }
                }
            } catch (error) {
                console.error("Network Error:", error);
                alert("Something went wrong connecting to the server. Please try again later.");
                resetButton(submitBtn, originalText);
            }
        });
    }

    function resetButton(btn, text) {
        btn.innerText = text;
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
    }
}

/* --- PROFILE FETCH & LOGOUT LOGIC --- */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Fetch Profile Data (Only runs if the profile-box is on the screen)
    const profileBox = document.querySelector('.profile-box');

    if (profileBox) {
        loadProfileData();
    }

    // 2. Logout Event Listener
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                // Assuming you create a /api/logout route that clears the cookie
                const response = await fetch('/api/logout', { method: 'POST' });

                if (response.ok) {
                    window.location.replace('login.html'); // Kick them back to login
                } else {
                    alert("Trouble logging out. Please try again.");
                }
            } catch (error) {
                console.error("Logout Error:", error);
            }
        });
    }
});

// Helper function to fetch and display the data
async function loadProfileData() {
    try {
        // REPLACE '/api/profile' with your exact backend viewProfile route
        const response = await fetch('/api/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        });

        const data = await response.json();

        if (response.ok) {
            // Assuming your backend sends back the user object 
            // e.g., res.status(200).json({ user: req.user })
            const user = data.user || data;

            // Update HTML elements
            // We use optional chaining (?) in case your schema doesn't have a name yet
            const displayName = "Devotee";
            document.getElementById('profile-email').innerText = user.email;

            // Format the MongoDB timestamp (createdAt) nicely
            if (user.createdAt) {
                const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                document.getElementById('profile-date').innerText = joinDate;
            } else {
                document.getElementById('profile-date').innerText = "Unknown";
            }

            // Update the Avatar initial
            document.getElementById('profile-initials').innerText = displayName.charAt(0).toUpperCase();

        }
        else {
            // If the token is expired or invalid, the backend will return an error.
            // Redirect them to login.
            console.error("Failed to load profile:", data.message);
            window.location.replace('login.html');
        }
    } catch (error) {
        console.error("Network error fetching profile:", error);
        document.getElementById('profile-name').innerText = "Error Loading Data";
        document.getElementById('profile-email').innerText = "Please check your connection";
    }
}

function initializePage() {
    const profileBox = document.querySelector('.profile-box');
    if (profileBox) {
        loadProfileData();
    }
    const authForm = document.querySelector('.auth-form');
    if (authForm) {
        authLogic();
    }
}

// Re-check auth if the browser restores this page from bfcache (e.g. via Back/Forward)
window.addEventListener('pageshow', (event) => {
    if (event.persisted && document.querySelector('.profile-box')) {
        loadProfileData();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});

