(function() {
  const API_KEY_UNSPLASH =
    '3ec49c8a2d01ad8062be64210275523727fff54fe5e21bd9699a568cef091ad8';
  const API_KEY_NYTIMES = '1b495e6280954d878761817e94fe2cf0';
  const form = document.querySelector('#search-form');
  const searchField = document.querySelector('#search-keyword');
  let searchedForText;
  const responseContainer = document.querySelector('#response-container');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    responseContainer.innerHTML = '';
    searchedForText = searchField.value;

    function addImage(data) {
      let htmlContent = '';
      const firstImage = data.results[0];

      if (firstImage) {
        htmlContent = `<figure>
            <img src="${firstImage.urls.small}" alt="${searchedForText}">
            <figcaption>${searchedForText} by ${
          firstImage.user.name
        }</figcaption>
        </figure>`;
      } else {
        htmlContent = 'Unfortunately, no image was returned for your search.';
      }

      responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }
    function addArticles(data) {
      let htmlContent = '';

      if (
        data.response &&
        data.response.docs &&
        data.response.docs.length > 1
      ) {
        const articles = data.response.docs;
        htmlContent =
          '<ul>' +
          articles
            .map(
              article =>
                `<li class="article">
                <h2><a href="${article.web_url}">${
                  article.headline.main
                }</a></h2>
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
    fetch(
      `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
      {
        headers: {
          Authorization: `Client-ID ${API_KEY_UNSPLASH}`
        }
      }
    )
      .then(response => response.json())
      .then(addImage)
      .catch(e => requestError(e, 'image'));
    fetch(
      `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${API_KEY_NYTIMES}`
    )
      .then(response => response.json())
      .then(addArticles)
      .catch(e => requestError(e, 'articles'));

    function requestError(e, part) {
      console.log(e);
      responseContainer.insertAdjacentHTML(
        'beforeend',
        `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`
      );
    }
  });
})();
