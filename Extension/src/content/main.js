// let chats = [];
let isFinishedLoading = false;

// The chat icon
const icon = document.createElement("img");
icon.src = chrome.runtime.getURL("./images/chat.png"); // Use chrome.runtime.getURL to get the correct path
icon.alt = "Custom Icon";
icon.id = "custom-icon";

// Create the main element with class "_the_container"
const mainElement = document.createElement("main");
mainElement.classList.add("_the_container");

// Create the h3 element with text "Folders"
const h3Element = document.createElement("h3");
h3Element.textContent = "Folders";
h3Element.classList.add("_folderz_title");

// Create the search container div
const searchContainer = document.createElement("div");
searchContainer.classList.add("search-container");

// Create the search container div
const folderz = document.createElement("div");
folderz.classList.add("_folderz");

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
      bookmarkChatsContainer.style.display = "block";
    } else {
      bookmarkChatsContainer.style.display = "none";
    }
  });

  // Append the container to the main container if it doesn't already exist
  let container = document.querySelector("._the_container");
  if (container && !container.querySelector("._bookmarked_folder")) {
    container.appendChild(bookmarkedFolder);
  }

  return bookmarkedFolder;
};

// Function to update the icon in the original chat list
function updateOriginalChatIcon(bookmarkedChat) {
  const chatText = bookmarkedChat.innerText;
  const originalChats = document.querySelectorAll("ol li.relative");

  for (let chat of originalChats) {
    if (chat.innerText === chatText) {
      let bookmarkAdd = chat.querySelector(
        "div.no-draggable span[data-state='closed']"
      );

      let bookmarkedIcon = bookmarkAdd.querySelector("._bookmarked_icon");

      let unbookmarkedIcon = document.createElement("img");
      unbookmarkedIcon.src = chrome.runtime.getURL(
        "./images/bookmark_outline.png"
      );
      unbookmarkedIcon.alt = "Unbookmarked Icon";
      unbookmarkedIcon.classList.add("_unbookmarked_icon");

      bookmarkAdd.replaceChild(unbookmarkedIcon, bookmarkedIcon);
      addToggleListener(
        bookmarkedIcon,
        unbookmarkedIcon,
        bookmarkAdd,
        chat,
        false
      );
      break;
    }
  }
}

let addToggleListener = (
  bookmarkedIcon,
  unbookmarkedIcon,
  bookmarkAdd,
  chat,
  isInBookmarkFolder
) => {
  const toggleBookmark = () => {
    if (bookmarkAdd.contains(bookmarkedIcon)) {
      // Switch to unbookmarked icon
      bookmarkAdd.replaceChild(unbookmarkedIcon, bookmarkedIcon);

      // Remove from bookmarks folder
      removeUnbookmarkedChat(chat);

      // Update the original chat's bookmark icon if inside the bookmarks folder
      if (isInBookmarkFolder) {
        updateOriginalChatIcon(chat);
      }
    } else {
      bookmarkAdd.replaceChild(bookmarkedIcon, unbookmarkedIcon);

      // Add to bookmarks folder
      addToBookmarkedFolder(chat);
    }
  };

  // Add the event listeners for the icons
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
    let clonedChat = chat.cloneNode(true);

    // Remove the options button
    let optionBtn = clonedChat.querySelector(
      "span[data-state='closed'] button"
    );
    if (optionBtn) optionBtn.remove();

    // Get the bookmark add span
    let bookmarkAdd = clonedChat.querySelector(
      "div.no-draggable span[data-state='closed']"
    );

    // Remove existing bookmark icons
    let existingBookmarkedIcon = bookmarkAdd.querySelector("._bookmarked_icon");
    let existingUnbookmarkedIcon = bookmarkAdd.querySelector(
      "._unbookmarked_icon"
    );
    if (existingBookmarkedIcon) existingBookmarkedIcon.remove();
    if (existingUnbookmarkedIcon) existingUnbookmarkedIcon.remove();

    // Create new bookmark icons
    let bookmarkedIcon = document.createElement("img");
    bookmarkedIcon.src = chrome.runtime.getURL("./images/bookmark_fill.png");
    bookmarkedIcon.alt = "Bookmarked Icon";
    bookmarkedIcon.classList.add("_bookmarked_icon");

    let unbookmarkedIcon = document.createElement("img");
    unbookmarkedIcon.src = chrome.runtime.getURL(
      "./images/bookmark_outline.png"
    );
    unbookmarkedIcon.alt = "Unbookmarked Icon";
    unbookmarkedIcon.classList.add("_unbookmarked_icon");

    // Add the bookmarked icon to the cloned chat
    bookmarkAdd.appendChild(bookmarkedIcon);

    // Add the toggle listener to the cloned chat
    addToggleListener(
      bookmarkedIcon,
      unbookmarkedIcon,
      bookmarkAdd,
      clonedChat,
      true
    );

    // Adding chat to the folder from the bookmarks folder
    let addToFolder = clonedChat.querySelector(
      "div.no-draggable span[data-state='closed'] img._add_to_folder_icon"
    );
    addToFolder.addEventListener("click", () => {
      // addToFolderGlobally(clonedChat);
      let folderDivs = document.querySelectorAll("._la_folder");
      if (folderDivs.length > 0) {
        addToFolderGlobally(chat);
      } else {
        let popup = createPopup();

        // Add event listener to update the folder upon popup confirmation
        popup
          .querySelector("._make_folder_btn")
          .addEventListener("click", () => {
            let folderName = popup
              .querySelector("._folder_name_input")
              .value.trim();
            let colorVal = popup.querySelector("._folder_color_input").value;
            let container = document.querySelector("._folderz");

            // Create New Folder
            let folder_div = createNewFolder(
              folderName,
              colorVal,
              container,
              false
            );

            nCleanChatAndAppend(folder_div, chat);

            // At the end remove the popup
            if (popup) onRemovePop();
          });
      }
    });

    // Append the cloned chat to the bookmarked container
    bookmarkedChatContainer.appendChild(clonedChat);
  }
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

