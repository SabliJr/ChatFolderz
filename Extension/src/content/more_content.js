const config = {
  development: {
    Monthly: "price_1Q7umiDuxNnSWA1yOR9XCzOz",
    Yearly: "price_1Q7unWDuxNnSWA1yxvQ2N4Rv",
    SuperPlan: "price_1QACaODuxNnSWA1yy7ssX7uL",
    PowerPlan: "price_1QCiRMDuxNnSWA1yIYmPtLGc",
  },
  production: {
    Monthly: "price_1Q8i7yDuxNnSWA1yhv1Vn8UN",
    Yearly: "price_1Q8i7tDuxNnSWA1yrIYPqFbl",
    SuperPlan: "price_1QCqJYDuxNnSWA1yEcV2HgKO",
    PowerPlan: "price_1QCqJNDuxNnSWA1yQ13PTAhI",
  },
};

const manifest = chrome.runtime.getManifest();
const isDevelopment = !("update_url" in manifest);

const yearlyPriceId = isDevelopment
  ? config.development.Yearly
  : config.production.Yearly;

const monthlyPriceId = isDevelopment
  ? config.development.Monthly
  : config.production.Monthly;

const powerPlanPriceId = isDevelopment
  ? config.development.PowerPlan
  : config.production.PowerPlan;

const superPlanPriceId = isDevelopment
  ? config.development.SuperPlan
  : config.production.SuperPlan;

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

// more_content.js;
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
        const { user_id } = response.data.user;

        try {
          // Set cookie in background script
          await chrome.runtime.sendMessage({
            action: "setCookie",
            data: {
              accessToken,
              userId: user_id,
            },
          });

          await chrome.storage.local.set({
            isLoggedIn: true,
            userId: user_id,
          });

          displayUI();
        } catch (error) {
          console.error("Error setting cookies");
        }
      } else {
        console.error("Google login failed");
      }
    }
  );
};

const onBuySub = (price_id) => {
  chrome.runtime.sendMessage(
    { action: "buySubscription", price_id },
    async (response) => {
      if (response?.success) {
        let { id, url } = response.data;
        window.open(url, "_blank");
      } else {
        console.error("Getting a payment link has failed");
      }
    }
  );
};

const onBuyOneTime = (price_id) => {
  chrome.runtime.sendMessage(
    { action: "payOneTime", price_id },
    async (response) => {
      if (response?.success) {
        // let { id, url } = response.data;
        console.log("The payment capture was successful");

        // window.open(url, "_blank");
      } else {
        console.error("Getting a payment link has failed");
      }
    }
  );
};

