const config = {
  development: {
    fetchUrl: "http://localhost:8000",
    REDIRECT_URI: "https://bmnpndlhkakekmejcnnmingbehdgjboc.chromiumapp.org",
  },
  production: {
    fetchUrl: "https://www.api.chatfolderz.com",
    REDIRECT_URI: "https://ibelppoiheipgceppgklepmjcafbdcdm.chromiumapp.org",
  },
};

const manifest = chrome.runtime.getManifest();
const isDevelopment = !("update_url" in manifest);

const fetchUrl = isDevelopment
  ? config.development.fetchUrl
  : config.production.fetchUrl;

let REDIRECT_URI = isDevelopment
  ? config.development.REDIRECT_URI
  : config.production.REDIRECT_URI;

/// Frontend: Update the scope to include the required fields
const SCOPE = encodeURIComponent("profile email openid");
let RESPONSE_TYPE = "token id_token";
let CLIENT_ID =
  "556107610850-u13jqk0qes93aee3l9vmovfcmvrlhl4m.apps.googleusercontent.com";

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
          fetch(`${fetchUrl}/auth/google`, {
            method: "POST",
            body: JSON.stringify(tokens),
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

    return true;
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
    const { accessToken, userId } = request.data;

    // Set access token cookie
    chrome.cookies.set({
      url: `${fetchUrl}`, // Your backend URL
      name: "accessToken",
      value: accessToken,
      path: "/",
      secure: true,
      sameSite: "lax",
      expirationDate: Math.floor(Date.now() / 1000) + 20 * 60 * 60,
    });

    // You might want to set additional cookies for user info
    chrome.cookies.set({
      url: `${fetchUrl}`,
      name: "userId",
      value: userId,
      path: "/",
      secure: true,
      sameSite: "lax",
      expirationDate: Math.floor(Date.now() / 1000) + 20 * 60 * 60,
    });

    sendResponse({ success: true });
  }

  //We need to return true to keep the message channel open for async response
  return true;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "buySubscription") {
    const { price_id } = request; // Get the price_id from the message

    fetch(`${fetchUrl}/check_out?price_id=${price_id}`, {
      method: "GET",
      credentials: "include", // This to include the cookies
    })
      .then((response) => response.json())
      .then((data) => {
        sendResponse({ success: true, data });
      })
      .catch((error) => sendResponse({ success: false, error: error.message }));

    // We need to return true to keep the message channel open for async response
    return true;
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "payOneTime") {
    const { price_id } = request; // Get the price_id from the message

    fetch(`${fetchUrl}/check_out_onetime?price_id=${price_id}`, {
      method: "GET",
      credentials: "include", // This to include the cookies
    })
      .then((response) => response.json())
      .then((data) => {
        sendResponse({ success: true, data });
      })
      .catch((error) => sendResponse({ success: false, error: error.message }));

    // We need to return true to keep the message channel open for async response
    return true;
  }
});

// Helper function to get cookies for API requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCookies") {
    chrome.cookies.getAll({ url: `${fetchUrl}` }, (cookies) => {
      sendResponse({ cookies });
    });
    return true;
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCredentials") {
    fetch(`${fetchUrl}/get_credentials`, {
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "cancelSubscription") {
    chrome.storage.local.get(["customerId"], (result) => {
      const { customerId } = result;

      fetch(`${fetchUrl}/cancel_subscription?customer_id=${customerId}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          sendResponse({ success: true, data });
        })
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );

      return true;
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  fetch(`${fetchUrl}/get_credentials`, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      let { customer_id, user_has_payed, user_id, has_access } = data.user;
      chrome.storage.local.set(
        {
          isLoggedIn: true,
          userId: user_id,
          customerId: customer_id,
          hasAccess: has_access,
          userHasPayed: user_has_payed,
        },
        () => {
          // Send a message to the content script indicating that the data is set
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "dataSet" });
          });
        }
      );
    })
    .catch((error) => console.error("Err getting credentials"));
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "onStoreFolder") {
    let { folderData } = request;
    console.log(folderData);

    fetch(`${fetchUrl}/store_folder`, {
      method: "POST",
      body: JSON.stringify(folderData),
      headers: {
        "Content-Type": "application/json",
      },
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "onGetUserFolderz") {
    fetch(`${fetchUrl}/get_user_folders`, {
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "onDeleteFolder") {
    let { folderId } = request;

    fetch(`${fetchUrl}/delete_folder?folder_id=${folderId}`, {
      method: "DELETE",
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "onEditFolder") {
    let { folderData } = request;

    fetch(`${fetchUrl}/edit_folder`, {
      method: "PUT",
      body: JSON.stringify(folderData),
      headers: {
        "Content-Type": "application/json",
      },
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "onAddChat") {
    fetch(`${fetchUrl}/add_chat`, {
      method: "POST",
      body: JSON.stringify(tokens),
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "onRemoveChat") {
    fetch(`${fetchUrl}/remove_chat`, {
      method: "POST",
      body: JSON.stringify(tokens),
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