const getFromDom = (folder_div) => {
  let compareText = folder_div.querySelector(
    "._folder_title_container span._folder_title_span"
  );
  let laFolderz = document.querySelectorAll("._la_folder");
  let h = -1;
  while (++h < laFolderz.length) {
    let innerT = laFolderz[h].querySelector(
      "._folder_title_container span._folder_title_span"
    );

    if (innerT.innerText === compareText.innerText) {
      let res = laFolderz[h].querySelector("._folder-content");
      return res;
    }
  }

  return null;
};

function nCleanChatAndAppend(folder_div, chat) {
  let folderContent = folder_div.querySelector("._folder-content");
  let cloneChat = chat.cloneNode(true);

  let toAppendDiv = cloneChat.querySelector(
    "div.no-draggable span[data-state='closed']"
  );

  doChatCleaning(toAppendDiv, cloneChat);
  if (folderContent) {
    folderContent.appendChild(cloneChat);
  }
}

function cleanChatAndAppend(folder_div, chat, do_I_have_to, goLookUp) {
  let folderContent;
  do_I_have_to && goLookUp
    ? (folderContent = getFromDom(folder_div))
    : (folderContent = folder_div.querySelector("._folder-content"));
  let cloneChat = chat.cloneNode(true);

  if (do_I_have_to && goLookUp) {
    let laChats = folderContent.querySelectorAll("li.relative");
    let k = -1;
    while (++k < laChats?.length) {
      let laText = laChats[k].innerText;
      if (chat.innerText === laText) {
        alert("This chat already exist, so it won't be added!");
        return;
      }
    }
  }

  let toAppendDiv = cloneChat.querySelector(
    "div.no-draggable span[data-state='closed']"
  );

  doChatCleaning(toAppendDiv, cloneChat);
  if (folderContent && goLookUp) {
    folderContent.appendChild(cloneChat);
  } else if (folderContent && !goLookUp) {
    let container = document.querySelector("._folderz");
    let folder_input = folder_div.querySelector("#_folder_chat_input");
    let contentFolder = folder_div.querySelector("._folder-content");

    if (folder_input) {
      folder_input.remove();
    }

    let allFolders = container.querySelectorAll("._la_folder");
    let laChatsNew = folder_div.querySelector(
      "span._folder_title_span"
    ).innerText;
    let folderExists = false;

    for (let i = 0; i < allFolders.length; i++) {
      let laChatsDom = allFolders[i].querySelector(
        "span._folder_title_span"
      ).innerText;

      if (laChatsDom === laChatsNew) {
        folderExists = true;
        let existingContentFolder =
          allFolders[i].querySelector("._folder-content");

        // Check if cloneChat already exists in the existingContentFolder
        let chatExists = Array.from(existingContentFolder.children).some(
          (child) => child.isEqualNode(cloneChat)
        );

        if (!chatExists) {
          existingContentFolder.appendChild(cloneChat);
        }
        break;
      }
    }

    if (!folderExists) {
      contentFolder.appendChild(cloneChat);
      folder_div.appendChild(contentFolder);
      container.appendChild(folder_div);
    }
  }
}

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

      // The close Icon
      let addToFolderIcon = document.createElement("img");
      addToFolderIcon.src = chrome.runtime.getURL("./images/new-folder.png");
      addToFolderIcon.alt = "Close Icon";
      addToFolderIcon.classList.add("_add_to_folder_icon");

      // Check if an icon is already added (either bookmarked or unbookmarked)
      let existingBookmarkIcon = bookmarkAdd.querySelector(
        "._bookmarked_icon, ._unbookmarked_icon, _add_to_folder_icon"
      );
      if (!existingBookmarkIcon) {
        bookmarkAdd.id = "_icons_span";
        bookmarkAdd.appendChild(addToFolderIcon);
        bookmarkAdd.appendChild(unbookmarkedIcon);

        const toggleListener = addToggleListener(
          bookmarkedIcon,
          unbookmarkedIcon,
          bookmarkAdd,
          chat,
          false
        );

        // Store the listener function on the element for potential future removal
        bookmarkAdd.toggleListener = toggleListener;

        // Adding the chat to the folderz
        addToFolderIcon.addEventListener("click", () => {
          let folderDivs = document.querySelectorAll("._la_folder");
          if (folderDivs.length > 0) {
            addToFolderGlobally(chat);
          } else {
            let popup = createPopup();

            // Add event listener to update the folder upon popup confirmation
            popup
              .querySelector("._make_folder_btn")
              .addEventListener("click", () => {
                let folderName = popup
                  .querySelector("._folder_name_input")
                  .value.trim();
                let colorVal = popup.querySelector(
                  "._folder_color_input"
                ).value;
                let container = document.querySelector("._folderz");

                // Create New Folder
                let folder_div = createNewFolder(
                  folderName,
                  colorVal,
                  container,
                  false
                );

                nCleanChatAndAppend(folder_div, chat);

                // At the end remove the popup
                if (popup) onRemovePop();
              });
          }
        });
      }
    }
  });
};

