document.addEventListener('DOMContentLoaded', () => {
  const scheduleDiv = document.getElementById('schedule');
  const saveButton = document.getElementById('save');
  const bulkChangeButton = document.getElementById('bulk-change');
  const bulkVolumeInput = document.getElementById('bulk-volume');

  chrome.storage.sync.get('volumeSchedule', data => {
    const schedule = data.volumeSchedule || {};
    for (let hour = 0; hour < 24; hour++) {
      const volume = schedule[hour] !== undefined ? schedule[hour] : 100;
      const hourDiv = document.createElement('div');
      hourDiv.classList.add('hour');
      hourDiv.innerHTML = `
        <label>${hour}:00</label>
        <input type="number" min="0" max="100" value="${volume}" id="hour-${hour}">
      `;
      scheduleDiv.appendChild(hourDiv);
    }
  });

  saveButton.addEventListener('click', () => {
    const schedule = {};
    for (let hour = 0; hour < 24; hour++) {
      const volume = document.getElementById(`hour-${hour}`).value;
      schedule[hour] = parseInt(volume, 10);
    }
    chrome.storage.sync.set({ volumeSchedule: schedule }, () => {
      alert('Schedule saved!');
      chrome.runtime.sendMessage('adjustVolumeNow', response => {
        if (response.status === 'Volume adjusted') {
          console.log('Volume adjusted to current schedule');
        }
      });
    });
  });

  bulkChangeButton.addEventListener('click', () => {
    const bulkVolume = parseInt(bulkVolumeInput.value, 10);
    if (isNaN(bulkVolume) || bulkVolume < 0 || bulkVolume > 100) {
      alert('Please enter a valid volume between 0 and 100');
      return;
    }
    for (let hour = 0; hour < 24; hour++) {
      document.getElementById(`hour-${hour}`).value = bulkVolume;
    }
  });
});
