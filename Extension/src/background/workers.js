// Background script handling Google login and sending the response back to content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Req: ", request);
  console.log("The sender: ", sender);

  if (request.action === "startGoogleAuth") {
    console.log("Starting Google authentication...");

    chrome.identity.launchWebAuthFlow(
      {
        url: "https://accounts.google.com/o/oauth2/auth?client_id=224804471957-5otlq9u8e79v5fau5do5cvt5v4fbddm0.apps.googleusercontent.com&redirect_uri=https://bpceolnipigdieihfbbdfmfonnpmilfn.chromiumapp.org/&response_type=code&scope=email",
        interactive: true,
      },
      function (responseUrl) {
        if (chrome.runtime.lastError) {
          // Send an error response to the content script
          sendResponse({
            success: false,
            error: chrome.runtime.lastError.message,
          });
        } else {
          const code = extractCodeFromUrl(responseUrl); // Make sure this function is defined

          // Send the code to your backend for token exchange
          fetch("http://localhost:8000/api/auth/google", {
            method: "POST",
            body: JSON.stringify({ code }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              chrome.storage.sync.set({ accessToken: data.accessToken }, () => {
                // Send success response with access token to content script
                sendResponse({ success: true, data });
              });
            })
            .catch((error) => {
              sendResponse({ success: false, error: error.message });
            });
        }
      }
    );

    return true; // Ensure the message port stays open for async response
  }
});
