
document.addEventListener('DOMContentLoaded', function () {
    setupMobileNavigation();
    setupGlobalSearchForms();
    setupLocalFilters();
    setupHeroSlider();
    setupPlayers();
    setupScrollTop();
});

function setupMobileNavigation() {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');

    if (!toggle || !nav) {
        return;
    }

    toggle.addEventListener('click', function () {
        nav.classList.toggle('is-open');
    });
}

function setupGlobalSearchForms() {
    var forms = document.querySelectorAll('[data-search-form]');
    var prefix = document.body.getAttribute('data-root-prefix') || './';

    forms.forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('input[name="q"]');
            var query = input ? input.value.trim() : '';

            if (query) {
                window.location.href = prefix + 'search.html?q=' + encodeURIComponent(query);
            }
        });
    });
}

function setupLocalFilters() {
    var forms = document.querySelectorAll('[data-local-filter-form]');

    forms.forEach(function (form) {
        var input = form.querySelector('[data-local-filter-input]');
        var list = document.querySelector('[data-filter-list]');
        var empty = document.querySelector('[data-empty-message]');

        if (!input || !list) {
            return;
        }

        if (input.hasAttribute('data-url-query')) {
            var params = new URLSearchParams(window.location.search);
            var value = params.get('q') || '';
            input.value = value;
        }

        var apply = function () {
            var query = input.value.trim().toLowerCase();
            var items = list.querySelectorAll('[data-search]');
            var visible = 0;

            items.forEach(function (item) {
                var text = (item.getAttribute('data-search') || '').toLowerCase();
                var matched = !query || text.indexOf(query) !== -1;
                item.classList.toggle('is-hidden', !matched);

                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        };

        input.addEventListener('input', apply);
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            apply();
        });
        apply();
    });
}

function setupHeroSlider() {
    var slider = document.querySelector('[data-hero-slider]');

    if (!slider) {
        return;
    }

    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var next = slider.querySelector('[data-hero-next]');
    var prev = slider.querySelector('[data-hero-prev]');
    var index = 0;
    var timer = null;

    var show = function (target) {
        index = (target + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === index);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === index);
        });
    };

    var start = function () {
        stop();
        timer = window.setInterval(function () {
            show(index + 1);
        }, 5200);
    };

    var stop = function () {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
    };

    dots.forEach(function (dot, dotIndex) {
        dot.addEventListener('click', function () {
            show(dotIndex);
            start();
        });
    });

    if (next) {
        next.addEventListener('click', function () {
            show(index + 1);
            start();
        });
    }

    if (prev) {
        prev.addEventListener('click', function () {
            show(index - 1);
            start();
        });
    }

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    show(0);
    start();
}

function setupPlayers() {
    var players = document.querySelectorAll('[data-player]');

    players.forEach(function (shell) {
        var video = shell.querySelector('video[data-src]');
        var cover = shell.querySelector('.player-cover');

        if (!video) {
            return;
        }

        var play = function () {
            prepareVideo(video);
            shell.classList.add('is-playing');
            var result = video.play();

            if (result && typeof result.catch === 'function') {
                result.catch(function () {});
            }
        };

        if (cover) {
            cover.addEventListener('click', play);
        }

        video.addEventListener('click', function () {
            if (!video.dataset.ready) {
                play();
            }
        });
    });
}

function prepareVideo(video) {
    if (video.dataset.ready) {
        return;
    }

    var source = video.getAttribute('data-src');

    if (!source) {
        return;
    }

    if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
        });

        hls.loadSource(source);
        hls.attachMedia(video);
        video.hlsInstance = hls;
        video.dataset.ready = '1';
        return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.dataset.ready = '1';
        return;
    }

    video.src = source;
    video.dataset.ready = '1';
}

function setupScrollTop() {
    var button = document.querySelector('[data-scroll-top]');

    if (!button) {
        return;
    }

    button.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
