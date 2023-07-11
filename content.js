// Inject the script into the video page
(function () {
  // Check if the page has a video element
  var video = document.querySelector("video");
  if (!video) return;

  // Listen for keyframe creation events from the popup
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.action === "createKeyframe") {
      var VidName = request.VidName;
      var currentTime = Math.floor(video.currentTime);
      var description = request.description;

      // Do something with the timestamp and description, e.g., save to storage
      // ...
    }
  });
})();