function doFolderCreation() {
  return new Promise((resolve, reject) => {
    let popup = createPopup();

    // Add event listener to update the folder upon popup confirmation
    popup.querySelector("._make_folder_btn").addEventListener("click", () => {
      let folderName = popup.querySelector("._folder_name_input").value.trim();
      let colorVal = popup.querySelector("._folder_color_input").value;
      let container = document.querySelector("._folderz");

      // Create New Folder
      let folder_div = createNewFolder(folderName, colorVal, container, true);

      // At the end remove the popup
      if (popup) onRemovePop();

      // Resolve the promise with the created folder_div
      resolve(folder_div);
    });
  });
}

let addToFolderGlobally = (chat) => {
  let goLookUp = true; // This variable is for the other function to whether look up for the folder on the dom or not

  // Helper function to insert checkbox into folders
  const insertCheckboxIntoFolder = (folder) => {
    let folderInput = document.createElement("input");
    folderInput.type = "checkbox";
    folderInput.id = "_folder_chat_input";

    let whereToAppend = folder.querySelector("._folder_title_container");
    if (whereToAppend.firstChild) {
      whereToAppend.insertBefore(
        folderInput.cloneNode(true),
        whereToAppend.firstChild
      );
    } else {
      whereToAppend.appendChild(folderInput);
    }
  };

  // Create a save button
  let saveBtn = document.createElement("button");
  saveBtn.innerText = "Save";
  saveBtn.classList.add("_save_btn");

  let la_folderz = document.querySelector("._folderz");
  let folderzClone = la_folderz.cloneNode(true); // Clone the existing folders
  folderzClone.id = "_la_folderz";

  // Create the close button
  let fermerBtn = document.createElement("img");
  fermerBtn.src = chrome.runtime.getURL("./images/crossQ.png");
  fermerBtn.alt = "Close Icon";
  fermerBtn.classList.add("_fermer_btn");
  folderzClone.appendChild(fermerBtn);

  let la_title = folderzClone.querySelector("._folderz_title");
  la_title.style.margin = "0";

  // Insert checkboxes into cloned folders
  folderzClone
    .querySelectorAll("._la_folder")
    .forEach(insertCheckboxIntoFolder);

  // Close button functionality
  fermerBtn.addEventListener("click", () => {
    if (folderzClone) folderzClone.remove();
  });

  // Handle folder creation when the create button is clicked
  let laCreateBtn = folderzClone.querySelector("._create_folder_container");
  laCreateBtn.addEventListener("click", () => {
    goLookUp = false;
    doFolderCreation().then((folder_div) => {
      insertCheckboxIntoFolder(folder_div); // Insert checkbox into the new folder
      folderzClone.insertBefore(folder_div, saveBtn);
    });
  });

  saveBtn.addEventListener("click", () => {
    // Check all folders (including newly created ones)
    let allFolders = folderzClone.querySelectorAll("._la_folder");
    allFolders.forEach((folder) => {
      let folder_input = folder.querySelector("#_folder_chat_input");
      if (folder_input && folder_input.checked) {
        cleanChatAndAppend(folder, chat, true, goLookUp);
        if (folderzClone) folderzClone.remove();
      }
    });
  });

  folderzClone.appendChild(saveBtn);
  document.body.appendChild(folderzClone);
};

