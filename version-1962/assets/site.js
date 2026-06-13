(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    var header = qs('.site-header');
    var navToggle = qs('.nav-toggle');

    if (header && navToggle) {
        navToggle.addEventListener('click', function () {
            var open = header.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    qsa('[data-hero]').forEach(function (hero) {
        var slides = qsa('.hero-slide', hero);
        var dots = qsa('[data-hero-dot]', hero);
        var current = 0;
        var timer;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function play() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                play();
            });
        });

        show(0);
        play();
    });

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    qsa('.filterable-list').forEach(function (wrap) {
        var input = qs('.movie-search-input', wrap);
        var year = qs('.year-select', wrap);
        var type = qs('.type-select', wrap);
        var cards = qsa('.movie-card', wrap);

        function filter() {
            var query = normalize(input && input.value);
            var yearValue = normalize(year && year.value);
            var typeValue = normalize(type && type.value);

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-type'),
                    card.textContent
                ].join(' '));
                var okQuery = !query || haystack.indexOf(query) !== -1;
                var okYear = !yearValue || normalize(card.getAttribute('data-year')).indexOf(yearValue) !== -1;
                var okType = !typeValue || normalize(card.getAttribute('data-type')).indexOf(typeValue) !== -1;
                card.classList.toggle('hidden', !(okQuery && okYear && okType));
            });
        }

        [input, year, type].forEach(function (control) {
            if (control) {
                control.addEventListener('input', filter);
                control.addEventListener('change', filter);
            }
        });

        var params = new URLSearchParams(window.location.search);
        if (input && params.get('q')) {
            input.value = params.get('q');
        }
        filter();
    });
})();
