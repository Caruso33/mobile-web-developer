/* eslint-env jquery */

(function() {
  const form = document.querySelector('#search-form');
  const searchField = document.querySelector('#search-keyword');
  const API_KEY_UNSPLASH =
    '3ec49c8a2d01ad8062be64210275523727fff54fe5e21bd9699a568cef091ad8';
  const API_KEY_NYTIMES = '1b495e6280954d878761817e94fe2cf0';
  let searchedForText;
  const responseContainer = document.querySelector('#response-container');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    responseContainer.innerHTML = '';
    document.querySelector('selector');
    searchedForText = searchField.value;

    $.ajax({
      url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
      headers: {
        Authorization: `Client-ID ${API_KEY_UNSPLASH}`
      }
    })
      .done(addImage)
      .fail(err => requestError(err, 'image'));
    $.ajax({
      url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${API_KEY_NYTIMES}`
    })
      .done(addArticles)
      .fail(err => requestError(err, 'articles'));
  });
  function addImage(data) {
    let htmlContent = '';

    if (data && data.results && data.results.length > 1) {
      const firstImage = data.results[0];

      htmlContent = `<figure>
            <img src="${firstImage.urls.small}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${
        firstImage.user.name
      }</figcaption>
      </figure>`;
    } else {
      htmlContent = `<div class="error-no-image">No images available</div>`;
    }

    responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
  }

  function addArticles(data) {
    let htmlContent = '';

    if (data.response && data.response.docs && data.response.docs.length > 1) {
      const articles = data.response.docs;
      htmlContent =
        '<ul>' +
        articles
          .map(
            article =>
              `<li class="article">
              <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
              <p>${article.snippet}</p>
            </li>`
          )
          .join('') +
        '</ul>';
    } else {
      htmlContent = `<div class="error-no-articles">No articles available</div>`;
    }

    responseContainer.insertAdjacentHTML('beforeend', htmlContent);
  }
})();
