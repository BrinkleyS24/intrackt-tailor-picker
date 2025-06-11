console.log("📦 picker.js loaded");

const DEVELOPER_KEY = "AIzaSyCSwzvfXw8AreU8XUIImCBPedypWRKBJSE";
const APP_ID = "731813032920";
const oauthToken = new URLSearchParams(window.location.search).get("token");

// ✅ Dynamically inject the Google Picker script
function loadPickerApi() {
  const script = document.createElement("script");
  script.src = "https://apis.google.com/js/api.js";
  script.onload = onApiLoad;
  script.onerror = () => console.error("❌ Failed to load Picker API script");
  document.body.appendChild(script);
}

// ✅ Called when script is loaded
function onApiLoad() {
  console.log("✅ onApiLoad called");
  gapi.load("picker", {
    callback: createPicker,
    onerror: () => console.error("❌ Picker API failed to load"),
  });
}

function createPicker() {
  console.log("✅ createPicker called with token:", oauthToken);

  if (!oauthToken) {
    alert("Missing token");
    return;
  }

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
      }
    })
    .build();

  picker.setVisible(true);
  console.log("📋 Picker is now visible");
}

// ✅ Kick it off
loadPickerApi();