let onCollectPayment = () => {
  let collectMoneyContainer = document.createElement("div");
  collectMoneyContainer.classList.add("_collect_money_container");

  let trialInfoHTML = `
    <h3 class="_collect_money_title">Unlock The Full Access!</h3>
    <p class="_prices_last_title">Try it free for 24 hours—if it’s not for you, cancel anytime. No commitment, just smarter AI chat management.</p>
    <div class="_prices_container">
      <p class="_collect_pricing_title">After your trial, enjoy full access for:</p>
      <ul class="_ul_prices">
        <li>$7.99 /month</li>
        <li>$76.70 /Yearly</li>
        <li>$129.99 /One time</li>
        <li>$349.99 /One time—unlimited</li>
      </ul>
    </div>
    <p class="_payment_notice">Please use the same email you used to create your account when making your payment on Stripe to ensure uninterrupted access to our services.</p>
  `;

  let monthlySub = document.createElement("button");
  monthlySub.innerText = "Monthly";
  monthlySub.classList.add("_monthly_sub_btn");

  let yearlySub = document.createElement("button");
  yearlySub.innerText = "Yearly";
  yearlySub.classList.add("_monthly_sub_btn");

  let powerPlanBtn = document.createElement("button");
  powerPlanBtn.innerText = "Power Plan";
  powerPlanBtn.classList.add("_monthly_sub_btn");

  let superPlanBtn = document.createElement("button");
  superPlanBtn.innerText = "Super Plan—unlimited";
  superPlanBtn.classList.add("_yearly_btn");

  let btnsSpan = document.createElement("span");
  btnsSpan.classList.add("_payment_btns_span");

  btnsSpan.appendChild(monthlySub);
  btnsSpan.appendChild(yearlySub);
  btnsSpan.appendChild(powerPlanBtn);
  btnsSpan.appendChild(superPlanBtn);
  collectMoneyContainer.innerHTML = trialInfoHTML;
  collectMoneyContainer.appendChild(btnsSpan);

  yearlySub.addEventListener("click", () => {
    onBuySub(yearlyPriceId);
  });

  monthlySub.addEventListener("click", () => {
    onBuySub(monthlyPriceId);
  });

  powerPlanBtn.addEventListener("click", () => {
    onBuyOneTime(powerPlanPriceId);
  });

  superPlanBtn.addEventListener("click", () => {
    onBuyOneTime(superPlanPriceId);
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

  let manageUi = `
    <div class="_manage_ui_container">
     <div class="_manage_text_container">
        <h2 class="_manage_title">Welcome Aboard! 🎉</h2>
        <p class="_manage_text">
          Your subscription is active, and your AI chat manager is ready to go!
          Start organizing, bookmarking, and searching through your
          conversations effortlessly.
        </p>
      </div>
      <div class="_manage_list">
        <p>- Organize Chats into Folders</p>
        <p>- Bookmark Key Conversations</p>
        <p>- Search Your Conversations Easily</p>
      </div>
      <div class="_manage_user_ask">
        <p class="_manage_ask_text">
          Got ideas? We’d love to hear your thoughts! Suggest new features and
          help shape the future of this extension.
        </p>
        <p class="_manage_suggest_btn">
          <span class="_manage_suggest_span">Submit</span> a Feature Suggestion, Your Feedback Is Valuable!
        </p>
        <span class="_cancel_sub_btn_span">
          <button class="_cancel_sub_btn">Cancel Subscription</button>
          <p class="_cancel_sub_btn_span_text">– No commitment, cancel anytime.</p>
        </span>
      </div>
      <p class="_manage_thank_text">Thanks for joining us—exciting updates are on the way!</p>
    </div>
  `;

  manageAccountContainer.innerHTML = manageUi;

  chrome.storage.local.get(["isCanceled"], (result) => {
    const { isCanceled } = result;

    if (isCanceled) {
      let removeCancelBtn = manageAccountContainer.querySelector(
        "._cancel_sub_btn_span"
      );

      removeCancelBtn.remove();
    } else {
      let cancelSubBtn =
        manageAccountContainer.querySelector("._cancel_sub_btn");
      cancelSubBtn.addEventListener("click", () => {
        onCancelSubscription();
      });
    }
  });

  return manageAccountContainer;
};

const onCancelSubscription = () => {
  chrome.runtime.sendMessage(
    { action: "cancelSubscription" },
    async (response) => {
      if (response?.success) {
        let { is_canceled, accessTime } = response.data;

        // Update the storage and remove the
        await chrome.storage.local.set({
          isCanceled: is_canceled,
        });

        alert(
          `Your subscription was canceled successfully, you have access till ${accessTime}`
        );
      } else {
        alert(`${response.error.message}`);
      }
    }
  );
};

const displayUI = () => {
  // Retrieve and log data asynchronously
  chrome.storage.local.get(
    ["isLoggedIn", "userId", "customerId", "hasAccess", "userHasPayed"],
    (result) => {
      const { isLoggedIn, userId, customerId, hasAccess, userHasPayed } =
        result;

      // Clear the sidebar content before updating UI
      sidebar.innerHTML = "";

      if (isLoggedIn && userId && !userHasPayed) {
        // User is logged in but has not made payment
        sidebar.appendChild(onCollectPayment());
      } else if (!isLoggedIn && !userId && !customerId && !hasAccess) {
        // User is not logged in
        sidebar.appendChild(onWelcomeShowAuth());
      } else if (
        isLoggedIn &&
        userId &&
        customerId &&
        hasAccess &&
        userHasPayed
      ) {
        // User is logged in and has made payment
        sidebar.appendChild(onManageAccount());
      } else if (
        isLoggedIn &&
        userId &&
        customerId &&
        !hasAccess &&
        !userHasPayed
      ) {
        sidebar.appendChild(onCollectPayment());
      }
    }
  );
};

// Listen for changes in chrome.storage.local
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local") {
    // Check if any of the keys you're interested in have changed
    if (
      changes.isLoggedIn ||
      changes.userId ||
      changes.customerId ||
      changes.hasAccess ||
      changes.userHasPayed ||
      changes.isCanceled
    ) {
      // Update the UI based on the new values
      displayUI();
    }
  }
});

function onGetCredentials() {
  chrome.runtime.sendMessage({ action: "getCredentials" }, async (response) => {
    try {
      if (response?.success) {
        let { user_has_payed, has_access, customer_id, user_id, is_canceled } =
          response.data.user;

        // Update the storage with the new user_data object
        await chrome.storage.local.set({
          customerId: customer_id,
          hasAccess: has_access,
          userHasPayed: user_has_payed,
          isLoggedIn: true,
          userId: user_id,
          isCanceled: is_canceled,
        });
      } else {
        await chrome.storage.local.remove([
          "customerId",
          "hasAccess",
          "userHasPayed",
          "isLoggedIn",
          "userId",
          "isCanceled",
        ]);
      }
    } catch (error) {
      await chrome.storage.local.remove([
        "customerId",
        "hasAccess",
        "userHasPayed",
        "isLoggedIn",
        "userId",
        "isCanceled",
      ]);
    }
  });
}

const onInitAccountAccess = () => {
  sidebar.appendChild(closeIcon);

  document.body.appendChild(sidebar);
  document.body.appendChild(signUpBtn);

  // Open the sidebar module
  signUpBtn.addEventListener("click", () => {
    onAccountAccess();
  });

  // Close the sidebar module
  closeIcon.addEventListener("click", () => {
    sidebar.classList.remove("_visible_side");
  });
};

window.addEventListener("load", () => {
  displayUI(); // Call UI update on load
  onInitAccountAccess();
  onGetCredentials();

  setInterval(onInitAccountAccess, 2000); // Calling this every 2s because the openAI's website is an SPA.
  // setInterval(onGetCredentials, 2000); // Call this function every 3ms to go get the user credentials

  // Load the chat ann folders only if the user is loggedIn
  chrome.storage.local.get(["isLoggedIn", "userId"], (result) => {
    let { userId, isLoggedIn } = result;

    if (userId && isLoggedIn) {
      setInterval(onGetCredentials, 2000);
    }
  });
});
