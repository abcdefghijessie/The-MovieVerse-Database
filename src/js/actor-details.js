const search = document.getElementById("search");
const searchButton = document.getElementById("button-search");
const form = document.getElementById("form1");
const SEARCHPATH = "https://api.themoviedb.org/3/search/movie?&api_key=c5a20c861acf7bb8d9e987dcc7f1b558&query=";
const main = document.getElementById("main");
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const searchTitle = document.getElementById("search-title");

function getClassByRate(vote){
    if (vote >= 8) {
        return 'green';
    }
    else if (vote >= 5) {
        return 'orange';
    }
    else {
        return 'red';
    }
}

document.getElementById('googleSignInBtn').addEventListener('click', function () {
    alert('Please ensure that you have pop-ups enabled for this site to sign you in/out properly. Otherwise, you may not be signed in/out properly. (If you have already disabled pop-up blockers, you may ignore this message.)');
});

document.getElementById('clear-search-btn').addEventListener('click', () => {
    location.reload();
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value.trim();

    if (searchTerm) {
        getMovies(SEARCHPATH + searchTerm);
        searchTitle.innerHTML = 'Search Results for: ' + searchTerm;
        otherTitle.innerHTML = 'Check out other movies:';
        search.value = '';
    }
    else {
        searchTitle.innerHTML = 'Please enter a search term.';
    }
    document.getElementById('clear-search-btn').style.display = 'block';
});

searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    if (searchTerm) {
        getMovies(SEARCHPATH + searchTerm);
        searchTitle.innerHTML = 'Search Results for: ' + searchTerm;
        otherTitle.innerHTML = 'Check out other movies:';
        search.value = '';
    }
    else {
        searchTitle.innerHTML = 'Please enter a search term.';
    }
    document.getElementById('clear-search-btn').style.display = 'block';
});

function calculateMoviesToDisplay() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 689.9) return 10;
    if (screenWidth <= 1021.24) return 20;
    if (screenWidth <= 1353.74) return 21;
    if (screenWidth <= 1684.9) return 20;
    if (screenWidth <= 2017.49) return 20;
    if (screenWidth <= 2349.99) return 18;
    if (screenWidth <= 2681.99) return 21;
    if (screenWidth <= 3014.49) return 24;
    if (screenWidth <= 3345.99) return 27;
    if (screenWidth <= 3677.99) return 20;
    if (screenWidth <= 4009.99) return 22;
    if (screenWidth <= 4340.99) return 24;
    if (screenWidth <= 4673.49) return 26;
    if (screenWidth <= 5005.99) return 28;
    if (screenWidth <= 5337.99) return 30;
    if (screenWidth <= 5669.99) return 32;
    if (screenWidth <= 6001.99) return 34;
    if (screenWidth <= 6333.99) return 36;
    if (screenWidth <= 6665.99) return 38;
    if (screenWidth <= 6997.99) return 40;
    if (screenWidth <= 7329.99) return 42;
    if (screenWidth <= 7661.99) return 44;
    if (screenWidth <= 7993.99) return 46;
    if (screenWidth <= 8325.99) return 48;
    return 20;
}

async function getMovies(url) {
    clearMovieDetails();
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 2;
    let allMovies = [];

    for (let page = 1; page <= pagesToFetch; page++) {
        const response = await fetch(`${url}&page=${page}`);
        const data = await response.json();
        allMovies = allMovies.concat(data.results);
    }

    const popularityThreshold = 0.5;

    allMovies.sort((a, b) => {
        const popularityDifference = Math.abs(a.popularity - b.popularity);
        if (popularityDifference < popularityThreshold) {
            return b.vote_average - a.vote_average;
        }
        return b.popularity - a.popularity;
    });

    if (allMovies.length > 0) {
        showMovies(allMovies.slice(0, numberOfMovies));
        document.getElementById('clear-search-btn').style.display = 'block'; // Show the button
    }
    else {
        main.innerHTML = `<p>No movie with the specified search term found. Please try again.</p>`;
        document.getElementById('clear-search-btn').style.display = 'none'; // Hide the button if no results
    }
}

function showMovies(movies){
    main.innerHTML = '';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        const voteAverage = vote_average.toFixed(1);
        movieE1.classList.add('movie');
        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;
        movieE1.innerHTML = `
            ${movieImage} 
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAverage}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Overview: </h4>
                ${overview}
            </div>`;
        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
            updateMovieVisitCount(id, title);
        });
        main.appendChild(movieE1);
    });
    applySettings();
}

