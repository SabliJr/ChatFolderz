// Background script handling Google login and sending the response back to content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Req: ", request);
  console.log("The sender: ", sender);

  if (request.action === "startGoogleAuth") {
    console.log("Starting Google authentication...");

    chrome.identity.launchWebAuthFlow(
      {
        url: "https://accounts.google.com/o/oauth2/auth?client_id=556107610850-u13jqk0qes93aee3l9vmovfcmvrlhl4m.apps.googleusercontent.com&response_type=id_token&scope=openid email profile&redirect_uri=https://bmnpndlhkakekmejcnnmingbehdgjboc.chromiumapp.org&prompt=consent",
        interactive: true,
      },
      function (responseUrl) {
        if (chrome.runtime.lastError) {
          sendResponse({
            success: false,
            error: chrome.runtime.lastError.message,
          });
        } else {
          const idToken = extractIdTokenFromUrl(responseUrl);
          console.log("ID token: ", idToken);
          // Send the ID token to your backend for verification
          fetch("http://localhost:8000/api/auth/google", {
            method: "POST",
            body: JSON.stringify({ token: idToken }),
            headers: { "Content-Type": "application/json" },
          })
            .then((response) => response.json())
            .then((data) => sendResponse({ success: true, data }))
            .catch((error) =>
              sendResponse({ success: false, error: error.message })
            );
        }
      }
    );

    return true; // Ensure the message port stays open for async response
  }
});

// Helper function to extract the access token from the URL
function extractIdTokenFromUrl(url) {
  const params = new URLSearchParams(new URL(url).hash.substring(1));
  return params.get("id_token"); // Ensure you're extracting 'id_token'
}

// const oauthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&response_type=id_token&scope=openid email profile&redirect_uri=YOUR_REDIRECT_URI&prompt=consent`;
