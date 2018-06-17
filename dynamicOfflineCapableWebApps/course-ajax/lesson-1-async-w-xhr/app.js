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

    const unsplashRequest = new XMLHttpRequest();
    unsplashRequest.onload = addImage;
    unsplashRequest.onerror = err => requestError(err, 'image');
    unsplashRequest.open(
      'GET',
      `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`
    );
    unsplashRequest.setRequestHeader('Access-Control-Allow-Origin', '*');
    unsplashRequest.setRequestHeader(
      'Authorization',
      `Client-ID ${API_KEY_UNSPLASH}`
    );
    unsplashRequest.send();

    const articleRequest = new XMLHttpRequest();
    articleRequest.onload = addArticles;
    articleRequest.onerror = err => requestError(err, 'articles');
    articleRequest.open(
      'GET',
      `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${API_KEY_NYTIMES}`
    );
    articleRequest.send();

    function addImage() {
      const data = JSON.parse(this.responseText);

      if (data && data.results && data.results[0]) {
        const firstImage = data.results[0];

        htmlContent = `<figure>
            <img src="${firstImage.urls.regular}" alt="${searchedForText}">
              <figcaption>${searchedForText} by ${
          firstImage.user.name
        }</figcaption>
            </figure>`;
      } else {
        htmlContent = `<div class="error-no-image">No images available</div>`;
      }

      responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticles() {
      const data = JSON.parse(this.responseText);

      if (data && data.response.docs && data.response.docs.length > 1) {
        htmlContent =
          '<ul>' +
          data.response.docs
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
  });
})();
