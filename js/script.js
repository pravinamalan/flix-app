import { Showalert } from "./modules/alert.js";
import { showLoader, hideLoader } from "./modules/spinner.js";
const global = {
  currentPage: window.location.pathname,
  search: {
    type: "",
    term: "",
    page: 1,
    totalPages: 1,
  },
  api: {
    apiKey: "b0d6ca124467a39807bad8f1dd5d61e3",
    apiUrl: "https://api.themoviedb.org/3/",
  },
};

// highlight active link
function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

// display 20 popular movies
async function displayPopularMovies() {
  const { results } = await fetchApiData("movie/popular");
  const popularMoviesContainer = document.querySelector("#popular-movies");
  popularMoviesContainer.innerHTML = "";
  // console.log(results);
  results.forEach((movie) => {
    const createDivElement = document.createElement("div");
    createDivElement.classList.add("card");
    createDivElement.innerHTML = `<a href="movie-details.html?id=${movie.id}">
        ${
          movie.poster_path
            ? `  <img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="Movie Title"
          />`
            : `<img
          src="../images/no-image.jpg"
          class="card-img-top"
          alt="${movie.title}"
        />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${movie.release_date}</small>
        </p>
      </div>`;

    document.querySelector("#popular-movies").appendChild(createDivElement);
  });
}
// diplay movie details in single page
async function displayMovieDetails() {
  const movieId = window.location.href.split("=")[1];
  const movie = await fetchApiData(`movie/${movieId}`);
  // Overlay for background image
  displayBackgroundImage("movie", movie.backdrop_path);
  const createDivElement = document.createElement("div");
  // createDivElement.classList.add('details-top');
  createDivElement.innerHTML = `
    <div class="details-top d-flex flex-column flex-lg-row">
    <div>
    ${
      movie.poster_path
        ? `<img
      src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
      class="card-img-top"
      alt="${movie.title}"
    />`
        : `<img
    src="../images/no-image.jpg"
    class="card-img-top"
    alt="${movie.title}"
  />`
    }
    </div>
    <div>
      <h2>${movie.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${movie.release_date}</p>
      <p>
        ${movie.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
      </ul>
      <a href="${
        movie.homepage
      }" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
        movie.budget
      )}</li>
      <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
        movie.revenue
      )}</li>
      <li><span class="text-secondary">Runtime:</span> ${
        movie.runtime
      } minutes</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="">
      ${movie.production_companies
        .map((company) => `<span>${company.name}</span>`)
        .join(", ")}
    </div>
  </div>
    `;

  document.querySelector("#movie-details").appendChild(createDivElement);
  console.log(movie);
}

// display popular tv shows
async function displayPopularTvShows() {
  const { results } = await fetchApiData("tv/popular");
  if (global.currentPage === "/" || global.currentPage === "/index.html") {
    const popularTvShowsContainer = document.querySelector("#popular-tv-shows");
    popularTvShowsContainer.innerHTML = "";
  }
  results.forEach((tv) => {
    const createDivElement = document.createElement("div");
    createDivElement.classList.add("card");
    createDivElement.innerHTML = `<a href="tv-details.html?id=${tv.id}">
    ${
      tv.poster_path
        ? `  <img
        src="https://image.tmdb.org/t/p/w500${tv.poster_path}"
        class="card-img-top"
        alt="Movie Title"
      />`
        : `<img
      src="../images/no-image.jpg"
      class="card-img-top"
      alt="${tv.name}"
    />`
    }
  </a>
  <div class="card-body">
    <h5 class="card-title">${tv.name}</h5>
    <p class="card-text">
      <small class="text-muted">Release: ${tv.first_air_date}</small>
    </p>
  </div>`;
    if (global.currentPage === "/" || global.currentPage === "/index.html") {
      document.querySelector("#popular-tv-shows").appendChild(createDivElement);
    } else if (global.currentPage === "/shows.html") {
      document.querySelector("#popular-shows").appendChild(createDivElement);
    }
  });
}

// display tv shows in a single page
async function displayTvShowDetails() {
  const showId = window.location.href.split("=")[1];
  const show = await fetchApiData(`tv/${showId}`);
  // Overlay for background image
  displayBackgroundImage("tv", show.backdrop_path);
  const createDivElement = document.createElement("div");
  // createDivElement.classList.add('details-top');
  createDivElement.innerHTML = `
    <div class="details-top  d-flex flex-column flex-lg-row">
    <div>
    ${
      show.poster_path
        ? `<img
      src="https://image.tmdb.org/t/p/w500${show.poster_path}"
      class="card-img-top"
      alt="${show.name}"
    />`
        : `<img
    src="../images/no-image.jpg"
    class="card-img-top"
    alt="${show.name}"
  />`
    }
    </div>
    <div>
      <h2>${show.name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${show.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
      <p>
        ${show.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
      </ul>
      <a href="${
        show.homepage
      }" target="_blank" class="btn">Visit show Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Show Info</h2>
    <ul>
      <li><span class="text-secondary">Number of Episodes:</span> ${
        show.number_of_episodes
      }</li>
      <li><span class="text-secondary">Last Episode To Air:</span> ${
        show.last_episode_to_air.name
      }</li>
      <li><span class="text-secondary">Status:</span> ${show.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="">
      ${show.production_companies
        .map((company) => `<span>${company.name}</span>`)
        .join(", ")}
    </div>
  </div>
    `;

  document.querySelector("#show-details").appendChild(createDivElement);
}

// trending movies
async function displayTrendingMovies() {
  const { results } = await fetchApiData("trending/movie/day");
  results.forEach((trendingMovie) => {
    const createDivElement = document.createElement("div");
    createDivElement.classList.add("card");
    createDivElement.innerHTML = `<a href="movie-details.html?id=${
      trendingMovie.id
    }">
        ${
          trendingMovie.poster_path
            ? `  <img
            src="https://image.tmdb.org/t/p/w500${trendingMovie.poster_path}"
            class="card-img-top"
            alt="${trendingMovie.title}"
          />`
            : `<img
          src="../images/no-image.jpg"
          class="card-img-top"
          alt="${trendingMovie.title}"
        />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${trendingMovie.title}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${
            trendingMovie.release_date
          }</small>
        </p>
      </div>`;

    document.querySelector("#tending-movies").appendChild(createDivElement);
  });
}

