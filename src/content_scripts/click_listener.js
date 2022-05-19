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
    position: relative;
    background-color: Gainsboro;
    position: fixed;
    left: 10px;
    top: 20px;
    transform: translate(0%, 0%);
    border: 1px solid black;
    box-shadow: 10px 5px 5px 1px DimGray;
    width: 350px;
    height: 300px;
    font-size: 70%;
    //font-size: 20px;
    //text-align: center;
    font-weight: lighter;
    font-family: Arial;
    position: static;
  }

  label {
    width: 200px; /* Ширина */
    text-align: left; /* Выравниваем по правому краю */
    float: left; /* Выстраиваем элементы рядом */
    margin-left: 10px !important; /* Расстояние от текста до текстового поля */
    line-height: 20px; /* Выравниваем по высоте */
  }

  .main_input {
    display: block;
    position: relative;
    width:70%;
    height: 27px;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 2;
    color: #212529;
    margin-left: 10px;
    background-color: white !important;
    background-clip: padding-box;
    border: 1px solid black;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  .submit-button {
    background-color: white !important;
    position: relative;
    left: 10px;
    top: 20px;
    transform: translate(0%, 0%);
    border: 1px solid black;
    box-shadow: 10px 5px 5px 1px DimGray;
    width: 100px;
    height: 30px;
    font-size: 70%;
    //font-size: 20px;
    //text-align: center;
    //font-weight: lighter;
    font-family: Arial;
    position: static;
    border: 1px solid black;
    border-radius: 0.25rem;
    margin-left: 10px;
  }

  .elName-style {
    position: static;
    left: 10px;
    top: 20px;
    margin-left: 10px !important;
    font-family: Arial;    
  }

  .close {
    font-size: 30px;
  }

</style>
<div class="modal-content">
<span class="close" id="closeDialog" class="closeClass">&times;</span>
<form id="elementSelectionForm">
  <label for="elName" class="elName-style">Name</label><br />
  <input type="text" id="elName" class="main_input" /><br />
  <label for="xpath" class="elName-style">XPath</label><br />
  <input type="text" id="xpath" value="" class="main_input" /><br />
  <input type="submit" value="Save" class="submit-button" />
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
  modal.style.fontSize = "27px";
  modal.style.fontWeight = "bolder";
  modal.style.color = "black";
  //modal.style.paddingTop = "10px";
  modal.style.left = "-3px";
  modal.style.top = "-3px";
  modal.style.width = "100%";
  modal.style.height = "100%";
  //modal.style.overflow = "auto";
  modal.style.backgroundColor = "rgba(0,0,0,0.4)";
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