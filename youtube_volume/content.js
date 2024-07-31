chrome.storage.sync.get('volumeSchedule', data => {
    const currentHour = new Date().getHours();
    const schedule = data.volumeSchedule || {};
    const volume = schedule[currentHour] || 100; // Default volume is 100%
    const video = document.querySelector('video');
    if (video) {
      video.volume = volume / 100;
      const volumeSlider = document.querySelector('.ytp-volume-slider-handle');
      if (volumeSlider) {
        volumeSlider.style.left = `${volume}%`;
      }
    }
  });