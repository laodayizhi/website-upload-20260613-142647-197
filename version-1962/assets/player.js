(function () {
    function attachPlayer(root) {
        var video = root.querySelector('video');
        var button = root.querySelector('[data-play-button]');
        var overlay = root.querySelector('.player-overlay');
        var stream = video ? video.getAttribute('data-stream') : '';
        var ready = false;

        function load() {
            if (!video || !stream || ready) {
                return;
            }
            ready = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({ enableWorker: true });
                hls.loadSource(stream);
                hls.attachMedia(video);
                video._hls = hls;
            } else {
                video.src = stream;
            }
        }

        function start() {
            load();
            root.classList.add('is-playing');
            if (overlay) {
                overlay.setAttribute('aria-hidden', 'true');
            }
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {});
            }
        }

        if (button) {
            button.addEventListener('click', start);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (!ready) {
                    start();
                } else if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            });
            video.addEventListener('play', function () {
                root.classList.add('is-playing');
            });
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(attachPlayer);
    });
})();
