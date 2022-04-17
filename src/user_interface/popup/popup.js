const IS_WORKING_STATE = "IS_WORKING_STATE";

function toggleClickInspector() {
  chrome.storage.local.get([IS_WORKING_STATE], (state) => {
    if (state[IS_WORKING_STATE]) {
      console.debug(
        `Toggling isWorking state from ${state[IS_WORKING_STATE]} to ${false}`
      );
      chrome.storage.local.set({ IS_WORKING_STATE: false }, () => {
        console.debug(`Successfully updated isWorking state to ${false}`);
      });
    } else {
      console.debug(
        `Toggling isWorking state from ${state[IS_WORKING_STATE]} to ${true}`
      );
      chrome.storage.local.set({ IS_WORKING_STATE: true }, () => {
        console.debug(`Successfully updated isWorking state to ${true}`);
      });
    }
  });
}

document
  .getElementById("toggleInspector")
  .addEventListener("click", (event) => {
    toggleClickInspector();
  });

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.hasOwnProperty(IS_WORKING_STATE)) {
      console.log(changes[IS_WORKING_STATE].newValue);
    if (changes[IS_WORKING_STATE].newValue) {
      document.getElementById("workingStatus").innerText = "Working";
    } else {
      document.getElementById("workingStatus").innerText = "Not Working";
    }
  }
});
