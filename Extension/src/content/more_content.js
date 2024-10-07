// Example of making an authenticated API request
// import { makeAuthenticatedRequest } from "./apiUtils.js";

let signUpBtn = document.createElement("button");
signUpBtn.innerText = "Account Access";
signUpBtn.id = "_chat_folderz_signUP_btn";

let sidebar = document.createElement("div");
sidebar.classList.add("_account_sidebar");

// The close Icon
let closeIcon = document.createElement("img");
closeIcon.src = chrome.runtime.getURL("../../images/cross.png");
closeIcon.alt = "Close Icon";
closeIcon.classList.add("_sidebar_close_icon");

// more_content.js
const onAccountAccess = () => {
  sidebar.classList.add("_visible_side");
};

// content.js or your login handling file
const handleLogin = () => {
  chrome.runtime.sendMessage(
    { action: "startGoogleAuth" },
    async (response) => {
      if (response?.success) {
        const { accessToken } = response.data;
        const { user_id, user_name, customer_id } = response.data.user;

        try {
          // Set cookie in background script
          await chrome.runtime.sendMessage({
            action: "setCookie",
            data: {
              accessToken,
              userId: user_id,
              userName: user_name,
            },
          });

          // Optionally store some data in chrome.storage for easy access
          await chrome.storage.local.set({
            isLoggedIn: true,
            userId: user_id,
            userName: user_name,
            customer_id: customer_id,
          });

          displayUI();
        } catch (error) {
          console.error("Error setting cookies:", error);
        }
      } else {
        console.error("Google login failed:", response?.error);
      }
    }
  );
};

const onSubForYear = () => {
  chrome.runtime.sendMessage({ action: "buyYearlySub" }, async (response) => {
    if (response?.success) {
      let { id, url } = response.data;

      window.open(url, "_blank");
    } else {
      console.log("Getting a payment link has failed: ", response?.error);
    }
  });
};

const onSubForMonth = () => {
  chrome.runtime.sendMessage({ action: "buyMonthlySub" }, async (response) => {
    if (response?.success) {
      let { id, url } = response.data;

      window.open(url, "_blank");
    } else {
      console.log("Getting a payment link has failed: ", response?.error);
    }
  });
};

// const fetchData = async () => {
//   try {
//     const data = await makeAuthenticatedRequest('/api/some-endpoint');
//     console.log('Data received:', data);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// };

let onCollectPayment = () => {
  let collectMoneyContainer = document.createElement("div");
  collectMoneyContainer.classList.add("_collect_money_container");

  let trialInfoHTML = `
      <h3 class="_collect_money_title">Unlock Full Access – Start Your Free 24-Hour Trial!</h3>
      <div class="_prices_container">
        <p class="_collect_pricing_title">After your trial, enjoy full access for:</p>
        <ul class="_ul_prices">
          <li>$7.99/month</li>
          <li>$6.39/month (billed annually at $76.70)</li>
        </ul>
        </div>
        <h5 class="_prices_last_title">No commitment, cancel anytime during your trial if it’s not for you!</h5>
  `;

  let monthlySub = document.createElement("button");
  monthlySub.innerText = "Monthly";
  monthlySub.classList.add("_monthly_sub_btn");

  let yearlySub = document.createElement("button");
  yearlySub.innerText = "Yearly";
  yearlySub.classList.add("_yearly_btn");

  let btnsSpan = document.createElement("span");
  btnsSpan.classList.add("_payment_btns_span");

  btnsSpan.appendChild(monthlySub);
  btnsSpan.appendChild(yearlySub);
  collectMoneyContainer.innerHTML = trialInfoHTML;
  collectMoneyContainer.appendChild(btnsSpan);

  yearlySub.addEventListener("click", () => {
    console.log("You are clicking the yearly one");
    onSubForYear();
  });

  monthlySub.addEventListener("click", () => {
    console.log("You are clicking the monthly one");

    onSubForMonth();
  });

  return collectMoneyContainer;
};

let onWelcomeShowAuth = () => {
  let welcomeContainer = document.createElement("div");
  welcomeContainer.classList.add("_welcome_login_container");

  let welcomeTitle = `
  <h2 class="_welcome_title">Hey, welcome to your ChatFolderz account panel.</h2>
   <p class="_welcome_text">Organize, search, and bookmark your AI conversations with ease.</p>
  `;

  let googleIcon = document.createElement("img");
  googleIcon.src = chrome.runtime.getURL("../../images/google.png");
  googleIcon.classList.add("_google_login_icon");

  let laBtn = document.createElement("button");
  laBtn.innerText = "Sign Up With google";
  laBtn.classList.add("_login_with_google_btn");

  let loginText = document.createElement("p");
  loginText.innerText = "Sign up or log in to get started!";
  loginText.classList.add("_login_text");

  let loginBtn = document.createElement("span");
  loginBtn.classList.add("_login_btn");

  loginBtn.appendChild(googleIcon);
  loginBtn.appendChild(laBtn);

  // onClick login the user
  loginBtn.addEventListener("click", () => {
    handleLogin();
  });

  welcomeContainer.innerHTML = welcomeTitle;
  welcomeContainer.appendChild(loginText);
  welcomeContainer.appendChild(loginBtn);

  return welcomeContainer;
};

let onManageAccount = () => {
  let manageAccountContainer = document.createElement("div");
  manageAccountContainer.classList.add("_manage_account_container");

  let cancelSub = document.createElement("button");
  cancelSub.innerText = "Cancel Subscription";
  cancelSub.classList.add("_cancel_sub_btn");

  manageAccountContainer.appendChild(cancelSub);

  return manageAccountContainer;
};

const displayUI = () => {
  // Retrieve and log data
  chrome.storage.local.get(
    ["isLoggedIn", "userId", "userName", "customer_id"],
    (result) => {
      console.log("Stored data:", result);
      const { isLoggedIn, userId, customer_id } = result;

      if (isLoggedIn && userId && !customer_id) {
        onWelcomeShowAuth().remove();

        sidebar.appendChild(onCollectPayment());
      } else if (!isLoggedIn && !userId && !customer_id) {
        onCollectPayment().remove();

        sidebar.appendChild(onWelcomeShowAuth());
      } else if (isLoggedIn && userId && customer_id) {
        onCollectPayment().remove();
        onWelcomeShowAuth().remove();

        sidebar.appendChild(onManageAccount());
      }
    }
  );
};

const onInitAccountAccess = () => {
  document.body.appendChild(sidebar);
  document.body.appendChild(signUpBtn);

  // Open the module
  signUpBtn.addEventListener("click", () => {
    onAccountAccess();
  });

  // Close the module
  closeIcon.addEventListener("click", () => {
    sidebar.classList.remove("_visible_side");
  });
};

window.addEventListener("load", () => {
  sidebar.appendChild(closeIcon);
  displayUI();

  onInitAccountAccess();
  setInterval(onInitAccountAccess, 2000);
});
