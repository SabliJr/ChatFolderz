let chats = [];

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

// To remove the pop up
let onRemovePop = () => {
  let la_popup = document.querySelectorAll("._popup");

  let x = -1;
  while (++x < la_popup.length) {
    la_popup[x].remove();
  }
};

const removeEmptyOls = () => {
  const allTheOls = document.querySelectorAll("ol");
};

// Add drag and drop functionality for chats (messages) and folders
let addDragAndDropFunctionality = () => {
  // Select folders and allow dropping
  let folderDivs = document.querySelectorAll("._la_folder");
  const targetElements = document.querySelectorAll("ol li.relative");

  // Making the element draggable
  targetElements.forEach((dragEle, x) => {
    dragEle.setAttribute("draggable", "true");
    dragEle.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", x); // Use index or unique ID
      e.dataTransfer.effectAllowed = "move";
    });
  });

  // Dragging and dropping
  folderDivs.forEach((folder) => {
    folder.addEventListener("dragover", (e) => {
      e.preventDefault(); // Necessary to allow dropping
      e.dataTransfer.dropEffect = "move";
    });

    folder.addEventListener("drop", (e) => {
      e.preventDefault();
      let data = e.dataTransfer.getData("text/plain");
      let draggedElement = targetElements[data]; // Correctly retrieve the dragged li element
      let folderContent = folder.querySelector("._folder-content");

      // Append the dragged message into the folder's content area
      if (folderContent) {
        folderContent.appendChild(draggedElement);
      }
    });
  });
};

let startCreatingFolderz = () => {
  let createFolderzDiv = document.querySelector("._create_folder_container");

  createFolderzDiv.addEventListener("click", () => {
    // Create popup
    let popup = document.createElement("div");
    popup.classList.add("_popup");

    // The close Icon
    let closeIcon = document.createElement("img");
    closeIcon.src = chrome.runtime.getURL("./images/cross.png");
    closeIcon.alt = "Folder Icon";
    closeIcon.classList.add("_close_icon");

    // Create input for folder name
    let folderInput = document.createElement("input");
    folderInput.type = "text";
    folderInput.placeholder = "Enter folder name";
    folderInput.classList.add("_folder_name_input");

    // Create add folder button
    let addFolderBtn = document.createElement("button");
    addFolderBtn.innerText = "Add Folder";
    addFolderBtn.classList.add("_make_folder_btn");

    // Append input and button to popup
    popup.appendChild(closeIcon);
    popup.appendChild(folderInput);
    popup.appendChild(addFolderBtn);

    // Append popup to body
    document.body.appendChild(popup);

    // Event listener to remove the pop up
    closeIcon.addEventListener("click", () => {
      if (popup) {
        onRemovePop();
      }
    });

    // Add event listener to "Add Folder" button
    addFolderBtn.addEventListener("click", () => {
      let folderName = folderInput.value.trim();
      if (folderName) {
        // Create new folder element
        let folderDiv = document.createElement("div");
        folderDiv.classList.add("_la_folder");

        // Create folder icon
        let folderIcon = document.createElement("img");
        folderIcon.src = chrome.runtime.getURL("./images/folder.png");
        folderIcon.alt = "Folder Icon";
        folderIcon.classList.add("_folders_icon");

        // Create folder name element
        let folderTitle = document.createElement("p");
        folderTitle.innerText = folderName;
        folderTitle.classList.add("_folder-name");

        // Create a content area to hold folder items (initially hidden)
        let folderContent = document.createElement("div");
        folderContent.classList.add("_folder-content");
        folderContent.style.display = "none"; // Hidden by default

        // Create a content area to hold folder items (initially hidden)
        let folderTitleContainer = document.createElement("div");
        folderTitleContainer.classList.add("_folder_title_container");

        // Append icon and name to folder div
        folderTitleContainer.appendChild(folderIcon);
        folderTitleContainer.appendChild(folderTitle);
        folderDiv.appendChild(folderTitleContainer);
        folderDiv.appendChild(folderContent);

        // Add click event to toggle the visibility of the folder contents
        folderTitleContainer.addEventListener("click", () => {
          if (folderContent.style.display === "none") {
            folderContent.style.display = "block"; // Show contents
          } else {
            folderContent.style.display = "none"; // Hide contents
          }
        });

        // Insert the new folder into _the_container main element
        let container = document.querySelector("._the_container");
        container.appendChild(folderDiv);
        // Close the popup after adding the folder
        if (popup) {
          onRemovePop();
        }
      } else {
        alert("Please enter a folder name.");
        return;
      }
    });
  });
};

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
      chats.push(targetElements[x].innerText);
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

  // The function that starts creating folderz
  startCreatingFolderz();
  addDragAndDropFunctionality();
  // findChat();
}

let findChat = () => {
  let c = 0;
  while (++c < chats.length) {
    console.log(chats[c]);
  }
};

// console.log(targetElements[x].innerText);

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
