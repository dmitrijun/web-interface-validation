const IS_WORKING_STATE = "IS_WORKING_STATE";

function onClickCallback(event) {
    // Preventing event from invoking any action
    event.preventDefault();
    event.stopPropagation();

    console.log("Event!!!", event);
}

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.hasOwnProperty(IS_WORKING_STATE)) {
        console.log(changes[IS_WORKING_STATE].newValue);
      if (changes[IS_WORKING_STATE].newValue) {
        document.addEventListener("click", onClickCallback, true)
      } else {
        document.removeEventListener("click", onClickCallback, true)
      }
    }
})