function clearMovieDetails() {
    const movieDetailsContainer = document.getElementById('actor-details-container');
    if (movieDetailsContainer) {
        movieDetailsContainer.innerHTML = '';
    }
}

let initialMainContent = '';

document.addEventListener('DOMContentLoaded', () => {
    initialMainContent = document.getElementById('main').innerHTML;

    const actorId = localStorage.getItem('selectedActorId');
    if (actorId) {
        fetchActorDetails(actorId);
    }
    else {
        document.getElementById('actor-details-container').innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; text-align: center; width: 100vw;">
                <h2>Actor details not found.</h2>
            </div>`;
    }

    document.getElementById('clear-search-btn').style.display = 'none';
});

async function fetchActorDetails(actorId) {
    const actorUrl = `https://api.themoviedb.org/3/person/${actorId}?api_key=c5a20c861acf7bb8d9e987dcc7f1b558`;
    const creditsUrl = `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=c5a20c861acf7bb8d9e987dcc7f1b558`;
    try {
        const [actorResponse, creditsResponse] = await Promise.all([
            fetch(actorUrl),
            fetch(creditsUrl)
        ]);

        const actor = await actorResponse.json();
        const credits = await creditsResponse.json();
        if (actor.success === false) {
            document.getElementById('actor-details-container').innerHTML = '<h2>No Information is Available for this Actor</h2>';
        }
        else {
            populateActorDetails(actor, credits);
        }
    }
    catch (error) {
        console.error('Error fetching actor details:', error);
        document.getElementById('actor-details-container').innerHTML = '<h2>Error fetching actor details</h2>';
    }
}

function populateActorDetails(actor, credits) {
    const actorImage = document.getElementById('actor-image');
    const actorName = document.getElementById('actor-name');
    const actorDescription = document.getElementById('actor-description');
    if (actor.profile_path) {
        actorImage.src = `https://image.tmdb.org/t/p/w1280${actor.profile_path}`;
        actorName.textContent = actor.name;
        document.title = `${actor.name} - Actor's Details`;
    }
    else {
        actorImage.style.display = 'none';
        actorName.textContent = actor.name;
        const noImageText = document.createElement('h2');
        noImageText.textContent = 'Image Not Available';
        noImageText.style.textAlign = 'center';
        document.querySelector('.actor-left').appendChild(noImageText);
    }
    document.getElementById('actor-image').src = `https://image.tmdb.org/t/p/w1280${actor.profile_path}`;
    document.getElementById('actor-name').textContent = actor.name;
    actorDescription.innerHTML = `
        <p><strong>Biography:</strong> ${actor.biography || 'N/A'}</p>
        <p><strong>Date of Birth:</strong> ${actor.birthday || 'N/A'}</p>
        <p><strong>Age:</strong> ${actor.birthday ? calculateAge(actor.birthday) : 'N/A'}</p>
        <p><strong>Place of Birth:</strong> ${actor.place_of_birth || 'N/A'}</p>
        <p><strong>Known For:</strong> ${actor.known_for_department || 'N/A'}</p>
        <p><strong>Height:</strong> ${actor.height || 'N/A'}</p>
    `;
    const filmographyHeading = document.createElement('p');
    filmographyHeading.innerHTML = '<strong>Filmography:</strong> ';
    document.getElementById('actor-description').appendChild(filmographyHeading);
    const movieList = document.createElement('div');
    movieList.classList.add('movie-list');
    credits.cast.forEach(movie => {
        const movieLink = document.createElement('span');
        movieLink.textContent = movie.title;
        movieLink.classList.add('movie-link');
        movieLink.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', movie.id);
            window.location.href = 'movie-details.html';
        });
        movieList.appendChild(movieLink);
        movieList.appendChild(document.createTextNode(', '));
    });
    filmographyHeading.appendChild(movieList);
    const gender = document.createElement('div');
    gender.innerHTML = `
        <p><strong>Gender:</strong> ${actor.gender === 1 ? 'Female' : actor.gender === 2 ? 'Male' : 'N/A'}</p>
    `;
    document.getElementById('actor-description').appendChild(gender);
    const popularity = document.createElement('div');
    popularity.innerHTML = `
        <p><strong>Popularity Score:</strong> ${actor.popularity.toFixed(2)}</p>
    `;
    document.getElementById('actor-description').appendChild(popularity);
    applySettings();
}

