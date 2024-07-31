chrome.storage.sync.get('volumeSchedule', data => {
    const currentHour = new Date().getHours();
    const schedule = data.volumeSchedule || {};
    const volume = schedule[currentHour] || 100; // Default volume is 100%
    const video = document.querySelector('video');
    if (video) {
      video.volume = volume / 100;
    }
  });