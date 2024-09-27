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

let createBookmarks = () => {
  // Check if the container already exists
  let existingContainer = document.querySelector("._bookmarked_folder");
  if (existingContainer) {
    return existingContainer;
  }

  // Bookmarked div
  let bookmarkedFolder = document.createElement("div");
  bookmarkedFolder.classList.add("_bookmarked_folder");

  // The bookmarked title
  let bookmarkedTitle = document.createElement("p");
  bookmarkedTitle.innerText = "Bookmarked!";
  bookmarkedTitle.classList.add("_bookmarked_name");

  // Bookmarked Icon
  let bookmarkedFolderIcon = document.createElement("img");
  bookmarkedFolderIcon.src = chrome.runtime.getURL("./images/bookmark.png");
  bookmarkedFolderIcon.alt = "Folder Icon";
  bookmarkedFolderIcon.classList.add("_bookmarked_folder_icon");

  // Bookmarked chats container
  let bookmarkTitleContainer = document.createElement("div");
  bookmarkTitleContainer.classList.add("_bookmarked_title_container");

  // Bookmarked chats container
  let bookmarkChatsContainer = document.createElement("div");
  bookmarkChatsContainer.classList.add("_bookmarked_chats_container");
  bookmarkChatsContainer.style.display = "none";

  // Appending everything
  bookmarkTitleContainer.appendChild(bookmarkedFolderIcon);
  bookmarkTitleContainer.appendChild(bookmarkedTitle);
  bookmarkedFolder.appendChild(bookmarkTitleContainer);
  bookmarkedFolder.appendChild(bookmarkChatsContainer);

  bookmarkTitleContainer.addEventListener("click", () => {
    if (bookmarkChatsContainer.style.display === "none") {
      bookmarkChatsContainer.style.display = "block"; // Show contents
    } else {
      bookmarkChatsContainer.style.display = "none"; // Hide contents
    }
  });

  // Append the container to the main container if it doesn't already exist
  let container = document.querySelector("._the_container");
  if (container && !container.querySelector("._bookmarked_folder")) {
    container.appendChild(bookmarkedFolder);
  }

  return bookmarkedFolder;
};

let addToggleListener = (
  bookmarkedIcon,
  unbookmarkedIcon,
  bookmarkAdd,
  chat
) => {
  const toggleBookmark = () => {
    if (bookmarkAdd.contains(bookmarkedIcon)) {
      bookmarkAdd.replaceChild(unbookmarkedIcon, bookmarkedIcon);
      removeUnbookmarkedChat(chat);
    } else {
      bookmarkAdd.replaceChild(bookmarkedIcon, unbookmarkedIcon);
      addToBookmarkedFolder(chat);
    }
  };

  bookmarkedIcon.addEventListener("click", toggleBookmark);
  unbookmarkedIcon.addEventListener("click", toggleBookmark);

  return toggleBookmark;
};

function addToBookmarkedFolder(chat) {
  let bookmarkedFolder = createBookmarks();
  let bookmarkedChatContainer = bookmarkedFolder.querySelector(
    "._bookmarked_chats_container"
  );
  if (bookmarkedChatContainer) {
    // Clone the chat element to avoid moving it from the original list
    let clonedChat = chat.cloneNode(true);
    bookmarkedChatContainer.appendChild(clonedChat);
  }

  // Removing the options button from chats in the bookmarks folder
  let optionBtn = bookmarkedChatContainer.querySelector(
    "span[data-state='closed'] button"
  );
  optionBtn.remove();
}

// Function to remove the unbookmarked chat
const removeUnbookmarkedChat = (unbookmarkedChat) => {
  let bookmarkedFolder = createBookmarks();
  let bookmarkedChatContainer = bookmarkedFolder.querySelector(
    "._bookmarked_chats_container"
  );

  // Get the inner data of the unbookmarked chat for comparison
  const unbookmarkedChatData = unbookmarkedChat.innerText;
  const bookmarkedChats =
    bookmarkedChatContainer.querySelectorAll("li.relative");
  for (let chat of bookmarkedChats) {
    if (chat.innerText === unbookmarkedChatData) {
      bookmarkedChatContainer.removeChild(chat);
      break;
    }
  }
};

let addBookmarkIcons = () => {
  const chats = document.querySelectorAll("ol li.relative");

  chats.forEach((chat) => {
    let bookmarkAdd = chat.querySelector(
      "div.no-draggable span[data-state='closed']"
    );

    if (bookmarkAdd) {
      // The bookmarked Icon
      let bookmarkedIcon = document.createElement("img");
      bookmarkedIcon.src = chrome.runtime.getURL("./images/bookmark_fill.png");
      bookmarkedIcon.alt = "Bookmarked Icon";
      bookmarkedIcon.classList.add("_bookmarked_icon");

      // The unbookmarked Icon
      let unbookmarkedIcon = document.createElement("img");
      unbookmarkedIcon.src = chrome.runtime.getURL(
        "./images/bookmark_outline.png"
      );
      unbookmarkedIcon.alt = "Unbookmarked Icon";
      unbookmarkedIcon.classList.add("_unbookmarked_icon");

      // Check if an icon is already added (either bookmarked or unbookmarked)
      let existingBookmarkIcon = bookmarkAdd.querySelector(
        "._bookmarked_icon, ._unbookmarked_icon"
      );
      if (!existingBookmarkIcon) {
        bookmarkAdd.id = "_icons_span";
        bookmarkAdd.appendChild(unbookmarkedIcon);

        const toggleListener = addToggleListener(
          bookmarkedIcon,
          unbookmarkedIcon,
          bookmarkAdd,
          chat
        );

        // Store the listener function on the element for potential future removal
        bookmarkAdd.toggleListener = toggleListener;
      }
    }
  });
};

