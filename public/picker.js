console.log("📦 picker.js loaded");

const DEVELOPER_KEY = window.__GOOGLE_API_KEY__;
const APP_ID = "731813032920";
const oauthToken = new URLSearchParams(window.location.search).get("token");

if (!DEVELOPER_KEY) {
  console.error("❌ Google API key not found. Make sure env.js loaded correctly.");
  throw new Error("Missing developer key");
}

if (!oauthToken) {
  console.error("❌ Missing OAuth token from URL.");
  alert("Missing token. Please try signing in again.");
  throw new Error("Missing token");
}

function waitForGapi(callback) {
  if (window.gapi && gapi.load) {
    callback();
  } else {
    console.log("⏳ Waiting for gapi...");
    setTimeout(() => waitForGapi(callback), 100);
  }
}

function openPicker() {
  const view = new google.picker.DocsView()
    .setIncludeFolders(true)
    .setMimeTypes("application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain")
    .setMode(google.picker.DocsViewMode.LIST);

  const picker = new google.picker.PickerBuilder()
    .enableFeature(google.picker.Feature.NAV_HIDDEN)
    .setAppId(APP_ID)
    .setOAuthToken(oauthToken)
    .setDeveloperKey(DEVELOPER_KEY)
    .addView(view)
    .setCallback((data) => {
      if (data.action === google.picker.Action.PICKED) {
        const fileId = data.docs[0].id;
        window.parent.postMessage({ fileId, oauthToken }, "*");
        window.close();
      } else if (data.action === google.picker.Action.CANCEL) {
        console.log("❌ Picker closed or cancelled");
        document.getElementById("message").textContent = "Picker was canceled.";
        document.querySelector(".spinner").style.display = "none";
      }
    })
    .build();

  picker.setVisible(true);
  console.log("📋 Picker is now visible");
}

window.addEventListener("DOMContentLoaded", () => {
  waitForGapi(() => {
    gapi.load("picker", {
      callback: openPicker,
      onerror: () => console.error("❌ Picker API failed to load"),
    });
  });
});
