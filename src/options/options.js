function loadOptions() {
  chrome.storage.local.get(["settings"], (result) => {
    document.getElementById("endpoint").value = result.settings.endpoint;
  });
}

function saveOptions() {
  const value = document.getElementById("endpoint").value;
  chrome.storage.local.set({ endpoint: value }, () => {
    console.log("Updated settings successfully");
  });
}

window.onload = function () {
  loadOptions();
  document.getElementById("saveButton").addEventListener("click", saveOptions);
};
