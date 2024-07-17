document.addEventListener("DOMContentLoaded", () => {
  const saveKeyButton = document.getElementById("saveKey");
  const changeApiKeyButton = document.getElementById("changeApiKey");
  const apiInputSection = document.getElementById("apiInputSection");
  const currentApiKeySection = document.getElementById("currentApiKeySection");

  // API 키가 이미 설정되어 있는지 확인
  chrome.storage.local.get(["openaiApiKey"], (result) => {
    if (result.openaiApiKey) {
      currentApiKeySection.style.display = "block";
      apiInputSection.style.display = "none";
    } else {
      currentApiKeySection.style.display = "none";
      apiInputSection.style.display = "block";
    }
  });

  // API 키 저장
  if (saveKeyButton) {
    saveKeyButton.addEventListener("click", async () => {
      const apiKey = document.getElementById("apiKey").value;
      await chrome.storage.local.set({ openaiApiKey: apiKey });
      alert("API Key saved!");
      currentApiKeySection.style.display = "block";
      apiInputSection.style.display = "none";
    });
  } else {
    console.error("saveKey button not found in the DOM.");
  }

  // API 변경 버튼 클릭 시
  if (changeApiKeyButton) {
    changeApiKeyButton.addEventListener("click", () => {
      currentApiKeySection.style.display = "none";
      apiInputSection.style.display = "block";
    });
  } else {
    console.error("changeApiKey button not found in the DOM.");
  }
});