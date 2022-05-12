const NEW_REPORT = "NEW_REPORT";
const SHIP_REPORT = "SHIP_REPORT";

/*
  Function to parse new report event and add it to total report
*/
function parseNewReport(tabUrl, report) {
  // Checking if parameters are correct type
  if (report == null || !(typeof tabUrl === "string")) {
    // report must be non-empty and tab url must be string
    console.error("Report must be Report Type and tab URL must be String");
  }

  chrome.storage.local.get(["report"], (result) => {
    let old_object = result.report;

    if (!(tabUrl in old_object)) {
      // Create new object for new tab
      old_object[tabUrl] = {
        fields: [],
        actions: [],
      };
    }

    if (report.field) {
      old_object[tabUrl].fields.push({
        field_name: report.field.field_name,
        xpath: report.field.xpath,
      });
    }

    if (report.action) {
      old_object[tabUrl].actions.push({
        type: report.action.type,
      });
    }

    chrome.storage.local.set({ report: old_object }, () => {
      console.log("Report was updated", old_object);
    });
  });
}

// Listener for report data collection
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request == null || sender == null) {
    console.error("Background script got an empty message or sender!");
    return false;
  }

  if (request.messageType !== NEW_REPORT) {
    // Not our message, passing
    return true;
  }

  // Ensuring that we got message from tab
  //   if (sender.tab) {
  parseNewReport(sender.url, request.report);
  //   }

  return true;
});

function sendRequest(body) {
  chrome.storage.local.get(["settings"], (result) => {
    const endpoint = result.settings.endpoint;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const options = {
      method: "POST",
      headers,
      mode: "cors",
      body: JSON.stringify(body),
    };

    fetch(endpoint, options)
      .then((response) => {
        if (response.ok) {
          console.log("Report was sent successfully");
        } else {
          console.error("Error sending the report:", response.error());
        }
      })
      .catch((err) => {
        console.log("Could not post report:", err);
      });
  });
}

function sendReport() {
  chrome.storage.local.get(["report"], (result) => {
    let report = result.report;
    if (Object.keys(report).length === 0) {
      console.error("No sense in sending empty report");
      return;
    }
    let morphedReport = Object.keys(report).map((key) => {
      return {
        page: key,
        fields: report[key],
      };
    });

    sendRequest(morphedReport);
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request == null || sender == null) {
    console.error("Background script got an empty message or sender!");
    return false;
  }

  if (request.messageType !== SHIP_REPORT) {
    // Not our message, passing
    return true;
  }

  sendReport();

  return true;
});

/*
  Function for extension initial setup
*/
chrome.runtime.onInstalled.addListener((details) => {
  chrome.storage.local.set(
    {
      report: {},
      settings: {
        // TODO: edit settings
        endpoint: "google.com",
      },
      state: {},
    },
    () => {}
  );
});