// trending tv shows
async function displayTrendingTvShows() {
  const { results } = await fetchApiData("trending/tv/day");
  results.forEach((trendingTvShows) => {
    const createDivElement = document.createElement("div");
    createDivElement.classList.add("card");
    createDivElement.innerHTML = `<a href="tv-details.html?id=${
      trendingTvShows.id
    }">
        ${
          trendingTvShows.poster_path
            ? `  <img
            src="https://image.tmdb.org/t/p/w500${trendingTvShows.poster_path}"
            class="card-img-top"
            alt="${trendingTvShows.name}"
          />`
            : `<img
          src="../images/no-image.jpg"
          class="card-img-top"
          alt="${trendingTvShows.name}"
        />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${trendingTvShows.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${
            trendingTvShows.first_air_date
          }</small>
        </p>
      </div>`;

    document.querySelector("#trending-tv-shows").appendChild(createDivElement);
  });
}

// display swiper movies

async function displaySwiperMovies() {
  const { results } = await fetchApiData("movie/top_rated");
  const movieSwiperContainer = document.querySelector(
    "#movie-swiper-container"
  );
  movieSwiperContainer.innerHTML = "";
  results.forEach((swiperMovie) => {
    const createDivElement = document.createElement("div");
    createDivElement.classList.add("swiper-slide");
    createDivElement.classList.add("movie-swiper");
    createDivElement.innerHTML = `<a href="movie-details.html?id=${
      swiperMovie.id
    }">
        ${
          swiperMovie.poster_path
            ? `<img
            src="https://image.tmdb.org/t/p/w500${swiperMovie.poster_path}"
            alt="${swiperMovie.title}"
          />`
            : `<img
          src="../images/no-image.jpg"
          alt="${swiperMovie.title}"
        />`
        }
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i>${swiperMovie.vote_average.toFixed(
          1
        )} / 10
      </h4>`;

    document
      .querySelector("#movie-swiper-container")
      .appendChild(createDivElement);
    initSwiper();
  });
}
async function displaySwiperTvShows() {
  const { results } = await fetchApiData("tv/top_rated");
  const tvSwiperContainer = document.querySelector("#tv-swiper-container");
  tvSwiperContainer.innerHTML = "";
  results.forEach((swiperTv) => {
    const createDivElement = document.createElement("div");
    createDivElement.classList.add("swiper-slide");
    createDivElement.classList.add("tv-swiper");
    createDivElement.innerHTML = `<a href="movie-details.html?id=${
      swiperTv.id
    }">
        ${
          swiperTv.poster_path
            ? `<img
            src="https://image.tmdb.org/t/p/w500${swiperTv.poster_path}"
            alt="${swiperTv.original_name}"
          />`
            : `<img
          src="../images/no-image.jpg"
          alt="${swiperTv.original_name}"
        />`
        }
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i>${swiperTv.vote_average.toFixed(
          1
        )} / 10
      </h4>`;

    document
      .querySelector("#tv-swiper-container")
      .appendChild(createDivElement);
    initSwiper();
  });
}

const initSwiper = () => {
  const swiper = new Swiper(".swiper", {
    sliderPerView: 1,
    speed: 400,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: true,
    },
    breakpoints: {
      // when window width is >= 480px
      480: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
      992: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
    },
  });
};

// search function
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  if (global.search.term !== "" && global.search.term !== null) {
    const { results, page, total_pages, total_results } = await searchApiData();
    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;
    if (results.lenth === 0) {
      Showalert("No results found");
      return;
    }
    displaySearchResults(results);
    document.querySelector("#search-term").value = "";
  } else {
    Showalert("Please enter a search term");
  }
}

// search results
function displaySearchResults(results) {
  // Clear previous results
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
            <a href="${global.search.type}-details.html?id=${result.id}">
              ${
                result.poster_path
                  ? `<img
                src="https://image.tmdb.org/t/p/w500${result.poster_path}"
                class="card-img-top"
                alt="${
                  global.search.type === "movie" ? result.title : result.name
                }"
              />`
                  : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
               alt="${
                 global.search.type === "movie" ? result.title : result.name
               }"
            />`
              }
            </a>
            <div class="card-body">
              <h5 class="card-title">${
                global.search.type === "movie" ? result.title : result.name
              }</h5>
              <p class="card-text">
                <small class="text-muted">Release: ${
                  global.search.type === "movie"
                    ? result.release_date
                    : result.first_air_date
                }</small>
              </p>
            </div>
          `;

    document.querySelector("#search-results-heading").innerHTML = `
                <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
      `;

    document.querySelector("#search-results").appendChild(div);
  });

  displayPagination();
}
// Create & Display Pagination For Search
function displayPagination() {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;

  document.querySelector("#pagination").appendChild(div);

  // Disable prev button if on first page
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }

  // Disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }

  // Next page
  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;
    const { results, total_pages } = await searchApiData();
    displaySearchResults(results);
  });

  // Prev page
  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;
    const { results, total_pages } = await searchApiData();
    displaySearchResults(results);
  });
}
// fetch data from tmdb api
async function fetchApiData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;
  showLoader();

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`)
        .then((response) => response.json())
        .then((data) => {
          hideLoader();
          resolve(data);
        })
        .catch((error) => {
          hideLoader();
          reject(error);
        });
    }, 1500);
  });
}

