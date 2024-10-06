/// Frontend: Update the scope to include the required fields
const SCOPE = encodeURIComponent("profile email openid"); //openid
let CLIENT_ID =
  "556107610850-u13jqk0qes93aee3l9vmovfcmvrlhl4m.apps.googleusercontent.com";
let REDIRECT_URI = "https://bmnpndlhkakekmejcnnmingbehdgjboc.chromiumapp.org";
let RESPONSE_TYPE = "token id_token";

// Background script handling Google login and sending the response back to content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startGoogleAuth") {
    chrome.identity.launchWebAuthFlow(
      {
        url: `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&response_type=${encodeURIComponent(
          RESPONSE_TYPE
        )}&redirect_uri=${encodeURIComponent(
          REDIRECT_URI
        )}&prompt=consent&scope=openid+email+profile`,
        interactive: true,
      },
      function (responseUrl) {
        if (chrome.runtime.lastError) {
          sendResponse({
            success: false,
            error: chrome.runtime.lastError.message,
          });
        } else {
          const tokens = extractTokensFromUrl(responseUrl);

          // Send the tokens to your backend for verification
          fetch("http://localhost:8000/api/auth/google", {
            method: "POST",
            body: JSON.stringify(tokens), // Send both tokens
            headers: { "Content-Type": "application/json" },
          })
            .then((response) => response.json())
            .then((data) => {
              sendResponse({ success: true, data }); // Send tokens in response
            })
            .catch((error) =>
              sendResponse({ success: false, error: error.message })
            );
        }
      }
    );

    return true; // Ensure the message port stays open for async response
  }
});

// Helper function to extract the ID token and access token from the URL
function extractTokensFromUrl(url) {
  const params = new URLSearchParams(new URL(url).hash.substring(1));
  const idToken = params.get("id_token");
  const accessToken = params.get("access_token");

  return { idToken, accessToken }; // Return both tokens as an object
}
