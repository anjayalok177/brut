/* ============================================================
   MUSIC — Spotify Embed + Track List
   ============================================================ */

(function() {
  let spotifyPlayer = null;
  let currentTrackIdx = 0;

  function renderTrackList() {
    const list = document.getElementById('trackList');
    list.innerHTML = '';
    spotifyTracks.forEach((track, i) => {
      const item = document.createElement('div');
      item.className = 'track-item' + (i === currentTrackIdx ? ' active' : '');
      item.innerHTML =
        '<div class="track-num">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<div class="track-info-small">' +
          '<div class="track-name">' + track.name + '</div>' +
          '<div class="track-artist-small">' + track.artist + '</div>' +
        '</div>' +
        '<div class="track-duration">' + track.duration + '</div>' +
        (i === currentTrackIdx ?
          '<div class="playing-indicator">' +
            '<div class="playing-bar"></div>' +
            '<div class="playing-bar"></div>' +
            '<div class="playing-bar"></div>' +
          '</div>' : '');
      item.addEventListener('click', () => loadTrack(i));
      list.appendChild(item);
    });
  }

  function loadTrack(index) {
    currentTrackIdx = index;
    renderTrackList();
    if (spotifyPlayer) {
      spotifyPlayer.loadUri(spotifyTracks[index].uri);
      spotifyPlayer.play();
    }
  }

  window.onSpotifyIframeApiReady = function(IFrameAPI) {
    const element = document.getElementById('spotify-embed');
    const options = {
      width: '100%', height: '380',
      uri: spotifyTracks[0].uri,
      theme: 'dark'
    };
    const callback = function(EmbedController) {
      spotifyPlayer = EmbedController;
      spotifyPlayer.addListener('playback_update', function(e) {
        const isPaused = e.data.isPaused;
        const items = document.querySelectorAll('.track-item');
        items.forEach(function(item) {
          const indicator = item.querySelector('.playing-indicator');
          if (indicator) {
            indicator.style.opacity = isPaused ? '0.3' : '1';
          }
        });
      });
    };
    IFrameAPI.createController(element, options, callback);
    renderTrackList();
  };
})();
