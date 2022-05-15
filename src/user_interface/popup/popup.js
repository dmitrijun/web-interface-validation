const IS_WORKING_STATE = "IS_WORKING_STATE";
const SHIP_REPORT = "SHIP_REPORT";

// Changes IS_WORKING_STATE to opposite
function toggleClickInspector() {
  chrome.storage.local.get(["state"], (result) => {
    result.state[IS_WORKING_STATE] = !result.state[IS_WORKING_STATE];
    chrome.storage.local.set({ state: result.state }, () => {});
  });
}

// toggle inspector button logic
document
  .getElementById("toggleInspector")
  .addEventListener("click", (event) => {
    toggleClickInspector();
  });

// Updating Working status title according to state
chrome.storage.onChanged.addListener((changes, namespace) => {
    console.log(changes.state.newValue[IS_WORKING_STATE]);
    if (changes.state.newValue[IS_WORKING_STATE]) {
      document.getElementById("workingStatus").innerText = "Working";
    } else {
      document.getElementById("workingStatus").innerText = "Not Working";
    }
});

// Initial setup
chrome.storage.local.get(["state"], (result) => {
  document.getElementById("workingStatus").innerText = result.state[
    IS_WORKING_STATE
  ]
    ? "Working"
    : "Not Working";
});

// test function, will be removed
document.getElementById("sendReport").addEventListener("click", (event) => {
  chrome.runtime.sendMessage({ messageType: SHIP_REPORT }, function (response) {
    console.log(response.farewell);
  });
});
