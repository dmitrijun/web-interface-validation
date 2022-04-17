const IS_WORKING_STATE = "IS_WORKING_STATE"

function toggleClickInspector() {
    chrome.storage.local.get([IS_WORKING_STATE], state=> {
        if (state) {
            console.debug(`Toggling isWorking state from ${state} to ${false}`);
            chrome.storage.local.set({IS_WORKING_STATE: false}, () => {
                console.debug(`Successfully updated isWorking state to ${false}`)
            })
        } else {
            console.debug(`Toggling isWorking state from ${state} to ${true}`);
            chrome.storage.local.set({IS_WORKING_STATE: true}, () => {
                console.debug(`Successfully updated isWorking state to ${true}`)
            })
        }
    })
}

toggleInspector.addEventListener("click", event => {
    toggleClickInspector();
})