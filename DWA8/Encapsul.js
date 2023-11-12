 
/**
 * Factory function to create a Book Preview.
 * @param {Object} book - The book object containing author, id, image, and title.
 * @param {Object} authors - The authors object.
 * @returns {HTMLButtonElement} - The created book preview button element.
 */
function createBookPreview(book, authors) {
  const element = document.createElement('button');
  element.classList = 'preview';
  element.setAttribute('data-preview', book.id);
  element.innerHTML = `
    <img
        class="preview__image"
        src="${book.image}"
    />
    <div class="preview__info">
        <h3 class="preview__title">${book.title}</h3>
        <div class="preview__author">${authors[book.author]}</div>
    </div>
  `;
  return element;
}
