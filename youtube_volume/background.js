chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ volumeSchedule: {} });
  chrome.alarms.create('adjustVolume', { periodInMinutes: 1 }); // Create the alarm to check every minute
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'adjustVolume') {
    adjustVolume();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'adjustVolumeNow') {
    adjustVolume();
    sendResponse({ status: 'Volume adjusted' });
  }
});

function adjustVolume() {
  const currentHour = new Date().getHours();
  chrome.storage.sync.get('volumeSchedule', data => {
    const schedule = data.volumeSchedule || {};
    const volume = schedule[currentHour] !== undefined ? schedule[currentHour] : 100; // Default volume is 100%
    chrome.tabs.query({ url: "*://*.youtube.com/*" }, tabs => {
      tabs.forEach(tab => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: setVolume,
          args: [volume]
        });
      });
    });
  });
}

function setVolume(volume) {
  const video = document.querySelector('video');
  if (video) {
    video.volume = volume / 100;
    const volumeSlider = document.querySelector('.ytp-volume-slider-handle');
    if (volumeSlider) {
      volumeSlider.style.left = `${volume}%`;
      // Trigger a UI update by simulating a mouse event on the volume slider
      volumeSlider.dispatchEvent(new MouseEvent('mouseup', {bubbles: true}));
    }
  }
}
