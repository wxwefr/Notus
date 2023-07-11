document.addEventListener("DOMContentLoaded", function () {
  var saveButton = document.getElementById("save");
  var clearButton = document.getElementById("clear");
  var vidNameInput = document.getElementById("VidName");
  var timestampInput = document.getElementById("timestamp");
  var descriptionInput = document.getElementById("description");
  var notesList = document.getElementById("notes-list");

  // Load existing notes from storage
  chrome.storage.sync.get("notes", function (result) {
    var notes = result.notes || [];
    renderNotes(notes);
  });

  // Save the note when the save button is clicked
  saveButton.addEventListener("click", function () {
    var VidName = vidNameInput.value;
    var timestamp = timestampInput.value;
    var description = descriptionInput.value;

    // Get the current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var tab = tabs[0];
      var videoUrl = tab.url;

      var note = {
        VidName: VidName,
        timestamp: timestamp,
        description: description,
        videoUrl: videoUrl,
      };

      // Retrieve existing notes from storage
      chrome.storage.sync.get("notes", function (result) {
        var notes = result.notes || [];

        // Add the new note
        notes.push(note);

        // Save the updated notes array
        chrome.storage.sync.set({ notes: notes }, function () {
          // Clear the input fields
          vidNameInput.value = "";
          timestampInput.value = "";
          descriptionInput.value = "";

          // Render the updated notes
          renderNotes(notes);
        });
      });
    });
  });

  clearButton.addEventListener("click", function () {
    // Clear the notes from storage
    chrome.storage.sync.set({ notes: [] }, function () {
      // Clear the displayed notes
      notesList.innerHTML = "";
    });
  });

  // Delete a note when clicking on it
  notesList.addEventListener("click", function (event) {
    var target = event.target;
    var listItem = target.closest("li");
    if (listItem) {
      var videoUrl = listItem.getAttribute("data-video-url");
      var timestamp = listItem.getAttribute("data-timestamp");

      // Open the video URL with the timestamp in a new tab
      window.open(videoUrl + "&t=" + timestamp);
    }
  });

  // Delete a note when right-clicking on it
  notesList.addEventListener("contextmenu", function (event) {
    event.preventDefault();
    var target = event.target;
    var listItem = target.closest("li");
    if (listItem) {
      var videoUrl = listItem.getAttribute("data-video-url");
      var timestamp = listItem.getAttribute("data-timestamp");

      // Remove the note from storage
      chrome.storage.sync.get("notes", function (result) {
        var notes = result.notes || [];
        var updatedNotes = notes.filter(function (note) {
          return note.videoUrl !== videoUrl || note.timestamp !== timestamp;
        });

        // Save the updated notes array
        chrome.storage.sync.set({ notes: updatedNotes }, function () {
          // Render the updated notes
          renderNotes(updatedNotes);
        });
      });
    }
  });

  // Render the list of notes
  function renderNotes(notes) {
    notesList.innerHTML = "";

    for (var i = 0; i < notes.length; i++) {
      var note = notes[i];

      var listItem = document.createElement("li");
      listItem.setAttribute("data-vidName", note.VidName);
      listItem.setAttribute("data-video-url", note.videoUrl);
      listItem.setAttribute("data-timestamp", note.timestamp);

      var VidNameSpan = document.createElement("span");
      var timestampSpan = document.createElement("span");
      var descriptionSpan = document.createElement("span");

      VidNameSpan.textContent = note.VidName;
      timestampSpan.textContent = note.timestamp;
      timestampSpan.className = "timestamp";
      descriptionSpan.textContent = note.description;

      listItem.appendChild(VidNameSpan);
      listItem.appendChild(timestampSpan);
      listItem.appendChild(descriptionSpan);

      notesList.appendChild(listItem);
    }
  }
});
