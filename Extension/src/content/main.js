// The chat icon
const icon = document.createElement("img");
icon.src = chrome.runtime.getURL("./images/chat.png"); // Use chrome.runtime.getURL to get the correct path
icon.alt = "Custom Icon";
icon.id = "custom-icon"; // Set the id
icon.style.width = "16px"; // Adjust the size as needed
icon.style.height = "16px"; // Adjust the size as needed
icon.style.verticalAlign = "middle"; // Example: aligning vertically

// Create the main element with class "_the_container"
const mainElement = document.createElement("main");
mainElement.classList.add("_the_container");

// Create the h3 element with text "Folders"
const h3Element = document.createElement("h3");
h3Element.textContent = "Folders";
h3Element.classList.add("_folderz_title");
mainElement.appendChild(h3Element);

// Create the search container div
const searchContainer = document.createElement("div");
searchContainer.classList.add("search-container");

// Create the search input element
const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.classList.add("search-bar");
searchInput.placeholder = "Find chat...";
searchContainer.appendChild(searchInput);

// Create the search icon image
const searchIcon = document.createElement("img");
searchIcon.src = chrome.runtime.getURL("./images/search.png");
searchIcon.alt = "Search Icon";
searchIcon.classList.add("_search_icon");
searchContainer.appendChild(searchIcon);

// Append the search container to the main element
mainElement.appendChild(searchContainer);

// Create the create folder container div
const createFolderContainer = document.createElement("div");
createFolderContainer.classList.add("_create_folder_container");

// Create the add folder icon image
const addFolderIcon = document.createElement("img");
addFolderIcon.src = chrome.runtime.getURL("./images/add-folder.png");
addFolderIcon.alt = "Add Folder Icon";
addFolderIcon.classList.add("_add_folder_icon");
createFolderContainer.appendChild(addFolderIcon);

// Create the "Create Folder" paragraph
const createFolderText = document.createElement("p");
createFolderText.textContent = "Create Folder";
createFolderText.classList.add("_create_folder");
createFolderContainer.appendChild(createFolderText);

// Append the create folder container to the main element
mainElement.appendChild(createFolderContainer);

function addButtonsToExistingCodeBlocks() {
  // For adding the chat icon
  const targetElements = document.querySelectorAll(
    "ol li.relative div.no-draggable"
  );
  for (let x = 0; x < targetElements.length; x++) {
    targetElements[x].style.display = "flex";
    targetElements[x].style.alignItems = "center";

    const firstChild = targetElements[x].firstChild;
    if (!firstChild || !firstChild.id?.includes("custom-icon")) {
      targetElements[x].insertBefore(icon.cloneNode(true), firstChild);
    }
  }

  // For adding the search bar
  const searchInsert = document.querySelectorAll("nav div.flex-col.flex-1");
  for (let y = 0; y < searchInsert.length; y++) {
    let thirdChild = searchInsert[y].children[2];

    if (!thirdChild || !thirdChild.classList?.contains("_the_container")) {
      searchInsert[y].insertBefore(mainElement, thirdChild);

      let inputEle = document.querySelector(".search-bar");
      inputEle.addEventListener("focus", () => {
        inputEle.classList.add("search-bar_focus");
      });

      inputEle.addEventListener("blur", () => {
        inputEle.classList.remove("search-bar_focus");
      });
      inputEle.addEventListener("input", () => {
        let inputValue = inputEle.value;

        console.log(inputValue);
      });
    }
  }
}

// Initial run
addButtonsToExistingCodeBlocks();

// Set up a MutationObserver to watch for new code blocks
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          node.querySelectorAll("ol").forEach((preElement) => {
            const codeElement = preElement.querySelector("li.relative");
            // console.log(codeElement);
            // checkAndAddButton(preElement, codeElement);
          });
        }
      });
    }
  }
});

// Start observing the document with the configured parameters
observer.observe(document.body, { childList: true, subtree: true });

// Periodically check for new code blocks (as a fallback)
setInterval(addButtonsToExistingCodeBlocks, 2000);