function rotateUserStats() {
    const stats = [
        {
            label: "Your Current Time",
            getValue: () => {
                const now = new Date();
                let hours = now.getHours();
                let minutes = now.getMinutes();
                hours = hours < 10 ? '0' + hours : hours;
                minutes = minutes < 10 ? '0' + minutes : minutes;
                return `${hours}:${minutes}`;
            }
        },
        { label: "Most Visited Movie", getValue: getMostVisitedMovie },
        { label: "Your Most Visited Director", getValue: getMostVisitedDirector },
        { label: "Your Most Visited Actor", getValue: getMostVisitedActor },
        {
            label: "Your Unique Movies Discovered",
            getValue: () => {
                const viewedMovies = JSON.parse(localStorage.getItem('uniqueMoviesViewed')) || [];
                return viewedMovies.length;
            }
        },
        {
            label: "Your Favorited Movies",
            getValue: () => {
                const favoritedMovies = JSON.parse(localStorage.getItem('favorites')) || [];
                return favoritedMovies.length;
            }
        },
        {
            label: "Your Most Common Favorited Genre",
            getValue: getMostCommonGenre
        },
        { label: "Your Created Watchlists", getValue: () => localStorage.getItem('watchlistsCreated') || 0 },
        { label: "Your Average Movie Rating", getValue: () => localStorage.getItem('averageMovieRating') || 'Not Rated' },
        {
            label: "Your Unique Directors Discovered",
            getValue: () => {
                const viewedDirectors = JSON.parse(localStorage.getItem('uniqueDirectorsViewed')) || [];
                return viewedDirectors.length;
            }
        },
        {
            label: "Your Unique Actors Discovered",
            getValue: () => {
                const viewedActors = JSON.parse(localStorage.getItem('uniqueActorsViewed')) || [];
                return viewedActors.length;
            }
        },
        {
            label: "Your Unique Production Companies Discovered",
            getValue: () => {
                const viewedCompanies = JSON.parse(localStorage.getItem('uniqueCompaniesViewed')) || [];
                return viewedCompanies.length;
            }
        },
        { label: "Your Trivia Accuracy", getValue: getTriviaAccuracy }
    ];

    let currentStatIndex = 0;

    function updateStatDisplay() {
        const currentStat = stats[currentStatIndex];
        document.getElementById('stats-label').textContent = currentStat.label + ':';
        document.getElementById('stats-display').textContent = currentStat.getValue();
        currentStatIndex = (currentStatIndex + 1) % stats.length;
    }

    updateStatDisplay();

    const localTimeDiv = document.getElementById('local-time');
    let statRotationInterval = setInterval(updateStatDisplay, 3000);

    localTimeDiv.addEventListener('click', () => {
        clearInterval(statRotationInterval);
        updateStatDisplay();
        statRotationInterval = setInterval(updateStatDisplay, 3000);
    });
}

function updateMovieVisitCount(movieId, movieTitle) {
    let movieVisits = JSON.parse(localStorage.getItem('movieVisits')) || {};
    if (!movieVisits[movieId]) {
        movieVisits[movieId] = { count: 0, title: movieTitle };
    }
    movieVisits[movieId].count += 1;
    localStorage.setItem('movieVisits', JSON.stringify(movieVisits));
}

function getMostVisitedMovie() {
    const movieVisits = JSON.parse(localStorage.getItem('movieVisits')) || {};
    let mostVisitedMovie = '';
    let maxVisits = 0;

    for (const movieId in movieVisits) {
        if (movieVisits[movieId].count > maxVisits) {
            mostVisitedMovie = movieVisits[movieId].title;
            maxVisits = movieVisits[movieId].count;
        }
    }

    return mostVisitedMovie || 'Not Available';
}

function getMostVisitedActor() {
    const actorVisits = JSON.parse(localStorage.getItem('actorVisits')) || {};
    let mostVisitedActor = '';
    let maxVisits = 0;

    for (const actorId in actorVisits) {
        if (actorVisits[actorId].count > maxVisits) {
            mostVisitedActor = actorVisits[actorId].name;
            maxVisits = actorVisits[actorId].count;
        }
    }

    return mostVisitedActor || 'Not Available';
}

function getMostVisitedDirector() {
    const directorVisits = JSON.parse(localStorage.getItem('directorVisits')) || {};
    let mostVisitedDirector = '';
    let maxVisits = 0;

    for (const directorId in directorVisits) {
        if (directorVisits[directorId].count > maxVisits) {
            mostVisitedDirector = directorVisits[directorId].name;
            maxVisits = directorVisits[directorId].count;
        }
    }

    return mostVisitedDirector || 'Not Available';
}