let addDragAndDropFunctionality = () => {
  let folderDivs = document.querySelectorAll("._la_folder");
  const targetElements = document.querySelectorAll("ol li.relative");

  // Making the element draggable
  targetElements.forEach((dragEle) => {
    // Assign a unique ID if not already present
    if (!dragEle.id) {
      dragEle.id = `draggable-${Math.random().toString(36).substring(2, 11)}`;
    }

    dragEle.setAttribute("draggable", "true");

    // Remove existing event listeners to prevent duplicates
    dragEle.removeEventListener("dragstart", handleDragStart);
    dragEle.addEventListener("dragstart", handleDragStart);
  });

  // Dragging and dropping
  folderDivs.forEach((folder) => {
    // Remove existing event listeners to prevent duplicates
    folder.removeEventListener("dragover", handleDragOver);
    folder.removeEventListener("drop", handleDrop);

    folder.addEventListener("dragover", handleDragOver);
    folder.addEventListener("drop", handleDrop);
  });
};

function handleDragStart(e) {
  let id = e.target;
  let realId = id.parentElement.parentElement.id;
  e.dataTransfer.setData("text/plain", realId); // Use a real unique ID :)
  e.dataTransfer.effectAllowed = "copy";
}

function handleDragOver(e) {
  e.preventDefault(); // Necessary to allow dropping
  e.dataTransfer.dropEffect = "copy";
}

// Define the event listener function
const removeClickEvent = (elementToRemove, folderMinusIcon) => {
  return () => {
    if (elementToRemove) {
      elementToRemove.remove(); // Remove the element
      folderMinusIcon.removeEventListener("click", removeClickEvent); // Remove the click event listener
    }
  };
};

function handleDrop(e) {
  e.preventDefault();
  let chatId = e.dataTransfer.getData("text/plain");
  let draggedElement = document.getElementById(chatId); // Retrieve the dragged element by ID

  let folderContent = e.target
    .closest("._la_folder")
    ?.querySelector("._folder-content");

  if (!folderContent) {
    return;
  }

  if (!draggedElement) {
    return;
  }

  let clonedElement = draggedElement.cloneNode(true);
  clonedElement.id = `draggable-${Math.random().toString(36).substring(2, 11)}`; // Assign a new unique ID to the cloned element

  // Check if the element already exist, if it does return
  let laInnerT = clonedElement.innerText;
  let compareInnerT = folderContent.querySelectorAll("li.relative");
  for (let textCompare of compareInnerT) {
    if (textCompare.innerText === laInnerT) {
      alert("This chat already exist!");
      return;
    }
  }

  // Append the cloned message into the folder's content area
  folderContent.appendChild(clonedElement);
  let optionBtn = folderContent.querySelectorAll("li.relative");

  // Creating the minus folder icon
  let folderMinusIcon = document.createElement("img");
  folderMinusIcon.src = chrome.runtime.getURL("./images/minus.png");
  folderMinusIcon.alt = "Folder minus icon";
  folderMinusIcon.classList.add("_folder_minus_icon");

  // Remove the option btns on the copy chats because they don't work
  let r = -1;
  while (++r < optionBtn?.length) {
    let toAppendDiv = optionBtn[r].querySelector(
      "div.no-draggable span[data-state='closed']"
    );
    doChatCleaning(toAppendDiv, optionBtn[r]);
  }
}

