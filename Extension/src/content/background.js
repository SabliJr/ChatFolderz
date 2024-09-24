// {
//   "manifest_version": 3,
//   "name": "ChatFolderz",
//   "version": "0.1.1",
//   "description": "Boost productivity with our AI chat management tool. Organize your conversations into folders, search easily, and bookmark key chats for quick access.",
//   "homepage_url": "https://chatfolderz.com",
//   "permissions": ["storage", "unlimitedStorage", "activeTab"],
//   "host_permissions": ["https://chat.openai.com/*"],
//   "background": {
//     "service_worker": "./src/content/background.js"
//   },
//   "web_accessible_resources": [
//     {
//       "matches": ["https://chat.openai.com/*"],
//       "resources": ["images/*", "src/content/*"]
//     }
//   ],
//   "content_scripts": [
//     {
//       "matches": ["https://chat.openai.com/*"],
//       "js": ["./src/content/bg_worker.js"],
//       "run_at": "document_end"
//     }
//   ]
// }

// Function to load the HTML file and insert its content
function loadAndInsertHTML() {
  fetch("index.html")
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, "text/html");
      const searchContainer = doc.querySelector(".search-container");

      const searchInsert = document.querySelectorAll("nav div.flex-col.flex-1");
      for (let y = 0; y < searchInsert.length; y++) {
        let thirdChild = searchInsert[y].children[2];
        if (!thirdChild || !thirdChild.classList?.contains("search-bar")) {
          searchInsert[y].insertBefore(searchContainer, thirdChild);

          const inputEle = searchContainer.querySelector(".search-bar");
          inputEle.addEventListener("input", () => {
            let inputValue = inputEle.value;
            console.log(inputValue);
          });
        }
      }
    })
    .catch((error) => console.error("Error loading HTML:", error));
}

// The search bar icon
// const searchIcon = document.createElement("img");
// searchIcon.src = chrome.runtime.getURL("./images/magnifying-glass.png"); // Use chrome.runtime.getURL to get the correct path
// searchIcon.alt = "Search Icon";
// searchIcon.id = "search_icon"; // Set the id
// searchIcon.style.width = "16px"; // Adjust the size as needed
// searchIcon.style.height = "16px"; // Adjust the size as needed
// searchIcon.style.verticalAlign = "middle"; // Example: aligning vertically

// The search bar input
const inputEle = document.getElementsByClassName();
// inputEle.className = "search-bar";
inputEle.focus();

// Call the function to load and insert the HTML
loadAndInsertHTML();

let isDarkMode = false;

function addButtons(codeBlock) {
  if (codeBlock.dataset.buttonsAdded) return;

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "code-buttons";

  const previewBtn = createButton(
    "Preview Code",
    () => togglePreview(codeBlock.textContent),
    "preview-btn"
  );

  buttonsDiv.append(previewBtn);
  codeBlock.parentNode.insertBefore(buttonsDiv, codeBlock.nextSibling);
  codeBlock.dataset.buttonsAdded = "true";
}

function createButton(text, onClick, className = "") {
  const button = document.createElement("button");
  button.innerHTML = text;
  button.addEventListener("click", onClick);
  if (className) button.className = className;
  return button;
}

function pauseExecutionUntilClick(element) {
  function resumeExecution() {
    element.removeEventListener("click", resumeExecution);
    // Resume any paused execution here
  }

  element.addEventListener("click", resumeExecution);
}

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  applyDarkMode();
}

function applyDarkMode() {
  const previewContainer = document.getElementById("code-preview-container");
  if (previewContainer) {
    previewContainer.classList.toggle("dark-mode", isDarkMode);
    const darkModeToggle = previewContainer.querySelector(".dark-mode-toggle");
    darkModeToggle.textContent = isDarkMode ? "☀️" : "🌙";
  }
}

function updatePreview(code) {
  const previewContent = document.getElementById("code-preview-content");
  previewContent.srcdoc = code;
}

function makeResizable(element) {
  const resizer = document.createElement("div");
  resizer.className = "resizer";
  element.appendChild(resizer);

  let startX, startWidth;

  function startResize(e) {
    startX = e.clientX;
    startWidth = parseInt(
      document.defaultView.getComputedStyle(element).width,
      10
    );
    document.documentElement.addEventListener("mousemove", resize);
    document.documentElement.addEventListener("mouseup", stopResize);
  }

  function resize(e) {
    const width = startWidth - (e.clientX - startX);
    const mainContentWidth = 100 - (width / window.innerWidth) * 100;
    element.style.width = width + "px";
    document.body.style.width = mainContentWidth + "%";
  }

  function stopResize() {
    document.documentElement.removeEventListener("mousemove", resize);
    document.documentElement.removeEventListener("mouseup", stopResize);
  }

  resizer.addEventListener("mousedown", startResize);
}

function copyCode(code) {
  navigator.clipboard.writeText(code).then(() => {
    const copyBtn = document.querySelector(".copy-btn");
    copyBtn.classList.add("copied");
    setTimeout(() => copyBtn.classList.remove("copied"), 1500);
  });
}
