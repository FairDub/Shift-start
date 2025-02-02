document.addEventListener('DOMContentLoaded', function() {
    const isMoviePage = document.querySelector('.movie-details');
    const isMainPage = document.getElementById('movie-container');

    if (isMainPage) loadMovies();
    if (isMoviePage) loadMovieDetails();
});

function loadMovies() {
    fetch('movies.json')
        .then(response => response.json())
        .then(movies => {
            const movieContainer = document.getElementById('movie-container');
            if (!movieContainer) return;

            movieContainer.innerHTML = '';
            movies.forEach(movie => {
                if (!validateMovie(movie)) return;
                movieContainer.appendChild(createMovieCard(movie));
            });
        })
        .catch(console.error);
}

function validateMovie(movie) {
    return movie.image && movie.title && movie.rating && movie.link;
}

function createMovieCard(movie) {
    const card = document.createElement('a');
    card.href = `${movie.link}?title=${encodeURIComponent(movie.title)}`;
    card.innerHTML = `
        <div class="movie-card">
            <img src="${movie.image}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.type}</p>
            <div class="ratingS">
                ${movie.ratingStars.map(star => `
                    <span class="star${star ? '' : 'E'}">
                        <img src="img/star.png" alt="Рейтинг">
                    </span>
                `).join('')}
            </div>
            <div class="rating">KinoPoisk - ${movie.rating}</div>
            <button>Подробнее</button>
        </div>
    `;
    return card;
}

function loadMovieDetails() {
    const movieTitle = getMovieTitleFromURL();
    
    fetch('movies.json')
        .then(response => response.json())
        .then(movies => {
            const movie = movies.find(m => m.title === movieTitle);
            if (!movie) return showError('Фильм не найден');

            document.querySelector('.movie-details').innerHTML = `
                <img src="${movie.image}" alt="${movie.title}">
                <div>
                    <h3>${movie.title}</h3>
                    <p>${movie.type}</p>
                    <div class="ratingS">
                        ${movie.ratingStars.map(star => `
                            <span class="star${star ? '' : 'E'}">
                                <img src="img/star.png" alt="Рейтинг">
                            </span>
                        `).join('')}
                    </div>
                    <div class="rating">KinoPoisk - ${movie.rating}</div>
                    <div class="description">
                        <span class="visible-text">${getVisibleText(movie.description)}</span>
                        ${movie.description.length > 100 ? `
                            <span class="hidden-text" style="display:none">${getHiddenText(movie.description)}</span>
                            <span class="toggle-btn">... раскрыть</span>
                        ` : ''}
                    </div>
                </div>
            `;

            setupDescription(movie);
            createSchedule(movie);
        })
        .catch(console.error);
}

function getMovieTitleFromURL() {
    const params = new URLSearchParams(window.location.search);
    return decodeURIComponent(params.get('title'));
}

function setupDescription(movie) {
    const toggleBtn = document.querySelector('.toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const hiddenText = this.previousElementSibling;
            const isHidden = hiddenText.style.display === 'none';
            hiddenText.style.display = isHidden ? 'inline' : 'none';
            this.textContent = isHidden ? " ..скрыть" : "... раскрыть";
        });
    }
}

function createSchedule(movie) {
    const dateContainer = document.getElementById('date-container');
    const timeContainer = document.getElementById('time-container');
    if (!dateContainer || !timeContainer) return;

    dateContainer.innerHTML = movie.data
        .map(date => `<button class="date_btn" onclick="selectDate(this)">${date}</button>`)
        .join('');

    if (movie.data.length > 0) {
        selectDate(dateContainer.querySelector('.date_btn'));
    }
}

function selectDate(selectedButton) {
    const allButtons = document.querySelectorAll('.date_btn');
    allButtons.forEach(button => {
        button.classList.remove('selected');
    });

    selectedButton.classList.add('selected');

    updateSchedule(selectedButton.textContent);
}

function updateSchedule(selectedDate) {
    const movieTitle = getMovieTitleFromURL();
    
    fetch('movies.json')
        .then(response => response.json())
        .then(movies => {
            const movie = movies.find(m => m.title === movieTitle);
            if (!movie) return;

            const timeContainer = document.getElementById('time-container');
            if (!timeContainer) return;

            timeContainer.innerHTML = '';

            const halls = [
                { name: 'Красный зал', schedule: movie.scheduleRed },
                { name: 'Синий зал', schedule: movie.scheduleBlue },
                { name: 'Фиолетовый зал', schedule: movie.schedulePurple }
            ];

            halls.forEach(hall => {
                const hallSchedule = document.createElement('div');
                hallSchedule.className = 'hall-schedule';
                hallSchedule.innerHTML = `
                    <h3>${hall.name}</h3>
                    <div class="times">
                        ${hall.schedule.map(time => `
                            <button class="timeSeans" onclick="selectTime(this)">${time}</button>
                        `).join('')}
                    </div>
                `;
                timeContainer.appendChild(hallSchedule);
            });
        })
        .catch(console.error);
}

function selectTime(selectedButton) {
    const allButtons = document.querySelectorAll('.timeSeans');
    allButtons.forEach(button => {
        button.classList.remove('selected');
    });

    selectedButton.classList.add('selected');
}

function getVisibleText(text) {
    const MAX_VISIBLE = 100;
    const lastSpaceIndex = text.lastIndexOf(' ', MAX_VISIBLE);
    return text.substring(0, lastSpaceIndex);
}

function getHiddenText(text) {
    const MAX_VISIBLE = 100;
    const lastSpaceIndex = text.lastIndexOf(' ', MAX_VISIBLE);
    return text.substring(lastSpaceIndex).trim();
}
