chrome.runtime.sendMessage("message from the content script", (response) => {
  console.log(response);
});