const doChatCleaning = (toAppendDiv, elementToRemove) => {
  // Remove the bookmark and the options btn
  let rBtn = toAppendDiv.querySelector("button");
  let rImgFolderPlus = toAppendDiv.querySelector("img._add_to_folder_icon");
  let rImgBookmark = toAppendDiv.querySelector(
    " img._bookmarked_icon,  img._unbookmarked_icon"
  );

  if (rImgBookmark) toAppendDiv.removeChild(rImgBookmark);
  if (rImgFolderPlus) toAppendDiv.removeChild(rImgFolderPlus);
  if (rBtn) toAppendDiv.removeChild(rBtn);

  // Check if the icon already exists to prevent duplicates
  if (!toAppendDiv.querySelector("img._folder_minus_icon")) {
    // Creating the minus folder icon
    let folderMinusIcon = document.createElement("img");
    folderMinusIcon.src = chrome.runtime.getURL("./images/minus.png");
    folderMinusIcon.alt = "Folder minus icon";
    folderMinusIcon.classList.add("_folder_minus_icon");

    toAppendDiv.appendChild(folderMinusIcon);
    // const elementToRemove = optionBtn[r]; // Capture the element to remove before attaching the listener

    // Attach the event listener for removing the specific element
    let handleRemoveClick = removeClickEvent(elementToRemove, folderMinusIcon);
    folderMinusIcon.addEventListener("click", handleRemoveClick);
  }
};

