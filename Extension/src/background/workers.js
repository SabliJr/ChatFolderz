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

  // Return both tokens as an object to send it to the backend to request uer info from google
  return { idToken, accessToken };
}

// Setting cookies to the browser
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "setCookie") {
    const { accessToken, userId, userName } = request.data;

    // Set access token cookie
    chrome.cookies.set(
      {
        url: "http://localhost:8000", // Your backend URL
        name: "accessToken",
        value: accessToken,
        path: "/",
        secure: true,
        sameSite: "lax",
        expirationDate: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours from now
      },
      (cookie) => {
        if (chrome.runtime.lastError) {
          console.error("Error setting cookie:", chrome.runtime.lastError);
        } else {
          console.log("Cookie set successfully:", cookie);
        }
      }
    );

    // You might want to set additional cookies for user info
    chrome.cookies.set({
      url: "http://localhost:8000",
      name: "userId",
      value: userId,
      path: "/",
      secure: true,
      sameSite: "lax",
      expirationDate: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    });

    sendResponse({ success: true });
  }

  //We need to return true to keep the message channel open for async response
  return true;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "buyMonthlySub") {
    fetch(
      "http://localhost:8000/api/check_out/monthly?price_id=price_1Q7YkdDuxNnSWA1yHJJdd7ih",
      {
        method: "GET",
        credentials: "include", // This to include the cookies
      }
    )
      .then((response) => response.json())
      .then((data) => {
        sendResponse({ success: true, data });
      })
      .catch((error) => sendResponse({ success: false, error: error.message }));

    //We need to return true to keep the message channel open for async response
    return true;
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "buyYearlySub") {
    fetch(
      "http://localhost:8000/api/check_out/yearly?price_id=price_1Q67qNDuxNnSWA1yxkChsg6G",
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        sendResponse({ success: true, data });
      })
      .catch((error) => sendResponse({ success: false, error: error.message }));

    return true;
  }
});

// Helper function to get cookies for API requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCookies") {
    chrome.cookies.getAll({ url: "http://localhost:8000" }, (cookies) => {
      sendResponse({ cookies });
    });
    return true;
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCredentials") {
    fetch("http://localhost:8000/api/get_credentials", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        sendResponse({ success: true, data });
      })
      .catch((error) => sendResponse({ success: false, error: error.message }));

    return true;
  }
});

// apiUtils.js
// export const makeAuthenticatedRequest = async (endpoint, options = {}) => {
//   try {
//     // Get cookies from background script
//     const cookiesResponse = await new Promise((resolve) => {
//       chrome.runtime.sendMessage({ action: "getCookies" }, resolve);
//     });

//     const { cookies } = cookiesResponse;
//     const accessToken = cookies.find(
//       (cookie) => cookie.name === "accessToken"
//     )?.value;

//     if (!accessToken) {
//       throw new Error("No access token found");
//     }

//     const headers = {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//       ...options.headers,
//     };

//     const response = await fetch(`http://localhost:8000${endpoint}`, {
//       ...options,
//       headers,
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("API request failed:", error);
//     throw error;
//   }
// };

// export const updateUserProfile = async (data) => {
//   return makeAuthenticatedRequest("/api/user/profile", {
//     method: "PUT",
//     body: JSON.stringify(data),
//   });
// };