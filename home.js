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
function loadLoadCalendar() {
    const calendarGrid = document.querySelector('.calendar-grid')
    if (calendarGrid) {
        const date = new Date();
        const day = date.getDate();
        const month = (date.getMonth() + 1);
        const year = date.getFullYear();
        const calendarChooseMonth = document.getElementById('monthSelect')
        calendarChooseMonth.value = month;
        const calendarChooseYear = document.getElementById('yearSelect')
        calendarChooseYear.value = year;
        function getDaysInMonth(month, year) {
            return (new Date(year, month, 0)).getDate();
        }
        function loadCalendar() {
            const existingDays = calendarGrid.querySelectorAll('.cal-day')
            existingDays.forEach(day => day.remove());
            const selectedMonth = calendarChooseMonth.value
            const selectedYear = calendarChooseYear.value
            const numberOfEmptyBoxes = (new Date(selectedYear, selectedMonth - 1, 1)).getDay();
            for (let i = 0; i < numberOfEmptyBoxes; i++) {
                let addedContent = `<div class="cal-day">
        <div class="cal-date-number">
        </div>
    </div>`
                calendarGrid.innerHTML += addedContent
            }
            const numberOfDays = getDaysInMonth(selectedMonth, selectedYear)
            for (let i = 1; i <= numberOfDays; i++) {
                const dayOfTheWeek = (new Date(selectedYear,selectedMonth-1, i)).getDay();
                if(dayOfTheWeek===2){
                    let addedContent = `<div class="cal-day">
        <div class="cal-date-number">
            ${i}
        </div>
        Hanuman Chalisa <br>
        Location - Proposed Innovation Garage <br>
        Time - 7pm
    </div>`
    calendarGrid.innerHTML += addedContent
                }
                else if(dayOfTheWeek===6){
                    let addedContent = `<div class="cal-day">
        <div class="cal-date-number">
            ${i}
        </div>
        Hanuman Chalisa <br>
        Location - Kazipet Station <br>
        Time - 7pm
    </div>`
    calendarGrid.innerHTML += addedContent
                }
                else{
                let addedContent = `<div class="cal-day">
        <div class="cal-date-number">
            ${i}
        </div>
    </div>`
    calendarGrid.innerHTML += addedContent
                }
            }
        }
        calendarChooseMonth.addEventListener('change', loadCalendar);
        calendarChooseYear.addEventListener('change', loadCalendar);
        loadCalendar();
    }
}
loadLoadCalendar();