let openMenu = null; // Track the currently open menu
let createNewFolder = (folderName, colorVal, container, doNotAppend) => {
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

  // Creating delete folder icon
  let folderMenu = document.createElement("img");
  folderMenu.src = chrome.runtime.getURL("./images/menu-bar2.png");
  folderMenu.alt = "Folder edit icon";
  folderMenu.classList.add("_folder_edit_icon");

  // Create a span to put the folder name and the edit icon
  let folderTitleSpan = document.createElement("span");
  folderTitleSpan.style.backgroundColor = `${colorVal}`;
  folderTitleSpan.classList.add("_folder_title_span");

  // Create folder name element
  let folderTitle = document.createElement("p");
  folderTitle.innerText = folderName;
  folderTitle.classList.add("_folder-name");

  // Create a content area to hold folder items (initially hidden)
  let folderContent = document.createElement("div");
  folderContent.classList.add("_folder-content");
  folderContent.style.borderLeft = `1.3px solid ${colorVal}`;
  folderContent.style.display = "none";

  // Create a content area to hold folder items (initially hidden)
  let folderTitleContainer = document.createElement("div");
  folderTitleContainer.classList.add("_folder_title_container");

  folderTitleSpan.appendChild(folderTitle);
  folderTitleSpan.appendChild(folderMenu);

  // Append icon and name to folder div
  folderTitleContainer.appendChild(folderIcon);
  folderTitleContainer.appendChild(folderTitleSpan);
  folderDiv.appendChild(folderTitleContainer);
  folderDiv.appendChild(folderContent);

  // Create the folder menu container (but don't display it yet)
  let folderMenuHolder = document.createElement("div");
  folderMenuHolder.classList.add("_folder_menu_div");
  folderMenuHolder.style.display = "none";

  // Creating delete folder icon
  let deleteFolder = document.createElement("img");
  deleteFolder.src = chrome.runtime.getURL("./images/trash-bin.png");
  deleteFolder.alt = "Folder delete icon";
  deleteFolder.classList.add("_folder_edit_icon");

  // Creating the folder edit icon
  let editIcon = document.createElement("img");
  editIcon.src = chrome.runtime.getURL("./images/edit-file.png");
  editIcon.alt = "Folder edit icon";
  editIcon.classList.add("_folder_edit_icon");

  // Creating the folder edit icon
  let addChatIcon = document.createElement("img");
  addChatIcon.src = chrome.runtime.getURL("./images/chat1.png");
  addChatIcon.alt = "Chat icon";
  addChatIcon.classList.add("_folder_menu_chat_icon");

  // Titles
  let deleteTitle = createTitles("Delete Folder");
  let editTitle = createTitles("Edit Folder");
  let addChatToAFolder = createTitles("Add Chat");

  let folderDelete = createSpan(deleteTitle, deleteFolder);
  let folderEdit = createSpan(editTitle, editIcon);
  let addChatSpan = createSpan(addChatToAFolder, addChatIcon);

  folderMenuHolder.appendChild(folderDelete);
  folderMenuHolder.appendChild(folderEdit);
  folderMenuHolder.appendChild(addChatSpan);

  // Append the menu to the folder title container
  folderTitleContainer.appendChild(folderMenuHolder);

  // Add click event to toggle the visibility of the folder contents
  folderTitle.addEventListener("click", () => {
    toggleFolderContents(
      folderContent,
      folderIcon,
      openFolder,
      folderTitleContainer
    );
  });

  folderMenu.addEventListener("click", () => {
    // Close the currently open menu (if there is one)
    if (openMenu && openMenu !== folderMenuHolder) {
      openMenu.style.display = "none";
    }

    // Toggle the current folder menu
    if (folderMenuHolder.style.display === "none") {
      folderMenuHolder.style.display = "flex";
      openMenu = folderMenuHolder; // Set the current menu as open
    } else {
      folderMenuHolder.style.display = "none";
      openMenu = null; // No menu is open
    }
  });

  folderEdit.addEventListener("click", () => {
    folderMenuHolder.style.display = "none";
    openEditPopup(folderTitle, folderTitleSpan, folderContent);
  });

  // Deleting the folder
  folderDelete.addEventListener("click", () => {
    folderDiv.remove();
    openMenu = null; // Reset openMenu when folder is deleted
  });

  // Insert the new folder into the container
  if (!doNotAppend) {
    let allFolders = container.querySelectorAll("._la_folder");

    let u = -1;
    while (++u < allFolders.length) {
      let compText = allFolders[u].querySelector("._folder_title_container");

      if (folderTitle.innerText === compText.innerText) {
        alert("You already have a folder with this name :)");
        return;
      }
    }

    container.appendChild(folderDiv);
  }

  addChatSpan.addEventListener("click", () => {
    openMenu = null;
    folderMenuHolder.style.display = "none";
    const chatGroups = document.querySelectorAll("nav ol");

    let chatDiv = document.createElement("div");
    chatDiv.classList.add("_add_chat_div");

    // Create a save button
    let doneBtn = document.createElement("button");
    doneBtn.innerText = "Done / Close";
    doneBtn.classList.add("_done_btn");

    if (isFinishedLoading) {
      chatGroups.forEach((group) => {
        const chats = group.querySelectorAll("li.relative");

        for (let chat of chats) {
          let textToAdd = chat.textContent;

          let chatInput = document.createElement("input");
          chatInput.type = "checkbox";
          chatInput.id = "_folder_chat_input";

          let chatSpan = document.createElement("span");
          chatSpan.id = "_chat_input_span";

          // Create folder name element
          let chatTitle = document.createElement("p");
          chatTitle.innerText = textToAdd;
          chatTitle.classList.add("_chat_title");

          // Event listener for the checkbox
          if (chatInput) {
            chatInput.addEventListener("change", (event) => {
              if (event.target.checked) {
                nCleanChatAndAppend(folderDiv, chat);
              } else {
                let folderChats = folderDiv.querySelectorAll("li.relative");

                for (let i = 0; i < folderChats.length; i++) {
                  let folderChatText = folderChats[i].textContent;
                  if (folderChatText === chat.textContent)
                    folderChats[i].remove();
                }
              }
            });
          }

          chatSpan.appendChild(chatInput);
          chatSpan.appendChild(chatTitle);
          chatDiv.appendChild(chatSpan);
        }
      });

      doneBtn.addEventListener("click", () => {
        chatDiv.remove();
      });

      chatDiv.appendChild(doneBtn);
      document.body.appendChild(chatDiv);
    } else {
      alert(`Your aren't loaded please refresh the page :)`);
    }
  });

  return folderDiv;
};

