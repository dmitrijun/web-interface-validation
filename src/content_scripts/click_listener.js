const IS_WORKING_STATE = "IS_WORKING_STATE";

function getElementXPath(element) {
  if (element.id !== "") {
    return `id("${element.id}")`;
  }
  if (element === document.body) {
    return element.tagName;
  }

  let elementIndex = 0;
  let siblings = element.parentNode.childNodes;
  for (let i = 0; i < siblings.length; i++) {
    let sibling = siblings[i];
    if (sibling === element) {
      return `${getElementXPath(element.parentNode)}/${element.tagName}[${
        elementIndex + 1
      }]`;
    }
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
      elementIndex++;
    }
  }
}

function getElementByXpath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

function submitReportForm(event) {
  event.preventDefault();
  closeDialog();
  console.log(event);
  const reportMessage = {
    messageType: "NEW_REPORT",
    report: {
      field: {
        field_name: event.target[0].value,
        xpath: event.target[0].value,
      },
    },
  };
  chrome.runtime.sendMessage(reportMessage, function (response) {
    console.log(response.farewell);
  });
}

function createDialog() {
  const modalContent = `<style>
  .modal-content {
      background-color: white;
  }
</style>
<div class="modal-content">
<span class="close" id="closeDialog">&times;</span>
<form id="elementSelectionForm">
  <label for="elName">Name</label><br />
  <input type="text" id="elName" /><br />
  <label for="xpath">XPath</label><br />
  <input type="text" id="xpath" value="" /><br />
  <input type="submit" value="Save" />
</form>
</div>

`;

  let modal = document.createElement("dialog");
  modal.innerHTML = modalContent;
  modal.id = "modalDialog";
  modal.className = "modal";
  modal.setAttribute("open", "");
  modal.style.display = "none";
  modal.style.position = "fixed";
  modal.style.zIndex = "100500";
  // modal.style.paddingTop = "100px";
  // modal.style.left = "0";
  // modal.style.top = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  // modal.style.overflow = "auto";
  modal.style.backgroundColor = "rgba(0,0,0,0.2)";
  document.body.insertBefore(modal, document.body.firstChild);
}

function turnOnInspect() {
  chrome.storage.local.get(["state"], (result) => {
    result.state.IS_WORKING_STATE = true;
    chrome.storage.local.set({ state: result.state });
  });
}

function turnOffInspect() {
  chrome.storage.local.get(["state"], (result) => {
    result.state.IS_WORKING_STATE = false;
    chrome.storage.local.set({ state: result.state });
  });
}

function openDialog(XPath) {
  const dialog = document.getElementById("modalDialog");
  dialog.style.display = "block";

  const input = document.getElementById("xpath");
  input.value = XPath;
  turnOffInspect();
}

function closeDialog() {
  const dialog = document.getElementById("modalDialog");
  dialog.style.display = "none";
  turnOnInspect();
}

function onClickCallback(event) {
  try {
    // Preventing event from invoking any action
    event.preventDefault();
    event.stopPropagation();

    if (event.target instanceof Element) {
      let elementXPath = getElementXPath(event.target);
      console.log(elementXPath);

      // test
      let val = getElementByXpath(elementXPath);
      openDialog(elementXPath);
      val.style.backgroundColor = "red";
    }
  } catch (err) {
    console.error(`Failed to catch click: ${err}`, err);
  }
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.state.newValue[IS_WORKING_STATE]) {
    document.addEventListener("click", onClickCallback, true);
  } else {
    document.removeEventListener("click", onClickCallback, true);
  }
});

createDialog();
document.getElementById("closeDialog").onclick = closeDialog;
document
  .getElementById("elementSelectionForm")
  .addEventListener("submit", submitReportForm);
