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
  console.log(`Checking volume schedule for hour ${currentHour}`);
  chrome.storage.sync.get('volumeSchedule', data => {
    const schedule = data.volumeSchedule || {};
    const volume = schedule[currentHour] !== undefined ? schedule[currentHour] : 100; // Default volume is 100%
    console.log(`Setting volume to ${volume}% for hour ${currentHour}`);
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
      const volumePercentage = volume / 100;
      const volumeSliderWidth = document.querySelector('.ytp-volume-slider').offsetWidth;
      volumeSlider.style.left = `${volumePercentage * volumeSliderWidth}px`;

      // Trigger a UI update by simulating a mouse event on the volume slider
      const event = new Event('change', { bubbles: true });
      volumeSlider.dispatchEvent(event);
    }

    // Add or update the volume label
    let volumeLabel = document.getElementById('volume-label');
    if (!volumeLabel) {
      volumeLabel = document.createElement('div');
      volumeLabel.id = 'volume-label';
      volumeLabel.style.position = 'absolute';
      volumeLabel.style.top = '0px';
      volumeLabel.style.right = '30px';
      volumeLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      volumeLabel.style.color = 'white';
      volumeLabel.style.padding = '5px';
      volumeLabel.style.zIndex = 1000;
      volumeLabel.style.fontSize = '14px';

      const metadataElement = document.querySelector('h1.style-scope.ytd-watch-metadata');
      if (metadataElement) {
        metadataElement.insertAdjacentElement('afterbegin', volumeLabel);
      }
    }
    volumeLabel.textContent = `Volume: ${volume}%`;

    // Log the volume change
    console.log(`Volume set to ${volume}% at ${new Date().toLocaleTimeString()}`);
  }
}
