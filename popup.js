document.addEventListener("DOMContentLoaded", () => {
  const saveKeyButton = document.getElementById("saveKey");
  if (saveKeyButton) {
    saveKeyButton.addEventListener("click", async () => {
      const apiKey = document.getElementById("apiKey").value;
      await chrome.storage.local.set({ openaiApiKey: apiKey });
      alert("API Key saved!");
    });
  } else {
    console.error("saveKey button not found in the DOM.");
  }
});