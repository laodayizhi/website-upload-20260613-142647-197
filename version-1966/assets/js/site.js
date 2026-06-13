(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMobileMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = selectAll('[data-hero-slide]', hero);
    var dots = selectAll('[data-hero-dot]', hero);
    if (slides.length < 2) {
      return;
    }
    var current = 0;
    var timer = null;
    function activate(index) {
      current = index;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }
    function next() {
      activate((current + 1) % slides.length);
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        activate(index);
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(next, 5200);
      });
    });
    timer = window.setInterval(next, 5200);
  }

  function setupFilter() {
    var inputs = selectAll('[data-filter-input]');
    inputs.forEach(function (input) {
      var scope = input.closest('main') || document;
      var cards = selectAll('[data-movie-card]', scope);
      function applyFilter() {
        var query = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var text = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
          card.classList.toggle('is-hidden', query && text.indexOf(query) === -1);
        });
      }
      input.addEventListener('input', applyFilter);
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q) {
        input.value = q;
        applyFilter();
      }
    });
    selectAll('[data-clear-filter]').forEach(function (button) {
      button.addEventListener('click', function () {
        var panel = button.closest('.search-panel') || document;
        var input = panel.querySelector('[data-filter-input]');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input'));
          input.focus();
        }
      });
    });
  }

  function setupPlayers() {
    selectAll('[data-player]').forEach(function (shell) {
      var video = shell.querySelector('video');
      var button = shell.querySelector('[data-play-button]');
      if (!video || !button) {
        return;
      }
      var url = video.getAttribute('data-url');
      var ready = false;
      function bindVideo(callback) {
        if (ready) {
          callback();
          return;
        }
        ready = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
          callback();
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls();
          video._hls = hls;
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, callback);
          return;
        }
        video.src = url;
        callback();
      }
      function play() {
        shell.classList.add('is-playing');
        bindVideo(function () {
          var started = video.play();
          if (started && typeof started.catch === 'function') {
            started.catch(function () {});
          }
        });
      }
      button.addEventListener('click', play);
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    setupHero();
    setupFilter();
    setupPlayers();
  });
})();
