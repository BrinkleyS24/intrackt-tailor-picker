function pickerCallback(data) {
  if (data.action === google.picker.Action.PICKED) {
    var doc = data[google.picker.Response.DOCUMENTS][0];
    document.getElementById('result').innerText =
      'Picked: ' + doc.name + ' (ID: ' + doc.id + ')';
  } else if (data.action === google.picker.Action.CANCEL) {
    console.log('Picker cancelled by user.');
  }
}

function createPicker() {
  if (!window.__GOOGLE_API_KEY__) {
    console.error('Google API key not found. Ensure env.js is loaded with window.__GOOGLE_API_KEY__.');
    return;
  }
  if (!window.gapi) {
    console.error('Google API client library not loaded.');
    return;
  }
  gapi.load('picker', {'callback': function() {
    var view = new google.picker.View(google.picker.ViewId.DOCS);
    var picker = new google.picker.PickerBuilder()
      .addView(view)
      .setDeveloperKey(window.__GOOGLE_API_KEY__)
      .setCallback(pickerCallback)
      .build();
    picker.setVisible(true);
  }});
}

var pickButton = document.getElementById('pick');
if (pickButton) {
  pickButton.addEventListener('click', createPicker);
} else {
  console.error('Pick button not found. Ensure the HTML has an element with id="pick".');
}