// Create folder name element
function createTitles(menuTile) {
  let folderMenuTitle = document.createElement("p");
  folderMenuTitle.innerText = menuTile;
  folderMenuTitle.classList.add("_folder_menu_title");

  return folderMenuTitle;
}

// Create a div container to hold folder menu
const createSpan = (la_title, la_icon) => {
  let folderMenuSpan = document.createElement("span");
  folderMenuSpan.classList.add("_folder_menu_span");

  folderMenuSpan.appendChild(la_icon);
  folderMenuSpan.appendChild(la_title);

  return folderMenuSpan;
};

// This function converts RGB to Hex
function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g); // Extract the RGB values
  if (!result) return "#f6b73c"; // Default color if parsing fails

  // Convert each value to hex and pad with zeros if necessary
  const r = parseInt(result[0]).toString(16).padStart(2, "0");
  const g = parseInt(result[1]).toString(16).padStart(2, "0");
  const b = parseInt(result[2]).toString(16).padStart(2, "0");

  return `#${r}${g}${b}`; // Combine into a single hex string
}

// This function is to edit the folder
let openEditPopup = (folderTitle, folderTitleSpan, folderContent) => {
  let popup = createPopup(); // Create and append popup to body again to edit it

  // Get the original folder name and color
  let folderName = folderTitle.innerText;
  let colorVal = folderTitleSpan.style.backgroundColor || "#f6b73c";

  // Convert colorVal to hex if it's in rgb format
  if (colorVal.startsWith("rgb")) {
    colorVal = rgbToHex(colorVal);
  }

  // Pre-fill popup with the current folder details
  let folderInput = popup.querySelector("._folder_name_input");
  let folderColor = popup.querySelector("._folder_color_input");
  folderInput.value = folderName;
  folderColor.value = `${colorVal}`;

  // Add event listener to update the folder upon popup confirmation
  popup.querySelector("._make_folder_btn").addEventListener("click", () => {
    folderName = folderInput.value.trim();
    colorVal = folderColor.value;

    if (folderName) {
      folderTitle.innerText = folderName;
      folderTitleSpan.style.backgroundColor = `${colorVal}`;
      folderContent.style.borderLeft = `1.3px solid ${colorVal}`;
      onRemovePop(popup);
    } else {
      alert("Please enter a valid folder name.");
    }
  });
};

let createPopup = () => {
  let popup = document.createElement("div");
  popup.classList.add("_popup");

  // The close Icon
  let closeIcon = document.createElement("img");
  closeIcon.src = chrome.runtime.getURL("./images/cross.png");
  closeIcon.alt = "Close Icon";
  closeIcon.classList.add("_close_icon");

  // Create input for folder name
  let folderInput = document.createElement("input");
  folderInput.type = "text";
  folderInput.placeholder = "Enter folder name";
  folderInput.classList.add("_folder_name_input");

  let folderColorHolder = document.createElement("span");
  folderColorHolder.classList.add("_folder_color_holder");

  // Create input for folder color
  let folderColor = document.createElement("input");
  folderColor.type = "color";
  folderColor.id = "folder_color";
  folderColor.name = "folder_color";
  folderColor.value = "#f6b73c";
  folderColor.classList.add("_folder_color_input");

  // Create input for folder color input label
  let colorInputLabel = document.createElement("label");
  colorInputLabel.for = "folder_color";
  colorInputLabel.innerText = "Choose folder color: ";

  folderColorHolder.appendChild(colorInputLabel);
  folderColorHolder.appendChild(folderColor);

  // Create add/edit folder button
  let addFolderBtn = document.createElement("button");
  addFolderBtn.innerText = "Confirm";
  addFolderBtn.classList.add("_make_folder_btn");

  // Append input and button to popup
  popup.appendChild(closeIcon);
  popup.appendChild(folderInput);
  popup.appendChild(folderColorHolder);
  popup.appendChild(addFolderBtn);

  // Append popup to body
  document.body.appendChild(popup);

  // Close the popup
  closeIcon.addEventListener("click", () => {
    if (popup) {
      onRemovePop();
    }
  });

  return popup;
};

