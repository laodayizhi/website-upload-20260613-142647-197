(function () {
  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return (params.get("q") || "").trim();
  }

  function escapeText(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function card(movie) {
    return [
      '<article class="movie-card">',
      '  <a class="poster-link" href="' + escapeText(movie.url) + '">',
      '    <div class="poster-frame">',
      '      <img src="' + escapeText(movie.cover) + '" alt="' + escapeText(movie.title) + '" loading="lazy">',
      '      <span class="poster-type">' + escapeText(movie.type) + '</span>',
      '      <span class="poster-score">' + escapeText(movie.rating) + '</span>',
      '    </div>',
      '  </a>',
      '  <div class="movie-card-body">',
      '    <div class="movie-meta">' + escapeText(movie.year) + ' · ' + escapeText(movie.region) + ' · ' + escapeText(movie.genre) + '</div>',
      '    <h3><a href="' + escapeText(movie.url) + '">' + escapeText(movie.title) + '</a></h3>',
      '    <p>' + escapeText(movie.oneLine) + '</p>',
      '    <a class="small-link" href="' + escapeText(movie.url) + '">查看详情</a>',
      '  </div>',
      '</article>'
    ].join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var input = document.getElementById("searchInput");
    var results = document.getElementById("searchResults");
    var count = document.getElementById("searchCount");
    if (!input || !results || !window.SEARCH_INDEX) {
      return;
    }

    var query = getQuery();
    input.value = query;

    function render(value) {
      var normalized = value.trim().toLowerCase();
      var matches = window.SEARCH_INDEX.filter(function (movie) {
        if (!normalized) {
          return true;
        }
        return String(movie.keywords || "").toLowerCase().indexOf(normalized) !== -1;
      }).slice(0, 96);

      results.innerHTML = matches.map(card).join("");
      if (count) {
        count.textContent = normalized ? "已显示相关结果" : "显示热门内容";
      }
    }

    input.addEventListener("input", function () {
      render(input.value);
    });

    render(query);
  });
})();
