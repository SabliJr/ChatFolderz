let signUpBtn = document.createElement("button");
signUpBtn.innerText = "Account Access";
signUpBtn.id = "_chat_folderz_signUP_btn";

 let sidebar = document.createElement("div");
 sidebar.classList.add("_account_sidebar");

 let sidebarTitle = document.createElement("h2");
 sidebarTitle.innerText = "Hey, welcome to your ChatFolderz account panel.";
 sidebarTitle.classList.add("_sidebar_title");

 let sidebarText = document.createElement("p");
 sidebarText.innerText = "Your Best AI Chat Management Extension";
 sidebarText.classList.add("_sidebar_text");

 let sideHeaderTextSpan = document.createElement("span");
 sideHeaderTextSpan.classList.add("_sidebar_header_text_span");

 let onCreateGoogleLoginBtn = () => {
   let loginDiv = document.createElement("div");
   loginDiv.classList.add("_login_div");

   let googleIcon = document.createElement("img");
   googleIcon.src = chrome.runtime.getURL("../../images/google.png");
   googleIcon.classList.add("_google_login_icon");

   let laBtn = document.createElement("button");
   laBtn.innerText = "Sign Up With google";
   laBtn.classList.add("_login_with_google_btn");

   loginDiv.appendChild(googleIcon);
   loginDiv.appendChild(laBtn);

   loginDiv.addEventListener("click", () => {
     console.log("Requesting Google login via background");
     chrome.runtime.sendMessage({ action: "startGoogleAuth" }, (response) => {
       console.log("The res: ", response);
       if (response?.success) {
         console.log("Google login success:", response?.data);
       } else {
         console.error("Google login failed:", response?.error);
       }
     });
   });

   return loginDiv;
 };

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