let toggleFolderContents = (
  folderContent,
  folderIcon,
  openFolder,
  folderTitleContainer
) => {
  if (folderContent.style.display === "none") {
    folderContent.style.display = "block";
    folderTitleContainer.replaceChild(openFolder, folderIcon);
  } else {
    folderContent.style.display = "none";
    folderTitleContainer.replaceChild(folderIcon, openFolder);
  }
};

let startCreatingFolderz = () => {
  let createFolderzDiv = document.querySelector("._create_folder_container");

  createFolderzDiv.addEventListener("click", () => {
    let popup = createPopup();
    let container = document.querySelector("._folderz");

    // Add folder button inside the popup
    popup.querySelector("._make_folder_btn").addEventListener("click", () => {
      let folderName = popup.querySelector("._folder_name_input").value.trim();
      let colorVal = popup.querySelector("._folder_color_input").value;

      if (folderName) {
        createNewFolder(folderName, colorVal, container, false);
        onRemovePop(popup); // Close popup after creation
      } else {
        alert("Please enter a folder name.");
      }
    });
  });
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
      // chats.push(element.innerText); // Add to chats array if not already present
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
    let searchTerm = searchInput.value.toLowerCase();
    const chatGroups = document.querySelectorAll("nav ol");

    if (isFinishedLoading) {
      chatGroups.forEach((group) => {
        let chats = group.querySelectorAll("li.relative");

        chats.forEach((chat) => {
          if (searchTerm === "") {
            // Reset visibility when search term is empty
            chat.style.display = "";
          } else if (chat.textContent.toLowerCase().includes(searchTerm)) {
            chat.style.display = "";
          } else {
            chat.style.backgroundColor = "";
            chat.style.display = "none";
          }
        });

        // After filtering chats, remove empty groups
        const chatGroups = document.querySelectorAll(
          "nav div.flex.flex-col div.relative.mt-5.first\\:mt-0.last\\:mb-5"
        );

        chatGroups.forEach((group) => {
          const visibleChats = group.querySelectorAll(
            "li.relative:not([style*='display: none'])"
          );
          if (visibleChats.length === 0) {
            group.style.display = "none";
          } else {
            group.style.display = "";
          }
        });
      });
    }
  });
}

// Appending element to the main container
mainElement.appendChild(searchContainer); // The search
mainElement.appendChild(createBookmarks()); // The Bookmarks
folderz.appendChild(h3Element);
folderz.appendChild(createFolderContainer);
mainElement.appendChild(folderz); // The folderz title

// Initial run
addElements();

// Periodically check for new code blocks (as a fallback)
setInterval(addElements, 2000);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
let isLoading = false;
let originalScrollTop = 0;

function loadAllChatsInBackground() {
  if (isLoading) return;
  isLoading = true;

  const navGap = document.querySelector("nav > :nth-child(2)");
  if (!navGap) {
    isLoading = false;
    return;
  }

  // Store the original scroll position
  originalScrollTop = navGap.scrollTop;

  function loadMoreChats() {
    // Scroll to trigger lazy loading
    navGap.scrollTop = navGap.scrollHeight;

    setTimeout(() => {
      // Check if new content has been loaded
      const chatGroups = navGap.querySelectorAll("ol");
      let totalChats = 0;
      chatGroups.forEach((group) => {
        totalChats += group.querySelectorAll("li.relative").length;
      });

      if (totalChats > window.lastKnownChatCount) {
        window.lastKnownChatCount = totalChats;
        loadMoreChats(); // Continue loading
      } else {
        // Restore the original scroll position
        navGap.scrollTop = originalScrollTop;
        isLoading = false;
        isFinishedLoading = true;
      }
    }, 100); // Adjust timeout as needed
  }

  // Initialize lastKnownChatCount if not set
  if (typeof window.lastKnownChatCount === "undefined") {
    window.lastKnownChatCount = Array.from(
      navGap.querySelectorAll("ol")
    ).reduce(
      (total, group) => total + group.querySelectorAll("li.relative").length,
      0
    );
  }

  loadMoreChats();
}

// Throttle function remains the same
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Throttled version of loadAllChatsInBackground
const throttledLoadChats = throttle(loadAllChatsInBackground, 5000);

function observeDOMChanges() {
  const targetNode = document.querySelector("nav");
  const config = { childList: true, subtree: true };

  const callback = (mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        console.log("A child node has been added or removed.");
        throttledLoadChats();
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
}

observeDOMChanges();
