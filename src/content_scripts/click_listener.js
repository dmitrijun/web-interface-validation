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