// search request
async function searchApiData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;
  showLoader();

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch(
        `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
      )
        .then((response) => response.json())
        .then((data) => {
          hideLoader();
          resolve(data);
        })
        .catch((error) => {
          hideLoader();
          reject(error);
        });
    }, 1500);
  });
}

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// Display Backdrop On Details Pages
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.classList.add("overlay-style");
  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}
// toggle movies and shows
function toggleMoviesAndShows(event) {
  if (event.target.getAttribute("value") === "movie") {
    const movieWrapper = document.querySelector(".movies-wrapper")?document.querySelector(".movies-wrapper"):"";
    const tvShowsWrapper = document.querySelector(".tv-shows-wrapper")?document.querySelector(".tv-shows-wrapper"):"";

    const movieSwiperWrapper = document.querySelector(".movie-swiper-wrapper");
    const tvShowsSwiperWrapper = document.querySelector(
      ".tv-shows-swiper-wrapper"
    );

    movieWrapper.classList.toggle("remove");
    movieSwiperWrapper.classList.toggle("remove");

    if (!movieWrapper.classList.contains("remove")) {
      tvShowsWrapper.classList.add("remove");
    }
    if (!movieSwiperWrapper.classList.contains("remove")) {
      tvShowsSwiperWrapper.classList.add("remove");
    }
    displayPopularMovies();
    displaySwiperMovies();
  } else if (event.target.getAttribute("value") === "tv") {
    const tvShowsWrapper = document.querySelector(".tv-shows-wrapper");
    const movieWrapper = document.querySelector(".movies-wrapper");

    const movieSwiperWrapper = document.querySelector(".movie-swiper-wrapper");
    const tvShowsSwiperWrapper = document.querySelector(
      ".tv-shows-swiper-wrapper"
    );

    tvShowsWrapper.classList.toggle("remove");
    tvShowsSwiperWrapper.classList.toggle("remove");

    if (!tvShowsWrapper.classList.contains("remove")) {
      movieWrapper.classList.add("remove");
    }
    if (!tvShowsSwiperWrapper.classList.contains("remove")) {
      movieSwiperWrapper.classList.add("remove");
    }

    displayPopularTvShows();
    displaySwiperTvShows();
  }
}

if(!window.location.pathname){

    document.querySelectorAll("input[name='type']").forEach((input) => {
      input.addEventListener("change", toggleMoviesAndShows);
    });
}


// Init
const init = () => {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displayPopularMovies();
      displaySwiperMovies();
      break;
    case "/trending.html":
      displayTrendingMovies();
      displayTrendingTvShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      displayTvShowDetails();
      break;
    case "/search.html":
      search();
      break;
    default:
      break;
  }
  highlightActiveLink();
};

document.addEventListener("DOMContentLoaded", init);
