function loadOptions() {
  chrome.storage.local.get(["settings"], (result) => {
    document.getElementById("endpoint").value = result.settings.endpoint;
    document.getElementById("fullXPath").checked = result.settings.fullXPath;
    document.getElementById("saveActions").checked =
      result.settings.saveActions;
    document.getElementById("saveCoordinates").checked =
      result.settings.saveCoordinates;
  });
}

function saveOptions() {
  const endpoint = document.getElementById("endpoint").value;
  const fullXPath = document.getElementById("fullXPath").checked;
  const saveActions = document.getElementById("saveActions").checked;
  const saveCoordinates = document.getElementById("saveCoordinates").checked;
  chrome.storage.local.set(
    {
      settings: {
        endpoint: endpoint,
        fullXPath: fullXPath,
        saveActions: saveActions,
        saveCoordinates: saveCoordinates,
      },
    },
    () => {
      console.log("Updated settings successfully");
    }
  );
}

window.onload = function () {
  loadOptions();
  document.getElementById("saveButton").addEventListener("click", saveOptions);
};
