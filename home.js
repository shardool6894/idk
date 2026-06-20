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

links.forEach(link => {
    link.addEventListener('click', async function (event) {
        try {
            event.preventDefault();
            const targetUrl = this.getAttribute('href');

            const response = await fetch(targetUrl);
            const newHtmlContent = await response.text();
            const parser = new DOMParser();
            const tempDoc = parser.parseFromString(newHtmlContent, 'text/html');
            const contentToBeReplaced = tempDoc.getElementById('content-area').innerHTML
            contentArea.innerHTML = contentToBeReplaced;

            window.history.pushState(null, '', targetUrl);
            loadLoadCalendar()
            // Listen for the user clicking the Back or Forward buttons
            window.addEventListener('popstate', async function () {
                const targetUrl = window.location.pathname;
                const response = await fetch(targetUrl);
                const oldHtmlContent = await response.text();
                const parser = new DOMParser();
                const tempDoc = parser.parseFromString(oldHtmlContent, 'text/html');
                const contentToBeReplaced = tempDoc.getElementById('content-area').innerHTML
                document.getElementById('content-area').innerHTML = contentToBeReplaced;
                loadLoadCalendar;
            });
        }
        catch (err) {
            console.log(`error : ${err}`)
        }
    });
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

        for (let year = 1900; year <= 2100; year++) {
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

        calendarChooseMonth.addEventListener('change', loadCalendar);
        calendarChooseYear.addEventListener('change', loadCalendar);
        loadCalendar();
    }
}
loadLoadCalendar();