// Function to remove event listeners (call this when needed)
let removeBookmarkListeners = () => {
  const chats = document.querySelectorAll("ol li.relative");

  chats.forEach((chat) => {
    let bookmarkAdd = chat.querySelector(
      "div.no-draggable span[data-state='closed']"
    );
    if (bookmarkAdd && bookmarkAdd.toggleListener) {
      let bookmarkedIcon = bookmarkAdd.querySelector("._bookmarked_icon");
      let unbookmarkedIcon = bookmarkAdd.querySelector("._unbookmarked_icon");

      if (bookmarkedIcon) {
        bookmarkedIcon.removeEventListener("click", bookmarkAdd.toggleListener);
      }
      if (unbookmarkedIcon) {
        unbookmarkedIcon.removeEventListener(
          "click",
          bookmarkAdd.toggleListener
        );
      }

      delete bookmarkAdd.toggleListener;
    }
  });
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

        // Create closed folder icon
        let folderIcon = document.createElement("img");
        folderIcon.src = chrome.runtime.getURL("./images/closed_folder.png");
        folderIcon.alt = "Folder Icon";
        folderIcon.classList.add("_closed_folder_icon");

        // Creating the open folder icon
        let openFolder = document.createElement("img");
        openFolder.src = chrome.runtime.getURL("./images/open_folder.png");
        openFolder.alt = "Folder Icon";
        openFolder.classList.add("_opened_folders_icon");

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

            // Replace closed icon with the open folder icon
            folderTitleContainer.replaceChild(openFolder, folderIcon); // Replaces the closed icon
          } else {
            folderContent.style.display = "none"; // Hide contents

            // Replace open icon with the closed folder icon
            folderTitleContainer.replaceChild(folderIcon, openFolder); // Replaces the open icon
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

  // Trying to add the bookmark before the folderzs
  let container = document.querySelector("._the_container");
  let bookmarksAdded = container.querySelector("._bookmarked_folder");
  if (
    !bookmarksAdded ||
    !bookmarksAdded.classList.contains("_bookmarked_folder")
  )
    container.appendChild(createBookmarks());
};

// Function to add elements like icons and folders
function addElements() {
  // Handle chat icons
  const targetElements = document.querySelectorAll(
    "ol li.relative div.no-draggable"
  );
  targetElements.forEach((element, index) => {
    element.style.display = "flex";
    element.style.alignItems = "center";

    const firstChild = element.firstChild;
    if (!firstChild || !firstChild.id?.includes("custom-icon")) {
      element.insertBefore(icon.cloneNode(true), firstChild); // Add the custom icon
      chats.push(element.innerText); // Add to chats array if not already present
    }
  });

  // Add folders, bookmarks, and search bar if not already added
  handleSearchBar();
  startCreatingFolderz();
  addDragAndDropFunctionality();
  createBookmarks();
  addBookmarkIcons();
}

// Search bar handling
function handleSearchBar() {
  const searchInsert = document.querySelectorAll("nav div.flex-col.flex-1");
  searchInsert.forEach((navElement) => {
    const thirdChild = navElement.children[2];
    if (!thirdChild || !thirdChild.classList?.contains("_the_container")) {
      navElement.insertBefore(mainElement, thirdChild);
      const inputEle = document.querySelector(".search-bar");
      setupSearchInput(inputEle);
    }
  });
}

// Setup search bar events
function setupSearchInput(inputEle) {
  inputEle.addEventListener("focus", () => {
    inputEle.classList.add("search-bar_focus");
  });

  inputEle.addEventListener("blur", () => {
    inputEle.classList.remove("search-bar_focus");
  });

  inputEle.addEventListener("input", () => {
    const inputValue = inputEle.value;
    console.log(inputValue); // Debugging
  });
}

// Initial run
addElements();

// Set up a MutationObserver to watch for new code blocks
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          node.querySelectorAll("ol").forEach((preElement) => {
            const codeElement = preElement.querySelector("li.relative");

            console.log("New code element detected:", codeElement);
            addElements();
            // checkAndAddButton(preElement, codeElement);
          });
        }
      });
    }
  }
});

// Start observing the document with the configured parameters
const chatList = document.querySelector("ol"); // Assuming 'ol' is the container for chat elements
if (chatList) {
  console.log("chatList found:", chatList);
  observer.observe(chatList, { childList: true, subtree: true });
} else {
  console.error("chatList not found");
}

// Periodically check for new code blocks (as a fallback)
setInterval(addElements, 2000);
