// This background script listens for messages and handles the authentication.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startGoogleAuth") {
    console.log("Starting Google authentication...");

    // Using chrome.identity API to handle the login
    chrome.identity.launchWebAuthFlow(
      {
        url: "https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=https://YOUR_EXTENSION_ID.chromiumapp.org/&response_type=code&scope=email",
        interactive: true,
      },
      function (responseUrl) {
        if (chrome.runtime.lastError) {
          sendResponse({
            success: false,
            error: chrome.runtime.lastError.message,
          });
        } else {
          const code = extractCodeFromUrl(responseUrl); // Assuming extractCodeFromUrl is defined elsewhere

          // Send this code to your backend for token exchange
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
                sendResponse({ success: true, data });
              });
            })
            .catch((error) => sendResponse({ success: false, error }));
        }
      }
    );

    return true; // Keep the message channel open for async sendResponse
  }
});
