document.addEventListener('DOMContentLoaded', function() {
    const isMoviePage = document.querySelector('.movie-details');
    const isMainPage = document.getElementById('movie-container');

    if (isMainPage) {
        loadMovies();
    }

    if (isMoviePage) {
        loadMovieDetails();
    }
});

// Функция загрузки списка фильмов
function loadMovies() {
    fetch('movies.json')
        .then(response => response.json())
        .then(movies => {
            const movieContainer = document.getElementById('movie-container');
            if (!movieContainer) {
                console.error("Элемент #movie-container не найден.");
                return;
            }
            movieContainer.innerHTML = '';

            movies.forEach(movie => {
                if (!movie.image || !movie.title || !movie.rating || !movie.link) return;

                const movieCard = document.createElement('a');
                movieCard.href = movie.link;
                movieCard.innerHTML = `
                    <div class="movie-card">
                        <img src="${movie.image}" alt="${movie.title}">
                        <h3>${movie.title}</h3>
                        <p>Фильм</p>
                        <div class="ratingS">
                            ${movie.ratingStars ? movie.ratingStars.map(star => `<span class="star${star ? '' : 'E'}"><img src="img/star.png" alt=""></span>`).join('') : ''}
                        </div>
                        <div class="rating">KinoPoisk - ${movie.rating}</div>
                        <button>Подробнее</button>
                    </div>
                `;
                movieContainer.appendChild(movieCard);
            });
        })
        .catch(error => {
            console.error('Ошибка загрузки данных:', error);
        });
}

// Функция загрузки данных о фильме
function loadMovieDetails() {
    fetch('movies.json')
        .then(response => response.json())
        .then(movies => {
            const urlParams = new URLSearchParams(window.location.search);
            const movieTitleFromURL = urlParams.get('title');

            const movie = movies.find(m => m.title === movieTitleFromURL);

            document.querySelector('.movie-details img').src = movie.image;
            document.querySelector('.movie-details h3').innerText = `${movie.title} (16+)`;
            document.querySelector('.rating').innerText = `KinoPoisk - ${movie.rating}`;

            const hiddenText = document.querySelector('.description .hidden_text');
            if (hiddenText) {
                hiddenText.innerText = movie.description;
                hiddenText.style.display = 'none';
            }

            const toggleButton = document.querySelector('.toggle_btn');
            if (toggleButton) {
                toggleButton.textContent = "... раскрыть";
                toggleButton.addEventListener('click', function() {
                    toggleDescription(toggleButton);
                });
            }

            // Загрузка расписания
            const scheduleContainer = document.getElementById('time-container');
            scheduleContainer.innerHTML = '';

            if (Array.isArray(movie.schedule)) {
                movie.schedule.forEach(time => {
                    let button = document.createElement('button');
                    button.classList.add('timeSeans');
                    button.innerText = time;
                    scheduleContainer.appendChild(button);
                });
            } else {
                console.error("Расписание отсутствует или имеет неверный формат.");
            }
        });
}

// Функция для управления текстом описания
function toggleDescription(element) {
    let hiddenText = element.previousElementSibling;
    if (hiddenText.style.display === "none" || hiddenText.style.display === "") {
        hiddenText.style.display = "inline";
        element.textContent = "... скрыть";
    } else {
        hiddenText.style.display = "none";
        element.textContent = "... раскрыть";
    }
}
