function initializeMoviePlayer(videoId, overlayId, videoUrl) {
  var video = document.getElementById(videoId);
  var overlay = document.getElementById(overlayId);
  var attached = false;
  var hlsInstance = null;

  if (!video) {
    return;
  }

  function attachStream() {
    if (attached) {
      return;
    }
    attached = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hlsInstance.loadSource(videoUrl);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = videoUrl;
  }

  function startPlayback() {
    attachStream();
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
    video.controls = true;
    var playResult = video.play();
    if (playResult && typeof playResult.catch === "function") {
      playResult.catch(function () {
        video.controls = true;
      });
    }
  }

  if (overlay) {
    overlay.addEventListener("click", function (event) {
      event.preventDefault();
      startPlayback();
    });
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      startPlayback();
    }
  });

  video.addEventListener("play", function () {
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
  });

  window.addEventListener("beforeunload", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
