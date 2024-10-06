let signUpBtn = document.createElement("button");
signUpBtn.innerText = "Account Access";
signUpBtn.id = "_chat_folderz_signUP_btn";

 let sidebar = document.createElement("div");
 sidebar.classList.add("_account_sidebar");

 let sidebarTitle = document.createElement("h2");
 sidebarTitle.innerText = "Hey, welcome to your ChatFolderz account panel.";
 sidebarTitle.classList.add("_sidebar_title");

 let sidebarText = document.createElement("p");
 sidebarText.innerText =
   "Organize, search, and bookmark your AI conversations with ease.";
 sidebarText.classList.add("_sidebar_text");

 let sideHeaderTextSpan = document.createElement("span");
 sideHeaderTextSpan.classList.add("_sidebar_header_text_span");

 // The close Icon
 let closeIcon = document.createElement("img");
 closeIcon.src = chrome.runtime.getURL("../../images/cross.png");
 closeIcon.alt = "Close Icon";
 closeIcon.classList.add("_sidebar_close_icon");

 let trialInfoHTML = `
      <h3>Unlock Full Access – Start Your Free 24-Hour Trial!</h3>
      <div>
        <p>After your trial, enjoy full access for:</p>
        <ol>
          <li>$7.99/month</li>
          <li>$6.39/month (billed annually at $76.70)</li>
        </ol>
        <h5>No commitment, cancel anytime during your trial if it’s not for you!</h5>
      </div>
  `;

 let monthlySub = document.createElement("button");
 monthlySub.innerText = "Monthly";
 monthlySub.classList.add("_monthly_sub_btn");

 let yearlySub = document.createElement("button");
 yearlySub.innerText = "Yearly";
 yearlySub.classList.add("_yearly_btn");

 let cancelSub = document.createElement("button");
 cancelSub.innerText = "Cancel Subscription";
 cancelSub.classList.add("_cancel_sub_btn");

 let onCreateGoogleLoginBtn = () => {
   let loginDiv = document.createElement("div");
   loginDiv.classList.add("_login_div");

   closeIcon.addEventListener("click", () => {
     sidebar.classList.remove("_visible_side");
   });

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
   loginDiv.appendChild(loginText);
   loginDiv.appendChild(loginBtn);

   loginBtn.addEventListener("click", () => {
     console.log("Requesting Google login via background");
     chrome.runtime.sendMessage({ action: "startGoogleAuth" }, (response) => {
       console.log("The res: ", response);
       if (response?.success) {
         console.log("Google login success:", response?.data);

         // Extract tokens from the response data
         const { idToken, accessToken } = response.data;

         // Set the cookies
         document.cookie = `idToken=${idToken}; path=/; secure; SameSite=Lax`;
         document.cookie = `accessToken=${accessToken}; path=/; secure; SameSite=Lax`;

         console.log("Cookies set successfully");
       } else {
         console.error("Google login failed:", response?.error);
       }
     });
   });

   // Create a container div and set its innerHTML
   let trialInfoDiv = document.createElement("div");
   trialInfoDiv.innerHTML = trialInfoHTML;

   return loginDiv;
 };

 sidebar.appendChild(closeIcon);
 sideHeaderTextSpan.appendChild(sidebarTitle);
 sideHeaderTextSpan.appendChild(sidebarText);
 sidebar.appendChild(sideHeaderTextSpan);
 sidebar.appendChild(onCreateGoogleLoginBtn());

 // more_content.js
 const onAccountAccess = () => {
   sidebar.classList.add("_visible_side");
 };

 const onInitAccountAccess = () => {
   document.body.appendChild(sidebar);
   document.body.appendChild(signUpBtn);

   signUpBtn.addEventListener("click", () => {
     onAccountAccess();
   });
 };

 onInitAccountAccess();
setInterval(onInitAccountAccess, 2000);
