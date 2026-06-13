(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (menuButton && navLinks) {
    menuButton.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var previous = document.querySelector('.hero-prev');
  var next = document.querySelector('.hero-next');
  var activeIndex = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
    });
  }

  function startTimer() {
    if (!slides.length) {
      return;
    }

    window.clearInterval(timer);
    timer = window.setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5200);
  }

  if (previous) {
    previous.addEventListener('click', function () {
      showSlide(activeIndex - 1);
      startTimer();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      showSlide(activeIndex + 1);
      startTimer();
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener('click', function () {
      showSlide(dotIndex);
      startTimer();
    });
  });

  startTimer();

  var searchInput = document.querySelector('.search-input');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.filter-card'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('.filter-chip'));
  var chipValue = '';

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function cardText(card) {
    return normalize([
      card.getAttribute('data-title'),
      card.getAttribute('data-region'),
      card.getAttribute('data-year'),
      card.getAttribute('data-type'),
      card.getAttribute('data-genre'),
      card.getAttribute('data-tags'),
      card.textContent
    ].join(' '));
  }

  function applyFilters() {
    var query = searchInput ? normalize(searchInput.value) : '';

    cards.forEach(function (card) {
      var text = cardText(card);
      var matchedQuery = !query || text.indexOf(query) !== -1;
      var matchedChip = !chipValue || text.indexOf(chipValue) !== -1;
      card.classList.toggle('is-hidden', !(matchedQuery && matchedChip));
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (item) {
        item.classList.remove('active');
      });

      chip.classList.add('active');
      chipValue = normalize(chip.getAttribute('data-filter'));
      applyFilters();
    });
  });
})();
