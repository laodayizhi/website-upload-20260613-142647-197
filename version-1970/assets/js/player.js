function initMoviePlayer(sourceUrl) {
  var video = document.querySelector('.movie-video');
  var layer = document.querySelector('.play-layer');
  var hlsInstance = null;
  var loaded = false;

  if (!video || !sourceUrl) {
    return;
  }

  function bindSource() {
    if (loaded) {
      return;
    }

    loaded = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hlsInstance.loadSource(sourceUrl);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = sourceUrl;
  }

  function beginPlayback() {
    bindSource();

    if (layer) {
      layer.classList.add('is-hidden');
    }

    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  if (layer) {
    layer.addEventListener('click', beginPlayback);
  }

  video.addEventListener('click', function () {
    if (!loaded || video.paused) {
      beginPlayback();
    }
  });

  video.addEventListener('play', function () {
    if (layer) {
      layer.classList.add('is-hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
