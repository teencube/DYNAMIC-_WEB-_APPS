// Import data from external module
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

let page = 1;
let matches = books;

// Creates a document fragment for initial book previews
const starting = document.createDocumentFragment();
for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
  const element = createBookPreview(id, image, title, authors[author]);
  starting.appendChild(element);
}

// Appends the initial book previews to the DOM
document.querySelector('[data-list-items]').appendChild(starting);


// Determines and sets the initial theme based on system preference
initializeTheme();

// Sets the button text and disabled state based on the number of matches
updateListButton();

// these are Event listeners
document.querySelector('[data-search-cancel]').addEventListener('click', closeSearchOverlay);
document.querySelector('[data-settings-cancel]').addEventListener('click', closeSettingsOverlay);
document.querySelector('[data-header-search]').addEventListener('click', openSearchOverlay);
document.querySelector('[data-header-settings]').addEventListener('click', openSettingsOverlay);
document.querySelector('[data-settings-form]').addEventListener('submit', handleThemeChange);
document.querySelector('[data-search-form]').addEventListener('submit', handleSearch);
document.querySelector('[data-list-button]').addEventListener('click', loadMoreBooks);
document.querySelector('[data-list-items]').addEventListener('click', openBookDetails);

/**
 * Creates a book preview element.
 * @param {string} id - The book's ID.
 * @param {string} image - The book's image URL.
 * @param {string} title - The book's title.
 * @param {string} author - The book's author.
 * @returns {HTMLElement} - The book preview element.
 */
function createBookPreview(id, image, title, author) {
  const element = document.createElement('button');
  element.classList.add('preview');
  element.setAttribute('data-preview', id);
  element.innerHTML = `
    <img class="preview__image" src="${image}" />
    <div class="preview__info">
      <h3 class="preview__title">${title}</h3>
      <div class="preview__author">${author}</div>
    </div>
  `;
  return element;
}

/**
 * Populates select options from an object and add the "All" option.
 * @param {string} selector - The selector for the select element.
 * @param {object} options - The options object.
 * @param {string} allOptionText - The text for the "All" option.
 */
function populateSelectOptions(selector, options, allOptionText) {
  const selectElement = document.querySelector(selector);
  const fragment = document.createDocumentFragment();

  const allOption = document.createElement('option');
  allOption.value = 'any';
  allOption.innerText = allOptionText;
  fragment.appendChild(allOption);

  for (const [id, name] of Object.entries(options)) {
    const element = document.createElement('option');
    element.value = id;
    element.innerText = name;
    fragment.appendChild(element);
  }
// this Creates and appends genre and author options to the search form
populateSelectOptions('[data-search-genres]', genres, 'All Genres');
populateSelectOptions('[data-search-authors]', authors, 'All Authors');

  selectElement.appendChild(fragment);
}

/**
 * Initialize the theme based on system preference.
 */
function initializeTheme() {
  const themeSetting = document.querySelector('[data-settings-theme]');
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    themeSetting.value = 'night';
    setThemeVariables('255, 255, 255', '10, 10, 20');
  } else {
    themeSetting.value = 'day';
    setThemeVariables('10, 10, 20', '255, 255, 255');
  }
}

/**
 * Set custom theme variables for the page.
 * @param {string} darkColor - RGB values for dark theme.
 * @param {string} lightColor - RGB values for light theme.
 */
function setThemeVariables(darkColor, lightColor) {
  document.documentElement.style.setProperty('--color-dark', darkColor);
  document.documentElement.style.setProperty('--color-light', lightColor);
}

/**
 * Closes the search overlay.
 */
function closeSearchOverlay() {
  document.querySelector('[data-search-overlay]').open = false;
}

/**
 * Closes the settings overlay.
 */
function closeSettingsOverlay() {
  document.querySelector('[data-settings-overlay]').open = false;
}

/**
 * Opens the search overlay and focus on the search title input.
 */
function openSearchOverlay() {
  const searchOverlay = document.querySelector('[data-search-overlay]');
  searchOverlay.open = true;
  document.querySelector('[data-search-title]').focus();
}

/**
 * Opens the settings overlay.
 */
function openSettingsOverlay() {
  document.querySelector('[data-settings-overlay]').open = true;
}

/**
 * Handles the theme change when the settings form is submitted.
 * @param {Event} event - The form submit event.
 */
function handleThemeChange(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);

  if (theme === 'night') {
    setThemeVariables('255, 255, 255', '10, 10, 20');
  } else {
    setThemeVariables('10, 10, 20', '255, 255, 255');
  }

  closeSettingsOverlay();
}

/**
 * Handles the search form submission.
 * @param {Event} event - The form submit event.
 */
function handleSearch(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const result = books.filter(book => isBookMatch(book, filters));

  page = 1;
  matches = result;

  updateListButton();

  if (result.length < 1) {
    document.querySelector('[data-list-message]').classList.add('list__message_show');
  } else {
    document.querySelector('[data-list-message]').classList.remove('list__message_show');
  }

  renderBookPreviews();
  scrollToTop();
  closeSearchOverlay();
}

/**
 * Checks if a book matches the search filters.
 * @param {object} book - The book object.
 * @param {object} filters - The search filters.
 * @returns {boolean} - True if the book matches the filters, false otherwise.
 */
function isBookMatch(book, filters) {
  const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
  const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
  const authorMatch = filters.author === 'any' || book.author === filters.author;

  return genreMatch && titleMatch && authorMatch;
}

/**
 *  this code Updates the "Show more" button text and disabled state based on the number of matches.
 */
function updateListButton() {
  const remaining = Math.max(matches.length - (page * BOOKS_PER_PAGE), 0);
  const listButton = document.querySelector('[data-list-button]');
  listButton.innerText = `Show more (${remaining})`;
  listButton.disabled = remaining === 0;
}

/**
 * Loads more books when the "Show more" button is clicked.
 */
function loadMoreBooks() {
  renderBookPreviews();
  page++;
}

/**
 * Renders book previews based on the current matches and page number.
 */
function renderBookPreviews() {
  const fragment = document.createDocumentFragment();
  for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
    const element = createBookPreview(id, image, title, authors[author]);
    fragment.appendChild(element);
  }

  document.querySelector('[data-list-items]').appendChild(fragment);
  updateListButton();
}

/**
 * Scrolls to the top of the page.
 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Opens the details of a selected book.
 * @param {Event} event - The click event.
 */
function openBookDetails(event) {
  const previewButton = event.target.closest('.preview');
  if (previewButton && previewButton.dataset.preview) {
    const activeBook = books.find(book => book.id === previewButton.dataset.preview);
    if (activeBook) {
      const listActive = document.querySelector('[data-list-active]');
      listActive.open = true;
      document.querySelector('[data-list-blur]').src = activeBook.image;
      document.querySelector('[data-list-image]').src = activeBook.image;
      document.querySelector('[data-list-title]').innerText = activeBook.title;
      document.querySelector('[data-list-subtitle]').innerText = `${authors[activeBook.author]} (${new Date(activeBook.published).getFullYear()})`;
      document.querySelector('[data-list-description]').innerText = activeBook.description;
    }
  }
}
