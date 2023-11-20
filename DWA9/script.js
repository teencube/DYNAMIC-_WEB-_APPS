// Import data from external module
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

class BookListingApp extends HTMLElement {
  constructor() {
    super();
    this.page = 1;
    this.matches = books;

    // Other initializations can go here
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    // Create a shadow DOM
    const shadowRoot = this.attachShadow({ mode: 'open' });

    // Create a document fragment for the initial book listing
    const starting = document.createDocumentFragment();

    // Loop through the initial set of books to display
    for (const { author, id, image, title } of this.matches.slice(0, BOOKS_PER_PAGE)) {
      const element = document.createElement('button');
      element.classList = 'preview';
      element.setAttribute('data-preview', id);

      element.innerHTML = `
        <img
          class="preview__image"
          src="${image}"
        />
        
        <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[author]}</div>
        </div>
      `;

      starting.appendChild(element);
    }
  

    // Append the initial book listing to the shadow DOM
    shadowRoot.appendChild(starting);


  // Append the initial book listing to the document
  //document.querySelector('[data-list-items]').appendChild(starting);

  // Create a document fragment for the genre dropdown
  const genreHtml = document.createDocumentFragment();
  const firstGenreElement = document.createElement('option');
  firstGenreElement.value = 'any';
  firstGenreElement.innerText = 'All Genres';
  genreHtml.appendChild(firstGenreElement);

  // Loop through and populate the genre dropdown
  for (const [id, name] of Object.entries(genres)) {
    const element = document.createElement('option');
    element.value = id;
    element.innerText = name;
    genreHtml.appendChild(element);
  }

  // Append the genre dropdown to the document
  document.querySelector('[data-search-genres]').appendChild(genreHtml);

  // Create a document fragment for the author dropdown
  const authorsHtml = document.createDocumentFragment();
  const firstAuthorElement = document.createElement('option');
  firstAuthorElement.value = 'any';
  firstAuthorElement.innerText = 'All Authors';
  authorsHtml.appendChild(firstAuthorElement);

  // Loop through and populate the author dropdown
  for (const [id, name] of Object.entries(authors)) {
    const element = document.createElement('option');
    element.value = id;
    element.innerText = name;
    authorsHtml.appendChild(element);
  }

  // Append the author dropdown to the document
  document.querySelector('[data-search-authors]').appendChild(authorsHtml);

  // Determine the preferred color scheme and set the theme
  setTheme();

  // Set the text and state of the "Show more" button
  setShowMoreButtonState();

  // Event listeners for various actions and interactions
  addEventListeners();

  // Event listener for the theme settings form
  document.querySelector('[data-settings-form]').addEventListener('submit', handleThemeChange);

  // Event listener for the search form
  document.querySelector('[data-search-form]').addEventListener('submit', handleSearch);

  // Event listener for the "Show more" button
  document.querySelector('[data-list-button]').addEventListener('click', handleShowMore);

  // Event listener for clicking on book items
  document.querySelector('[data-list-items]').addEventListener('click', handleBookItemClick);


/**
 * Sets the theme based on the preferred color scheme.
 */
function setTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.querySelector('[data-settings-theme]').value = 'night';
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
  } else {
    document.querySelector('[data-settings-theme]').value = 'day';
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
  }
}

/**
 * Sets the text and state of the "Show more" button.
 */
function setShowMoreButtonState() {
  const remainingBooks = matches.length - (page * BOOKS_PER_PAGE);
  const showMoreButton = document.querySelector('[data-list-button]');

  showMoreButton.innerText = `Show more (${remainingBooks})`;
  showMoreButton.disabled = remainingBooks <= 0;
}

/**
 * Event listeners for various actions and interactions.
 */
function addEventListeners() {
  // Event listener for canceling the search overlay
  document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false;
  });

  // Event listener for canceling the settings overlay
  document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false;
  });

  // Event listener for opening the search overlay
  document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true;
    document.querySelector('[data-search-title]').focus();
  });

  // Event listener for opening the settings overlay
  document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true;
  });

  // Event listener for closing the book details overlay
  document.querySelector('[data-list-close]').addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false;
  });
}

/**
 * Handles the theme change and updates the CSS variables accordingly.
 * @param {Event} event - The submit event.
 */
function handleThemeChange(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);

  if (theme === 'night') {
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
  } else {
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
  }

  document.querySelector('[data-settings-overlay]').open = false;
}

/**
 * Handles the search form submission and filters the book list.
 * @param {Event} event - The submit event.
 */
function handleSearch(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const result = [];

  for (const book of books) {
    let genreMatch = filters.genre === 'any';

    for (const singleGenre of book.genres) {
      if (genreMatch) break;
      if (singleGenre === filters.genre) {
        genreMatch = true;
      }
    }

    if (
      (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (filters.author === 'any' || book.author === filters.author) &&
      genreMatch
    ) {
      result.push(book);
    }
  }

  page = 1;
  matches = result;

  // Show or hide the message for empty results
  const listMessage = document.querySelector('[data-list-message]');
  listMessage.classList.toggle('list__message_show', result.length < 1);

  // Display the filtered book list
  displayFilteredBooks();
}

/**
 * Displays the filtered book list based on the search criteria.
 */
function displayFilteredBooks() {
  document.querySelector('[data-list-items]').innerHTML = '';
  const newItems = document.createDocumentFragment();

  for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', id);

    element.innerHTML = `
      <img
          class="preview__image"
          src="${image}"
      />
      
      <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[author]}</div>
      </div>
    `;

    newItems.appendChild(element);
  }

  document.querySelector('[data-list-items]').appendChild(newItems);
  setShowMoreButtonState();
  scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelector('[data-search-overlay]').open = false;
}

/**
 * Handles the "Show more" button click to display more book items.
 */
function handleShowMore() {
  const fragment = document.createDocumentFragment();

  for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', id);

    element.innerHTML = `
      <img
          class="preview__image"
          src="${image}"
      />
      
      <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[author]}</div>
      </div>
    `;

    fragment.appendChild(element);
  }

  document.querySelector('[data-list-items]').appendChild(fragment);
  page += 1;
  setShowMoreButtonState();
}

/**
 * Handles clicking on book items to view details.
 * @param {Event} event - The click event.
 */
function handleBookItemClick(event) {
  const pathArray = Array.from(event.path || event.composedPath());
  let active = null;

  for (const node of pathArray) {
    if (active) break;

    if (node?.dataset?.preview) {
      for (const singleBook of books) {
        if (singleBook.id === node?.dataset?.preview) {
          active = singleBook;
          break;
        }
      }
    }
  }

  if (active) {
    document.querySelector('[data-list-active]').open = true;
    document.querySelector('[data-list-blur]').src = active.image;
    document.querySelector('[data-list-image]').src = active.image;
    document.querySelector('[data-list-title]').innerText = active.title;
    document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
    document.querySelector('[data-list-description]').innerText = active.description;
  }
}

// Initialize the book listing app
initializeBookListingApp();
 