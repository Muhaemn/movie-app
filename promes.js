const API_KEY = "api_key=1cf50e6248dc270629e802686245c2c8";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + "/search/movie?" + API_KEY;

const genres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = "";
var totalPages = 100;
var selectedGenre = [];
setGenre();
function setGenre() {
  tagsEl.innerHTML = "";
  genres.forEach((genre) => {
    const t = document.createElement("div");
    t.classList.add("tag", "sort");
    t.id = genre.id;
    t.innerText = genre.name;
    if (genre.name == "Documentary") {
      t.classList.add("disabled");
    }
    if (genre.name != "Documentary") {
      t.addEventListener("", () => {
        if (selectedGenre.length == 0) {
          selectedGenre.push(genre.id);
        } else {
          if (selectedGenre.includes(genre.id)) {
            selectedGenre = selectedGenre.filter((e) => e != genre.id);
          } else {
            selectedGenre.push(genre.id);
          }
        }
        if (selectedGenre.includes(genre.id)) {
          t.classList.add("highlight");
        } else {
          t.classList.remove("highlight");
        }

        console.log(selectedGenre);
        getMovies(
          API_URL + "&with_genres=" + encodeURI(selectedGenre.join(","))
        );
      });
    }
    tagsEl.append(t);
  });
  let clear = document.createElement("div");
  clear.classList.add("tag", "highlight");
  clear.id = "clear";
  clear.innerText = "Clear";
  clear.addEventListener("click", () => {
    selectedGenre = [];
    document.querySelectorAll(".sort").forEach((e) => {
      e.classList.remove("highlight");
    });
    getMovies(API_URL);
  });
  tagsEl.append(clear);
}
getMovies(API_URL);

function getMovies(url) {
  lastUrl = url;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.results.length !== 0) {
        showMovies(data.results);
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;
        pages(totalPages);
        if (currentPage <= 1) {
          prev.classList.add("disabled");
          next.classList.remove("disabled");
        } else if (currentPage >= totalPages) {
          prev.classList.remove("disabled");
          next.classList.add("disabled");
        } else {
          prev.classList.remove("disabled");
          next.classList.remove("disabled");
        }

        tagsEl.scrollIntoView({ behavior: "smooth" });
      } else {
        main.innerHTML = `<h1 class="no-results">No Results Found</h1>`;
      }
    })
    .catch(() => {
      main.innerHTML = `<h1 class="no-results">Can't Get Data</h1>`;
    });
}

function pages(data) {
  current.innerHTML = "";
  if (data >= 10) {
    for (let i = currentPage; i < currentPage + 10; i++) {
      const p = document.createElement("div");
      p.classList.add("pages");
      p.id = i;
      p.innerText = i;
      p.addEventListener("click", () => {
        pageCall(p.id);
      });
      if (currentPage == i) {
        p.classList.add("selected-page");
      }
      current.append(p);
    }
  } else if (data != 1) {
    for (let i = currentPage; i < data; i++) {
      const p = document.createElement("div");
      p.classList.add("pages");
      p.id = i;
      p.innerText = i;
      p.addEventListener("click", () => {
        pageCall(p.id);
      });
      if (currentPage == i) {
        p.classList.add("selected-page");
      }
      if (i == 22) {
        p.classList.add("disabled");
      }
      current.append(p);
    }
  } else {
    const p = document.createElement("div");
    p.classList.add("pages", "selected-page");
    p.innerHTML = "1";
    current.append(p);
  }
}

function showMovies(data) {
  main.innerHTML = "";

  data.forEach((movie) => {
    const { title, poster_path, vote_average, overview, id } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.id = id + 1;
    movieEl.innerHTML = `
             <img id="${id + 2}" src="${
      poster_path
        ? IMG_URL + poster_path
        : "http://via.placeholder.com/1080x1580"
    }" alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">

                <h3>Overview</h3>
                ${overview}
                <br/> 
                <button class="know-more" id="${id}">Know More</button
            </div>
        
        `;

    main.append(movieEl);
    document.getElementById(id).addEventListener("click", () => {
      console.log(id);
      openNav(movie);
    });
    document.getElementById(id + 1).addEventListener("mouseenter", () => {
      document.getElementById(id + 2).classList.add("img");
    });
    document.getElementById(id + 1).addEventListener("mouseleave", () => {
      document.getElementById(id + 2).classList.remove("img");
    });
  });
}

const overlayContent = document.getElementById("overlay-content");
function openNav(movie) {
  let id = movie.id;
  fetch(BASE_URL + "/movie/" + id + "/videos?" + API_KEY)
    .then((res) => res.json())
    .then((videoData) => {
      console.log(videoData);
      if (videoData) {
        document.getElementById("myNav").style.width = "100%";
        if (videoData.results.length > 0) {
          var embed = [];
          var dots = [];
          videoData.results.forEach((video, idx) => {
            let { name, key, site } = video;

            if (site == "YouTube") {
              embed.push(`
              <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          
          `);

              dots.push(`
              <span class="dot">${idx + 1}</span>
            `);
            }
          });

          var content = `
        <h1 class="no-results">${movie.original_title}</h1>
        <br/>
        
        ${embed.join("")}
        <br/>

        <div class="dots">${dots.join("")}</div>
        
        `;
          overlayContent.innerHTML = content;
          activeSlide = 0;
          showVideos();
        } else {
          overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`;
        }
      }
    });
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

var activeSlide = 0;
var totalVideos = 0;

function showVideos() {
  let embedClasses = document.querySelectorAll(".embed");
  let dots = document.querySelectorAll(".dot");

  totalVideos = embedClasses.length;
  embedClasses.forEach((embedTag, idx) => {
    if (activeSlide == idx) {
      embedTag.classList.add("show");
      embedTag.classList.remove("hide");
    } else {
      embedTag.classList.add("hide");
      embedTag.classList.remove("show");
    }
  });

  dots.forEach((dot, indx) => {
    if (activeSlide == indx) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");

leftArrow.addEventListener("click", () => {
  if (activeSlide > 0) {
    activeSlide--;
  } else {
    activeSlide = totalVideos - 1;
  }

  showVideos();
});

rightArrow.addEventListener("click", () => {
  if (activeSlide < totalVideos - 1) {
    activeSlide++;
  } else {
    activeSlide = 0;
  }
  showVideos();
});

function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value;
  selectedGenre = [];
  setGenre();
  if (searchTerm) {
    getMovies(searchURL + "&query=" + searchTerm);
  } else {
    getMovies(API_URL);
  }
});

prev.addEventListener("click", () => {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
});

next.addEventListener("click", () => {
  if (nextPage <= totalPages) {
    pageCall(nextPage);
  }
});

function pageCall(page) {
  let urlSplit = lastUrl.split("?");
  let queryParams = urlSplit[1].split("&");
  let key = queryParams[queryParams.length - 1].split("=");
  if (key[0] != "page") {
    let url = lastUrl + "&page=" + page;
    getMovies(url);
  } else {
    key[1] = page.toString();
    let a = key.join("=");
    queryParams[queryParams.length - 1] = a;
    let b = queryParams.join("&");
    let url = urlSplit[0] + "?" + b;
    getMovies(url);
  }
}
let mouse = document.querySelector(".cursor");
window.addEventListener("mousemove", (e) => {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
  mouse.style.display = "block";
});
setInterval(() => {
  mouse.style.display = "none";
}, 5000);
