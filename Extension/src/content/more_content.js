let signUpBtn = document.createElement("button");
signUpBtn.innerText = "Account Access";
signUpBtn.id = "_chat_folderz_signUP_btn";

const onInitAccountAccess = () => {
  console.log("This one called");
  document.body.appendChild(signUpBtn);

  signUpBtn.addEventListener("click", () => {
    onAccountAccess();
  });
};

// more_content.js
const onAccountAccess = () => {
  console.log("You clicked on account access");
};

onInitAccountAccess();

setInterval(onInitAccountAccess, 2000);
