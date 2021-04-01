const loader = document.querySelector('.loader');
const resultsNav = document.getElementById('resultsNav');
const favouritesNav = document.getElementById('favouritesNav');
const imagesContianer = document.querySelector('.images-container');
const saveConfirmation = document.querySelector('.save-confirmation');


// NASA API
const count = 10;
const apiKey = 'CMQBPjuo0bMlHPvpWwT6nt45LDpFVTGmvJYns9JK';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favourites = {};

// Show Content
function showContent() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    loader.classList.add('hidden');
}

// Create DOM Nodes
function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favourites);
    if (page === 'favourites') {
        resultsNav.classList.add('hidden');
        favouritesNav.classList.remove('hidden');
    }
    else {
        resultsNav.classList.remove('hidden');
        favouritesNav.classList.add('hidden');
    }
    currentArray.forEach((result) => {
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        // Link
        const link = document.createElement('a');
        link.setAttribute('href', result.hdurl);
        link.setAttribute('title', 'View Full Image');
        link.setAttribute('target', '_blank');
        // Image
        const image = document.createElement('img');
        image.setAttribute('src', result.url);
        image.setAttribute('alt', result.title);
        image.classList.add('card-img-top');
        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title
        const cardTitle = document.createElement('h2');
        cardTitle.textContent = result.title;
        // Add Favourite Button
        const favouriteButton = document.createElement('p');
        favouriteButton.classList.add('clickable');
        const icon = document.createElement('i');
        icon.classList.add('far', 'fa-bookmark');
        favouriteButton.append(icon);
        if (page === 'results') {
            favouriteButton.innerHTML += 'Add to Favourites';
            favouriteButton.setAttribute('onclick', `addToFavourites('${result.url}')`);
        }
        else {
            favouriteButton.innerHTML += 'Remove From Favourites';
            favouriteButton.setAttribute('onclick', `removeFromFavourites('${result.url}')`);
        }
        // Card Text
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = result.explanation;
        // Text Muted
        const textMuted = document.createElement('small');
        textMuted.classList.add('text-muted');
        // Date
        const date = document.createElement('strong');
        date.innerText = result.date;
        // Copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright; 
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;
        // Appending Childrens to it's Parents
        link.append(image);
        cardBody.append(cardTitle);
        cardBody.append(favouriteButton);
        cardBody.append(cardText);
        textMuted.append(date);
        textMuted.append(copyright);
        cardBody.append(textMuted);
        card.append(link);
        card.append(cardBody);
        imagesContianer.append(card);
    });
}

// Update DOM
function updateDOM(page) {
    // Get favourites from Local Storage
    if (localStorage.getItem('nasaFavourites')) {
        favourites = JSON.parse(localStorage.getItem('nasaFavourites'));
    }
    imagesContianer.textContent = '';
    createDOMNodes(page);
    showContent();
}

// Get 10 Pictures from NASA API
async function getNasaPictures() {
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM('results');
    }

    catch (error) {
        // Error Here
        console.log(error);
    }
}

// Add To Favourites
function addToFavourites(itemUrl) {
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favourites[itemUrl]) {
            favourites[itemUrl] = item;
            // Show Save Confirmation for 2 sec
            saveConfirmation.classList.remove('hidden');
            const show = setInterval(() => {
                saveConfirmation.classList.add('hidden');
                clearInterval(show);
            },3000);
            // Add to Local Storage
            localStorage.setItem('nasaFavourites', JSON.stringify(favourites));
        }
    });
}

// Remove From Favourites
function removeFromFavourites(itemUrl) {

    if (favourites[itemUrl]) {
        delete favourites[itemUrl];
        localStorage.setItem('nasaFavourites', JSON.stringify(favourites));
    }

    updateDOM('favourites');
    // location.reload();
}

// On Load
getNasaPictures();