function getTriviaAccuracy() {
    let triviaStats = JSON.parse(localStorage.getItem('triviaStats')) || { totalCorrect: 0, totalAttempted: 0 };
    if (triviaStats.totalAttempted === 0) {
        return 'No trivia attempted';
    }
    let accuracy = (triviaStats.totalCorrect / triviaStats.totalAttempted) * 100;
    return `${accuracy.toFixed(1)}% accuracy`;
}

function getMostCommonGenre() {
    const favoriteGenres = JSON.parse(localStorage.getItem('favoriteGenres')) || {};
    let mostCommonGenre = '';
    let maxCount = 0;

    for (const genre in favoriteGenres) {
        if (favoriteGenres[genre] > maxCount) {
            mostCommonGenre = genre;
            maxCount = favoriteGenres[genre];
        }
    }

    return mostCommonGenre || 'Not Available';
}

document.addEventListener('DOMContentLoaded', rotateUserStats);

let isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;
updateSignInButton();

function handleSignInOut() {
    window.location.reload();
    const signInOutButton = document.getElementById('googleSignInBtn');
    const signInOutText = signInOutButton.querySelector('span');
    const signInOutIcon = signInOutButton.querySelector('i');

    if (!isSignedIn) {
        signInOutText.textContent = 'Sign Out';
        signInOutIcon.className = 'fas fa-sign-out-alt';
        isSignedIn = true;
        localStorage.setItem('isSignedIn', isSignedIn);
        gapi.auth2.getAuthInstance().signIn();
    }
    else {
        signInOutText.textContent = 'Sign In';
        signInOutIcon.className = 'fas fa-sign-in-alt';
        isSignedIn = false;
        localStorage.setItem('isSignedIn', isSignedIn);
        gapi.auth2.getAuthInstance().signOut();
    }
}

function updateSignInButton() {
    const signInOutButton = document.getElementById('googleSignInBtn');
    const signInOutText = signInOutButton.querySelector('span');
    const signInOutIcon = signInOutButton.querySelector('i');
    if (isSignedIn) {
        signInOutText.textContent = 'Sign Out';
        signInOutIcon.className = 'fas fa-sign-out-alt';
    }
    else {
        signInOutText.textContent = 'Sign In';
        signInOutIcon.className = 'fas fa-sign-in-alt';
    }
}

function initClient() {
    gapi.load('auth2', function() {
        gapi.auth2.init({
            client_id: '154461832638-fpkleb6uhogkacq9k93721o8mjr2qc8t.apps.googleusercontent.com'
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    updateSignInButton();
    initClient();
    applySettings();
});

async function showMovieOfTheDay() {
    const year = new Date().getFullYear();
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&sort_by=vote_average.desc&vote_count.gte=100&primary_release_year=${year}&vote_average.gte=7`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const movies = data.results;

        if (movies.length > 0) {
            const randomMovie = movies[Math.floor(Math.random() * movies.length)];
            localStorage.setItem('selectedMovieId', randomMovie.id);
            window.location.href = 'movie-details.html';
        }
        else {
            fallbackMovieSelection();
        }
    }
    catch (error) {
        console.error('Error fetching movie:', error);
        fallbackMovieSelection();
    }
}

function fallbackMovieSelection() {
    const fallbackMovies = [432413, 299534, 1726, 562, 118340, 455207, 493922, 447332, 22970, 530385, 27205, 264660, 120467, 603, 577922, 76341, 539, 419704, 515001, 118340, 424, 98];
    const randomFallbackMovie = fallbackMovies[Math.floor(Math.random() * fallbackMovies.length)];
    localStorage.setItem('selectedMovieId', randomFallbackMovie);
    window.location.href = 'movie-details.html';
}

function calculateAge(birthday) {
    const birthDate = new Date(birthday);
    const currentDate = new Date();
    return currentDate.getFullYear() - birthDate.getFullYear();
}

function applySettings() {
    const savedBg = localStorage.getItem('backgroundImage');
    const savedTextColor = localStorage.getItem('textColor');
    const savedFontSize = localStorage.getItem('fontSize');

    if (savedBg) {
        document.body.style.backgroundImage = `url('${savedBg}')`;
    }
    if (savedTextColor) {
        applyTextColor(savedTextColor);
    }
    if (savedFontSize) {
        const size = savedFontSize === 'small' ? '12px' : savedFontSize === 'medium' ? '16px' : '20px';
        document.body.style.fontSize = size;
    }
}

function applyTextColor(color) {
    document.querySelectorAll('h1, h2, h3, p, a, span, div, button, input, select, textarea, label, li')
        .forEach(element => {
            element.style.color = color;
        });
}
