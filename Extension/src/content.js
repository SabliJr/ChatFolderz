let isFinishedLoading = false;

// The chat icon
const icon = document.createElement("img");
icon.src = chrome.runtime.getURL("../images/chat.png"); // Use chrome.runtime.getURL to get the correct path
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
searchContainer.classList.add("search-container", "_cF_K752tsMs7nXG7r-s");

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
searchIcon.src = chrome.runtime.getURL("../images/search.png");
searchIcon.alt = "Search Icon";
searchIcon.classList.add("_search_icon");
searchContainer.appendChild(searchIcon);

// Create the create folder container div
const createFolderContainer = document.createElement("div");
createFolderContainer.classList.add(
  "_create_folder_container",
  "_cF_GNewDTGpqsqNfG",
  "_cF_K752tsMs7nXG7r-f"
);

// Create the add folder icon image
const addFolderIcon = document.createElement("img");
addFolderIcon.src = chrome.runtime.getURL("../images/add-folder.png");
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
  bookmarkedFolder.classList.add("_bookmarked_folder", "_cF_GNewDTGpqsqNfG");

  // The bookmarked title
  let bookmarkedTitle = document.createElement("p");
  bookmarkedTitle.innerText = "Bookmarked!";
  bookmarkedTitle.classList.add("_bookmarked_name");

  // Bookmarked Icon
  let bookmarkedFolderIcon = document.createElement("img");
  bookmarkedFolderIcon.src = chrome.runtime.getURL("../images/bookmark.png");
  bookmarkedFolderIcon.alt = "Folder Icon";
  bookmarkedFolderIcon.classList.add("_bookmarked_folder_icon");

  // Bookmarked chats container
  let bookmarkTitleContainer = document.createElement("div");
  bookmarkTitleContainer.classList.add("_bookmarked_title_container");

  // Bookmarked chats container
  let bookmarkChatsContainer = document.createElement("div");
  bookmarkChatsContainer.classList.add(
    "_bookmarked_chats_container",
    "_cF_GNewDTGpqsqNfG"
  );
  bookmarkChatsContainer.style.display = "none";

  // Appending everything
  bookmarkTitleContainer.appendChild(bookmarkedFolderIcon);
  bookmarkTitleContainer.appendChild(bookmarkedTitle);
  bookmarkedFolder.appendChild(bookmarkTitleContainer);
  bookmarkedFolder.appendChild(bookmarkChatsContainer);

  bookmarkTitleContainer.addEventListener("click", () => {
    getCredentials();

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
        "../images/bookmark_outline.png"
      );
      unbookmarkedIcon.alt = "Unbookmarked Icon";
      // unbookmarkedIcon.id = "_cF_K752tsMs7nXG7r-b";
      unbookmarkedIcon.classList.add(
        "_unbookmarked_icon",
        "_cF_GNewDTGpqsqNfG",
        "_cF_K752tsMs7nXG7r-B"
      );

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
    getCredentials();

    if (bookmarkAdd.contains(bookmarkedIcon)) {
      // Switch to unbookmarked icon
      bookmarkAdd.replaceChild(unbookmarkedIcon, bookmarkedIcon);

      disableAllFunctionalities(); // Updating the disabling and enabling the bookmark icon

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

function addToBookmarkedFolder(chat, isFromStorage = false) {
  let bookmarkedFolder = createBookmarks();
  let bookmarkedChatContainer = bookmarkedFolder.querySelector(
    "._bookmarked_chats_container"
  );

  if (bookmarkedChatContainer) {
    let clonedChat = isFromStorage ? chat : chat.cloneNode(true);

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
    bookmarkedIcon.src = chrome.runtime.getURL("../images/bookmark_fill.png");
    bookmarkedIcon.alt = "Bookmarked Icon";
    bookmarkedIcon.classList.add("_bookmarked_icon", "_cF_GNewDTGpqsqNfG");

    let unbookmarkedIcon = document.createElement("img");
    unbookmarkedIcon.src = chrome.runtime.getURL(
      "../images/bookmark_outline.png"
    );
    unbookmarkedIcon.alt = "Unbookmarked Icon";
    unbookmarkedIcon.classList.add(
      "_unbookmarked_icon",
      "_cF_GNewDTGpqsqNfG",
      "_cF_K752tsMs7nXG7r-B"
    );

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
      getCredentials();
      let folderDivs = document.querySelectorAll("._la_folder");

      if (folderDivs.length > 0) {
        addToFolderGlobally(chat);
      } else {
        let popup = createPopup();

        // Add event listener to update the folder upon popup confirmation
        popup
          .querySelector("._make_folder_btn")
          .addEventListener("click", () => {
            getCredentials();

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
              false,
              false
            );

            addingToStorageWhileCreatingFirstFolder(
              folder_div,
              chat,
              folderName,
              colorVal
            );

            // At the end remove the popup
            if (popup) onRemovePop();
          });
      }
    });

    // Append the cloned chat to the bookmarked container
    bookmarkedChatContainer.appendChild(clonedChat);

    // Save the bookmark if it wasn't loaded from storage
    if (!isFromStorage) {
      let bookmarkData = {
        id: clonedChat.dataset.chatId || new Date().getTime(), // Use chat id or timestamp if id is not available
        content: clonedChat.outerHTML,
      };

      saveBookmarkToStorage(bookmarkData);
    }
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
      removeBookmarkFromStorage(unbookmarkedChat); // Remove the chat from storage as well
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

async function nCleanChatAndAppend(folder_div, chat) {
  let folderContent = folder_div.querySelector("._folder-content");
  let cloneChat = chat.cloneNode(true);

  let toAppendDiv = cloneChat.querySelector(
    "div.no-draggable span[data-state='closed']"
  );

  let folderId = folder_div.id;
  doChatCleaning(toAppendDiv, cloneChat, folderId);
  if (folderContent) {
    await doCheckingAndStoring(folderId, cloneChat);

    folderContent.appendChild(cloneChat);
  }
}

let addIconsToChat = () => {
  const chats = document.querySelectorAll("ol li.relative");

  chats.forEach((chat) => {
    let bookmarkAdd = chat.querySelector(
      "div.no-draggable span[data-state='closed']"
    );

    if (bookmarkAdd) {
      // The bookmarked Icon
      let bookmarkedIcon = document.createElement("img");
      bookmarkedIcon.src = chrome.runtime.getURL("../images/bookmark_fill.png");
      bookmarkedIcon.alt = "Bookmarked Icon";
      bookmarkedIcon.classList.add("_bookmarked_icon", "_cF_GNewDTGpqsqNfG");

      // The unbookmarked Icon
      let unbookmarkedIcon = document.createElement("img");
      unbookmarkedIcon.src = chrome.runtime.getURL(
        "../images/bookmark_outline.png"
      );
      unbookmarkedIcon.alt = "Unbookmarked Icon";
      unbookmarkedIcon.classList.add(
        "_unbookmarked_icon",
        "_cF_GNewDTGpqsqNfG",
        "_cF_K752tsMs7nXG7r-B"
      );

      // The close Icon
      let addToFolderIcon = document.createElement("img");
      addToFolderIcon.src = chrome.runtime.getURL("../images/new-folder.png");
      addToFolderIcon.alt = "Close Icon";
      addToFolderIcon.classList.add(
        "_add_to_folder_icon",
        "_cF_GNewDTGpqsqNfG"
      );

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
          getCredentials();
          let folderDivs = document.querySelectorAll("._la_folder");
          if (folderDivs.length > 0) {
            addToFolderGlobally(chat);
          } else {
            let popup = createPopup();

            // Add event listener to update the folder upon popup confirmation
            popup
              .querySelector("._make_folder_btn")
              .addEventListener("click", () => {
                getCredentials();

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
                  false,
                  false
                );

                addingToStorageWhileCreatingFirstFolder(
                  folder_div,
                  chat,
                  folderName,
                  colorVal
                );

                // At the end remove the popup
                if (popup) onRemovePop();
              });
          }
        });
      }
    }
  });
};

const addingToStorageWhileCreatingFirstFolder = (
  folder_div,
  chat,
  folderName,
  colorVal
) => {
  let folderContent = folder_div.querySelector("._folder-content");
  let cloneChat = chat.cloneNode(true);

  let toAppendDiv = cloneChat.querySelector(
    "div.no-draggable span[data-state='closed']"
  );

  let folderId = folder_div.id; //Get the unique id of the folder that was assigned during the creation
  doChatCleaning(toAppendDiv, cloneChat, folderId);
  let folderData = {
    id: folderId,
    name: folderName,
    color: colorVal,
    chats: [], // Initialize an empty array for chats
  };

  folderData.chats.push({
    content: cloneChat.outerHTML,
    chat_id: cloneChat.id,
  });

  chrome.storage.local.get(
    [
      "customerId",
      "hasAccess",
      "userHasPayed",
      "isLoggedIn",
      "userId",
      "isCanceled",
    ],
    async (result) => {
      let { customerId, hasAccess, userHasPayed, isLoggedIn, userId } = result;

      if (isLoggedIn && userId && !userHasPayed && !hasAccess) {
        await saveChatAndFoldersToStorage(folderData);
      } else if (
        customerId &&
        hasAccess &&
        userHasPayed &&
        isLoggedIn &&
        userId
      )
        storeFolder(folderData);
    }
  );

  if (folderContent) folderContent.appendChild(cloneChat);
};

function doFolderCreation() {
  return new Promise((resolve, reject) => {
    let popup = createPopup();

    // Add event listener to update the folder upon popup confirmation
    popup.querySelector("._make_folder_btn").addEventListener("click", () => {
      getCredentials();

      let folderName = popup.querySelector("._folder_name_input").value.trim();
      let colorVal = popup.querySelector("._folder_color_input").value;
      let container = document.querySelector("._folderz");
      let allFolders = container.querySelectorAll("._la_folder");

      // Check if a folder with the same name already exists
      let duplicateFolder = Array.from(allFolders).some((folder) => {
        let existingFolderName =
          folder.querySelector("._folder-name").innerText;

        return existingFolderName.toLowerCase() === folderName.toLowerCase();
      });

      if (duplicateFolder) {
        alert("A folder with this name already exists!");
        return;
      }

      // Create New Folder if no duplicates
      let folder_div = createNewFolder(
        folderName,
        colorVal,
        container,
        true,
        false
      );

      // At the end remove the popup
      if (popup) onRemovePop();

      // Resolve the promise with the created folder_div
      resolve({ folder_div, folderName, colorVal });
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
  let folderzClone = la_folderz.cloneNode(true); // Clone the existing folders, these are the existing folders!
  folderzClone.id = "_la_folderz";

  // Create the close button
  let fermerBtn = document.createElement("img");
  fermerBtn.src = chrome.runtime.getURL("../images/crossQ.png");
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
    getCredentials();
    if (folderzClone) folderzClone.remove();
  });

  // Handle folder creation when the create button is clicked
  let laCreateBtn = folderzClone.querySelector("._create_folder_container");
  let fValues = {};
  laCreateBtn.addEventListener("click", () => {
    getCredentials();
    goLookUp = false;

    doFolderCreation().then(({ folder_div, folderName, colorVal }) => {
      insertCheckboxIntoFolder(folder_div); // Insert checkbox into the new folder

      fValues.folderName = folderName;
      fValues.colorVal = colorVal;

      folderzClone.insertBefore(folder_div, saveBtn);
    });
  });

  saveBtn.addEventListener("click", () => {
    getCredentials();

    saveChatsToFolders(
      chat,
      folderzClone,
      true,
      goLookUp,
      fValues.folderName,
      fValues.colorVal
    );
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
  getCredentials();

  let id = e.target;
  let realId = id.parentElement.parentElement.id;
  e.dataTransfer.setData("text/plain", realId); // Use a real unique ID :)
  e.dataTransfer.effectAllowed = "copy";
}

function handleDragOver(e) {
  e.preventDefault(); // Necessary to allow dropping
  e.dataTransfer.dropEffect = "copy";

  getCredentials();
}

// Define the event listener function
const removeClickEvent = (elementToRemove, folderMinusIcon, folderId) => {
  return () => {
    if (elementToRemove) {
      let chatId = elementToRemove.id;

      elementToRemove.remove(); // Remove the element from the dom
      // This takes chatId & folderId to remove the chat from folder. Check function for more
      doChatRemovalCheck(folderId, chatId);

      folderMinusIcon.removeEventListener("click", removeClickEvent); // Remove the click event listener
    }

    getCredentials();
  };
};

function handleDrop(e) {
  e.preventDefault();
  getCredentials();

  let chatId = e.dataTransfer.getData("text/plain");
  let draggedElement = document.getElementById(chatId); // Retrieve the dragged element by ID

  let laFolder = e.target.closest("._la_folder");
  let folder_id = laFolder.id;
  let folderContent = laFolder?.querySelector("._folder-content");

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
      alert("This chat is already exist in this folder!");
      return;
    }
  }

  // Append the cloned message into the folder's content area
  folderContent.appendChild(clonedElement);
  let optionBtn = folderContent.querySelectorAll("li.relative");

  // Creating the minus folder icon
  let folderMinusIcon = document.createElement("img");
  folderMinusIcon.src = chrome.runtime.getURL("../images/minus.png");
  folderMinusIcon.alt = "Folder minus icon";
  folderMinusIcon.classList.add("_folder_minus_icon", "_cF_GNewDTGpqsqNfG");

  // Remove the option btns on the copy chats because they don't work
  let r = -1;
  while (++r < optionBtn?.length) {
    let toAppendDiv = optionBtn[r].querySelector(
      "div.no-draggable span[data-state='closed']"
    );
    doChatCleaning(toAppendDiv, optionBtn[r], folder_id);
  }

  // chrome.storage.local.get(["folders"], (result) => {
  // let folders = result.folders || [];

  // Find the folder in storage
  // let folder = folders.find((f) => f.id === folder_id);
  // if (folder) {
  // Add the chat's HTML and any other metadata you want to save
  // let chatData = {
  //   content: clonedElement.outerHTML,
  //   chat_id: clonedElement.id,
  // };
  // Add the chat to the folder's chats array
  // folder.chats.push(chatData);
  // onAddChat(folder_id, chatData);
  // saveChatAndFoldersToStorage(folder);
  // }
  // });

  doCheckingAndStoring(folder_id, clonedElement);
}

const doChatCleaning = (toAppendDiv, elementToRemove, folderId) => {
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
    folderMinusIcon.src = chrome.runtime.getURL("../images/minus.png");
    folderMinusIcon.alt = "Folder minus icon";
    folderMinusIcon.classList.add("_folder_minus_icon");

    toAppendDiv.appendChild(folderMinusIcon);
    // const elementToRemove = optionBtn[r]; // Capture the element to remove before attaching the listener

    // Attach the event listener for removing the specific element
    let handleRemoveClick = removeClickEvent(
      elementToRemove,
      folderMinusIcon,
      folderId
    );
    folderMinusIcon.addEventListener("click", handleRemoveClick);
  }
};

let openMenu = null; // Track the currently open menu
let createNewFolder = (
  folderName,
  colorVal,
  container,
  doNotAppend,
  isFromStorage = false,
  leId = null
) => {
  // Create new folder element
  let folderDiv = document.createElement("div");
  folderDiv.classList.add("_la_folder");
  folderDiv.id = !isFromStorage ? Date.now().toString() : leId; // Generate a unique id

  // Create closed folder icon
  let folderIcon = document.createElement("img");
  folderIcon.src = chrome.runtime.getURL("../images/closed_folder.png");
  folderIcon.alt = "Folder Icon";
  folderIcon.classList.add("_closed_folder_icon");

  // Creating the open folder icon
  let openFolder = document.createElement("img");
  openFolder.src = chrome.runtime.getURL("../images/open_folder.png");
  openFolder.alt = "Folder Icon";
  openFolder.classList.add("_opened_folders_icon");

  // Creating delete folder icon
  let folderMenu = document.createElement("img");
  folderMenu.src = chrome.runtime.getURL("../images/menu-bar2.png");
  folderMenu.alt = "Folder edit icon";
  folderMenu.classList.add("_folder_edit_icon", "_cF_GNewDTGpqsqNfG");

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
  deleteFolder.src = chrome.runtime.getURL("../images/trash-bin.png");
  deleteFolder.alt = "Folder delete icon";
  deleteFolder.classList.add("_folder_edit_icon", "_cF_GNewDTGpqsqNfG");

  // Creating the folder edit icon
  let editIcon = document.createElement("img");
  editIcon.src = chrome.runtime.getURL("../images/edit-file.png");
  editIcon.alt = "Folder edit icon";
  editIcon.classList.add("_folder_edit_icon", "_cF_GNewDTGpqsqNfG");

  // Creating the folder edit icon
  let addChatIcon = document.createElement("img");
  addChatIcon.src = chrome.runtime.getURL("../images/chat1.png");
  addChatIcon.alt = "Chat icon";
  addChatIcon.classList.add("_folder_menu_chat_icon", "_cF_GNewDTGpqsqNfG");

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
    getCredentials();

    toggleFolderContents(
      folderContent,
      folderIcon,
      openFolder,
      folderTitleContainer
    );
  });

  folderMenu.addEventListener("click", () => {
    getCredentials();

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
    getCredentials();

    folderMenuHolder.style.display = "none";
    let folderId = folderDiv.id;
    openEditPopup(folderTitle, folderTitleSpan, folderContent, folderId);
  });

  // Deleting the folder
  folderDelete.addEventListener("click", () => {
    let folderId = folderDiv.id;
    getCredentials();

    chrome.storage.local.get(
      [
        "customerId",
        "hasAccess",
        "userHasPayed",
        "isLoggedIn",
        "userId",
        "isCanceled",
      ],
      async (result) => {
        let { customerId, hasAccess, userHasPayed, isLoggedIn, userId } =
          result;

        if (isLoggedIn && userId && !userHasPayed && !hasAccess) {
          await ft_delete_folder(folderId);
        } else if (
          customerId &&
          hasAccess &&
          userHasPayed &&
          isLoggedIn &&
          userId
        )
          onDeleteFolder(folderId);
      }
    );

    folderDiv.remove();
    openMenu = null; // Reset openMenu when folder is deleted

    disableAllFunctionalities(); // Updating the disabling and enabling stuff, for more reference look the function
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

    // This is to prevent adding chats to a folder if they did load all!
    // isFinishLoading variable is glob that checks if the chat's has been loaded or not
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
              getCredentials();

              let folderChats = folderDiv.querySelectorAll("li.relative");
              let isExist = 0;
              if (event.target.checked) {
                for (let i = 0; i < folderChats.length; i++) {
                  let folderChatText = folderChats[i].textContent;

                  if (folderChatText === chat.textContent) {
                    isExist = 1;
                    break;
                  }
                }

                // If the chat is already exist, don't add it to the folder.
                isExist
                  ? alert("This chat is already exist in this folder :)")
                  : nCleanChatAndAppend(folderDiv, chat);
              } else {
                for (let i = 0; i < folderChats.length; i++) {
                  let chatId = folderChats[i].id;
                  let folderId = folderDiv.id;

                  if (chatId === chat.id) {
                    folderChats[i].remove();
                    // onRemoveChat(folderId, chatId);
                    // removeChatFromFolder(folderId, chatId);
                    doChatRemovalCheck(folderId, chatId);
                  }
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
        getCredentials();

        chatDiv.remove();
      });

      chatDiv.appendChild(doneBtn);
      document.body.appendChild(chatDiv);
    } else {
      alert(`Your aren't loaded please refresh the page :)`);
    }
  });

  if (!isFromStorage && !doNotAppend) {
    let folderData = {
      id: folderDiv.id,
      name: folderName,
      color: colorVal,
      chats: [], // Initialize an empty array for chats
    };

    chrome.storage.local.get(
      [
        "customerId",
        "hasAccess",
        "userHasPayed",
        "isLoggedIn",
        "userId",
        "isCanceled",
      ],
      async (result) => {
        let { customerId, hasAccess, userHasPayed, isLoggedIn, userId } =
          result;

        if (isLoggedIn && userId && !userHasPayed && !hasAccess) {
          await saveChatAndFoldersToStorage(folderData);
        } else if (
          customerId &&
          hasAccess &&
          userHasPayed &&
          isLoggedIn &&
          userId
        )
          storeFolder(folderData);
      }
    );
  }

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
let openEditPopup = (folderTitle, folderTitleSpan, folderContent, folderId) => {
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
    getCredentials();

    folderName = folderInput.value.trim();
    colorVal = folderColor.value;

    if (folderName) {
      folderTitle.innerText = folderName;
      folderTitleSpan.style.backgroundColor = `${colorVal}`;
      folderContent.style.borderLeft = `1.3px solid ${colorVal}`;

      doCheckAndUpdateFolder(folderName, colorVal, folderId); // This updates the folders on edit after making user check
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
  closeIcon.src = chrome.runtime.getURL("../images/cross.png");
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
    getCredentials();

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
    getCredentials();

    let popup = createPopup();
    let container = document.querySelector("._folderz");

    // Add folder button inside the popup
    popup.querySelector("._make_folder_btn").addEventListener("click", () => {
      getCredentials();

      let folderName = popup.querySelector("._folder_name_input").value.trim();
      let colorVal = popup.querySelector("._folder_color_input").value;

      if (folderName) {
        createNewFolder(folderName, colorVal, container, false, false);
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
    }
  });

  // Add folders, bookmarks, and search bar if not already added
  handleSearchBar();
  startCreatingFolderz();
  addDragAndDropFunctionality();
  createBookmarks();
  addIconsToChat();
  disableFunctionalities();
  disableAllFunctionalities();
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
    inputEle.id = "search-bar_focus";
    getCredentials();
  });

  inputEle.addEventListener("blur", () => {
    inputEle.id = "";
  });

  inputEle.addEventListener("input", () => {
    getCredentials();

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
    }, 300); // Adjust timeout as needed
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
        throttledLoadChats();
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
}

// ---------------------------------------------------------------------------------------------------
// Implementing storage:

function loadBookmarksFromStorage() {
  chrome.storage.sync.get(["bookmarks"], async (result) => {
    let bookmarks = result.bookmarks || [];

    bookmarks.forEach((bookmarkData) => {
      // Use a temporary container to store the bookmark content
      let tempDiv = document.createElement("div");
      tempDiv.innerHTML = bookmarkData.content;

      // Extract the `li` element from the container
      let chat = tempDiv.querySelector("li");
      if (chat) {
        addToBookmarkedFolder(chat, true); // Pass true to indicate it's from storage
      }
    });
  });
}

function saveBookmarkToStorage(bookmarkData) {
  // Get the existing bookmarks from storage
  chrome.storage.sync.get(["bookmarks"], async (result) => {
    let bookmarks = result.bookmarks || [];
    bookmarks.push(bookmarkData);

    // Save the updated bookmarks back to storage
    chrome.storage.sync.set({ bookmarks });
  });
}

function removeBookmarkFromStorage(chatToRemove) {
  chrome.storage.sync.get(["bookmarks"], async (result) => {
    let bookmarks = result.bookmarks || [];

    const chatToRemoveData = chatToRemove.innerText;

    // Filter out the bookmark that matches the chat to be removed
    bookmarks = bookmarks.filter((bookmarkData) => {
      // Use a temporary container to store the bookmark content
      let tempDiv = document.createElement("div");
      tempDiv.innerHTML = bookmarkData.content;

      // Extract the `li` element from the container
      let chat = tempDiv.querySelector("li");
      return chat && chat.innerText !== chatToRemoveData;
    });

    // Save the updated bookmarks back to storage
    chrome.storage.sync.set({ bookmarks });
  });
}

async function loadFoldersFromStorage() {
  chrome.storage.sync.get(["folders"], (result) => {
    let folders = result.folders || [];

    folders.forEach((folderData) => {
      let folderContainer = document.querySelector("._folderz");

      // Create a folder element and ensure it has a data attribute for easy matching
      let folderElement = createNewFolder(
        folderData.name,
        folderData.color,
        folderContainer,
        true,
        true,
        folderData.id
      );

      folderContainer.appendChild(folderElement);

      // Load the chats for this folder
      for (let chat_data of folderData.chats) {
        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = chat_data.content;
        let chatElement = tempDiv.querySelector("li");

        let folderChatsContainer =
          folderElement.querySelector("._folder-content");
        if (folderChatsContainer) {
          folderChatsContainer.appendChild(chatElement);
          let chatRemoveIcon = chatElement.querySelector("._folder_minus_icon");
          // let chatText = chatElement.innerText;

          let handleRemoveClick = removeClickEvent(
            chatElement,
            chatRemoveIcon,
            folderData.id
          );
          chatRemoveIcon.addEventListener("click", handleRemoveClick);
        }
      }
    });
  });
}

async function updateFolderInStorage(folderName, colorVal, folderId) {
  chrome.storage.sync.get(["folders"], (data) => {
    const folders = data.folders;

    // Find the folder and update its name and color
    const folderIndex = folders.findIndex((folder) => folder.id === folderId);

    if (folderIndex > -1) {
      folders[folderIndex].name = folderName;
      folders[folderIndex].color = colorVal;
    }

    // Save the updated folders array
    chrome.storage.sync.set({ folders: folders });
  });
}

const doCheckAndUpdateFolder = (folderName, colorVal, folderId) => {
  chrome.storage.local.get(
    [
      "customerId",
      "hasAccess",
      "userHasPayed",
      "isLoggedIn",
      "userId",
      "isCanceled",
    ],
    async (result) => {
      let { customerId, hasAccess, userHasPayed, isLoggedIn, userId } = result;

      if (isLoggedIn && userId && !userHasPayed && !hasAccess) {
        await updateFolderInStorage(folderName, colorVal, folderId);
      } else if (
        customerId &&
        hasAccess &&
        userHasPayed &&
        isLoggedIn &&
        userId
      )
        onEditFolder(folderName, colorVal, folderId);
    }
  );
};

async function saveChatAndFoldersToStorage(folderData) {
  chrome.storage.sync.get(["folders"], (result) => {
    let folders = result.folders || [];

    // Check if the folder already exists
    let existingFolderIndex = folders.findIndex((f) => f.id === folderData.id);

    if (existingFolderIndex !== -1) {
      // Update only the chats array of the existing folder
      folders[existingFolderIndex].chats = [
        ...folders[existingFolderIndex].chats, // Existing chats
        ...folderData.chats, // New chats to add
      ];
    } else {
      // Push the new folder data if it doesn't exist
      folders.push(folderData);
    }

    // Save folders back to storage
    chrome.storage.sync.set({ folders: folders });
  });
}

async function saveAfterChatRemoval(folderData) {
  chrome.storage.sync.get(["folders"], (result) => {
    let folders = result.folders || [];

    // Check if the folder already exists
    let existingFolderIndex = folders.findIndex((f) => f.id === folderData.id);

    if (existingFolderIndex !== -1) {
      // Update only the chats array of the existing folder
      folders[existingFolderIndex] = folderData;
    } else {
      // Push the new folder data if it doesn't exist
      folders.push(folderData);
    }

    // Save folders back to storage
    chrome.storage.sync.set({ folders: folders });
  });
}

let doCheckingAndStoring = async (folderId, cloneChat) => {
  let chatData = {
    content: cloneChat.outerHTML,
    chat_id: cloneChat.id,
  };

  chrome.storage.local.get(
    [
      "customerId",
      "hasAccess",
      "userHasPayed",
      "isLoggedIn",
      "userId",
      "isCanceled",
    ],
    async (result) => {
      let { customerId, hasAccess, userHasPayed, isLoggedIn, userId } = result;

      if (isLoggedIn && userId && !userHasPayed && !hasAccess) {
        let folderData = {
          id: folderId,
          chats: [],
        };

        folderData.chats.push({
          content: cloneChat.outerHTML,
          chat_id: cloneChat.id,
        });

        await saveChatAndFoldersToStorage(folderData);
      } else if (
        customerId &&
        hasAccess &&
        userHasPayed &&
        isLoggedIn &&
        userId
      )
        await onAddChat(folderId, chatData);
    }
  );
};

const doChatRemovalCheck = (folderId, chatId) => {
  chrome.storage.local.get(
    [
      "customerId",
      "hasAccess",
      "userHasPayed",
      "isLoggedIn",
      "userId",
      "isCanceled",
    ],
    async (result) => {
      let { customerId, hasAccess, userHasPayed, isLoggedIn, userId } = result;

      if (isLoggedIn && userId && !userHasPayed && !hasAccess) {
        await removeChatFromFolder(folderId, chatId);
      } else if (
        customerId &&
        hasAccess &&
        userHasPayed &&
        isLoggedIn &&
        userId
      )
        onRemoveChat(folderId, chatId);
    }
  );
};

// To remove the chat from the storage
async function removeChatFromFolder(folderId, chatId) {
  chrome.storage.sync.get(["folders"], async (result) => {
    let folders = result.folders || [];

    // Find the folder by folderId
    let folder = folders.find((f) => f.id === folderId);
    if (folder) {
      // Find the index of the chat based on its innerText
      const chatIndex = folder.chats.findIndex((chat) => {
        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = chat.content;
        let chatElement = tempDiv.querySelector("li");

        return chatElement && chatElement.id === chatId; // return the chat that should be removed!
      });

      if (chatIndex > -1) {
        // Remove the chat from the folder
        folder.chats.splice(chatIndex, 1);

        // Save the updated folder back to storage
        await saveAfterChatRemoval(folder);
      }
    }
  });
}

// To delete the folder from the storage
async function ft_delete_folder(folderId) {
  chrome.storage.sync.get(["folders"], (result) => {
    let folders = result.folders || [];

    // Find the index of the folder to delete
    const folderIndex = folders.findIndex((f) => f.id === folderId);
    if (folderIndex > -1) {
      folders.splice(folderIndex, 1); // Remove the folder from the array

      // Save the updated folders array back to storage
      chrome.storage.sync.set({ folders });
    }
  });
}

function updateFoldersInStorage(foldersToUpdate) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["folders"], (result) => {
      let folders = result.folders || [];

      foldersToUpdate.forEach((folderToUpdate) => {
        let existingFolder = folders.find((f) => f.id === folderToUpdate.id);

        if (existingFolder) {
          // Add chat to existing folder
          existingFolder.chats.push(folderToUpdate.chatData);
        } else {
          // Add new folder with chat
          folders.push({
            id: folderToUpdate.id,
            name: folderToUpdate.name,
            color: folderToUpdate.color,
            chats: folderToUpdate.chats,
          });
        }
      });

      // Save updated folders back to storage
      chrome.storage.sync.set({ folders: folders }, () => {
        resolve();
      });
    });
  });
}

const saveChatsToFolders = async (
  chat,
  folderzClone,
  do_I_have_to,
  goLookUp,
  folderName,
  colorVal
) => {
  try {
    let allFolders = folderzClone.querySelectorAll("._la_folder");
    let foldersToUpdate = [];

    // Helper function to compare chat content
    const areChatsSame = (chat1, chat2) => {
      // You can adjust these selectors based on your chat structure
      const getChatContent = (chatEl) => {
        const mainContent = chatEl.textContent;
        return mainContent.trim();
      };

      return getChatContent(chat1) === getChatContent(chat2);
    };

    allFolders.forEach((folder) => {
      let folder_input = folder.querySelector("#_folder_chat_input");
      if (folder_input && folder_input.checked) {
        let folderContent;
        do_I_have_to && goLookUp
          ? (folderContent = getFromDom(folder))
          : (folderContent = folder.querySelector("._folder-content"));

        let folderId = folder.id;
        let cloneChat = chat.cloneNode(true);

        if (do_I_have_to && goLookUp) {
          let laChats = folderContent.querySelectorAll("li.relative");
          let k = -1;
          while (++k < laChats?.length) {
            if (areChatsSame(chat, laChats[k])) {
              alert("This chat already exists, so it won't be added!");
              return;
            }
          }
        }

        let toAppendDiv = cloneChat.querySelector(
          "div.no-draggable span[data-state='closed']"
        );

        doChatCleaning(toAppendDiv, cloneChat, folderId);
        if (folderContent && goLookUp) {
          const chatData = {
            content: cloneChat.outerHTML,
            chat_id: cloneChat.id,
          };
          foldersToUpdate.push({ id: folderId, chatData });

          folderContent.appendChild(cloneChat);
        } else if (folderContent && !goLookUp) {
          let container = document.querySelector("._folderz");
          let folder_input = folder.querySelector("#_folder_chat_input");
          let contentFolder = folder.querySelector("._folder-content");

          if (folder_input) {
            folder_input.remove();
          }

          let allFolders = container.querySelectorAll("._la_folder");
          let folderExists = false;

          for (let i = 0; i < allFolders.length; i++) {
            let laDomFolderId = allFolders[i].id;

            if (laDomFolderId === folderId) {
              folderExists = true;
              let existingContentFolder =
                allFolders[i].querySelector("._folder-content");

              // Check if chat already exists by comparing IDs
              let chatExists = Array.from(existingContentFolder.children).some(
                (child) => areChatsSame(child, cloneChat)
              );

              if (!chatExists) {
                existingContentFolder.appendChild(cloneChat);

                const chatData = {
                  content: cloneChat.outerHTML,
                  chat_id: cloneChat.id,
                };
                foldersToUpdate.push({ id: folderId, chatData });
              }
              break;
            }
          }

          if (!folderExists) {
            let folderData = {
              id: folderId,
              name: folderName,
              color: colorVal,
              chats: [],
            };

            folderData.chats.push({
              content: cloneChat.outerHTML,
              chat_id: cloneChat.id,
            });

            foldersToUpdate.push(folderData);
            contentFolder.appendChild(cloneChat);
            folder.appendChild(contentFolder);
            container.appendChild(folder);
          }
        }

        if (folderzClone) folderzClone.remove();
      }
    });

    // Call the async function
    if (foldersToUpdate.length > 0) {
      chrome.storage.local.get(
        [
          "customerId",
          "hasAccess",
          "userHasPayed",
          "isLoggedIn",
          "userId",
          "isCanceled",
        ],
        async (result) => {
          let { customerId, hasAccess, isLoggedIn, userId, userHasPayed } =
            result;

          if (isLoggedIn && userId && !userHasPayed && !hasAccess)
            await updateFoldersInStorage(foldersToUpdate);
          else if (
            isLoggedIn &&
            userId &&
            userHasPayed &&
            hasAccess &&
            customerId
          )
            await onStoreFolderzAndChat(foldersToUpdate);
        }
      );
    }
  } catch (error) {
    // console.error("Error updating folders");
  }
};

function getCredentials() {
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

        disableFunctionalities();
        disableAllFunctionalities();
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

// This function is to disable all the functionalities if the user exhausted the free version and didn't upgrade.
function disableAllFunctionalities() {
  chrome.storage.local.get(
    ["isLoggedIn", "userId", "customerId", "hasAccess", "userHasPayed"],
    (result) => {
      let { hasAccess, userId, customerId, userHasPayed, isLoggedIn } = result;

      let folderDivs = document.querySelectorAll("._la_folder");
      let popupFolderz = document.querySelector("#_la_folderz");

      let bookmarksContainer = document.querySelector(
        "._bookmarked_chats_container"
      );
      let user_bookmarks = bookmarksContainer.querySelectorAll("li");

      if (
        !hasAccess ||
        !userId ||
        !customerId ||
        !userHasPayed ||
        !isLoggedIn
      ) {
        const disableSearch = document.querySelector("._cF_K752tsMs7nXG7r-s");

        // Disable the search
        disableStuff(disableSearch);

        // To disable folder creation
        const disableFolderCreation = document.querySelector(
          "._cF_K752tsMs7nXG7r-f"
        );

        let disAlso;
        if (popupFolderz) {
          disAlso = popupFolderz.querySelectorAll("._la_folder");
          let disableFolderCreationPopUp = popupFolderz.querySelector(
            "._cF_K752tsMs7nXG7r-f"
          );

          if (disAlso.length > 1) {
            disableStuff(disableFolderCreation);
            disableStuff(disableFolderCreationPopUp);
          } else enableStuff(disableFolderCreation);
        }

        folderDivs.length > 1
          ? disableStuff(disableFolderCreation)
          : enableStuff(disableFolderCreation);

        // To disable bookmarking
        const disableBookmarking = document.querySelectorAll(
          "._cF_K752tsMs7nXG7r-B"
        );

        if (user_bookmarks.length >= 1) {
          //Disable add to bookmarks
          disableBookmarking.forEach((element) => {
            disableStuff(element);
          });
        } else {
          disableBookmarking.forEach((element) => {
            enableStuff(element);
          });
        }
      }
    }
  );
}

const disableStuff = (elem) => {
  elem.style.opacity = "0.6";
  elem.style.pointerEvents = "none";
};

const enableStuff = (elem) => {
  elem.style.opacity = "1";
  elem.style.pointerEvents = "auto";
};

// This is just to disable the functionalities if the user didn't logged in!
const disableFunctionalities = () => {
  chrome.storage.local.get(["isLoggedIn", "userId"], (result) => {
    let { userId, isLoggedIn } = result;

    // Select the elements you want to disable
    const elementsToDisable = document.querySelectorAll("._cF_GNewDTGpqsqNfG");

    // Disable the element
    if (!userId || !isLoggedIn) {
      elementsToDisable.forEach((element) => {
        element.style.opacity = "0.6";
        element.style.pointerEvents = "none";

        // Add hover event listener to display "Sign Up" message
        element.addEventListener("mouseenter", () => {
          element.style.pointerEvents = "none";
          element.style.opacity = "0.6";

          const signUpMessage = document.createElement("p");
          signUpMessage.innerText = "Login please!";
          signUpMessage.style.position = "absolute";
          signUpMessage.style.backgroundColor = "orange";
          signUpMessage.style.color = "black";
          signUpMessage.style.padding = "5px";
          signUpMessage.style.borderRadius = ".3rem";
          signUpMessage.style.zIndex = "3000";
          signUpMessage.classList.add("cf_sign-up-message");

          element.appendChild(signUpMessage);

          // Calculate position based on element's bounding rectangle
          const rect = element.getBoundingClientRect();
          signUpMessage.style.top = `${rect.top + window.scrollY}px`;
          signUpMessage.style.left = `${rect.left + window.scrollX}px`;

          // Handle mouseleave to remove the message
          element.addEventListener("mouseleave", () => {
            const signUpMessage = document.querySelector(".cf_sign-up-message");
            if (signUpMessage) {
              signUpMessage.remove();
            }
          });
        });
      });
    }
  });
};

// Listen for the message from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "dataSet") {
    disableFunctionalities();
    disableAllFunctionalities();
  }
});

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
      disableFunctionalities();
      disableAllFunctionalities();
    }
  }
});

// --------------------------------------------------------------------------------------------------------------------
// Storage

const storeFolder = (folderData) => {
  chrome.runtime.sendMessage(
    { action: "onStoreFolder", folderData },
    async (response) => {
      if (response?.success) {
        // console.log("Successfully inserted the folder");
      } else {
        // console.error("Didn't insert the folder");
      }
    }
  );
};

let getUserFolders = () => {
  chrome.runtime.sendMessage(
    { action: "onGetUserFolderz" },
    async (response) => {
      if (response?.success) {
        let { folders } = response.data;

        folders.forEach((f) => {
          let folderContainer = document.querySelector("._folderz");

          // Create a folder element and ensure it has a data attribute for easy matching
          let folderElement = createNewFolder(
            f.folder_name,
            f.folder_color,
            folderContainer,
            true,
            true,
            f.folder_id
          );

          folderContainer.appendChild(folderElement);

          // Load the chats for this folder
          for (let chat_data of f.chats) {
            let tempDiv = document.createElement("div");
            tempDiv.innerHTML = chat_data.content;
            let chatElement = tempDiv.querySelector("li");

            let folderChatsContainer =
              folderElement.querySelector("._folder-content");

            if (folderChatsContainer) {
              folderChatsContainer.appendChild(chatElement);
              let chatRemoveIcon = chatElement.querySelector(
                "._folder_minus_icon"
              );

              let handleRemoveClick = removeClickEvent(
                chatElement,
                chatRemoveIcon,
                f.folder_id
              );
              chatRemoveIcon.addEventListener("click", handleRemoveClick);
            }
          }
        });
      } else {
        // console.error("Didn't insert the folder");
      }
    }
  );
};

let onRemoveChat = (folderId, chatId) => {
  let folderData = {
    folderId,
    chatId,
  };

  chrome.runtime.sendMessage(
    { action: "onRemoveChat", folderData },
    async (response) => {
      if (response?.success) {
        // console.log("The chat has been removed successfully");
      } else {
        // console.error("Didn't insert the folder");
      }
    }
  );
};

function onDeleteFolder(folderId) {
  chrome.runtime.sendMessage(
    { action: "onDeleteFolder", folderId },
    async (response) => {
      if (response?.success) {
        // console.log("The folder has been deleted successfully");
      } else {
        // console.error("Didn't insert the folder");
      }
    }
  );
}

const onAddChat = async (folderId, chatData) => {
  let folderData = {
    folderId,
    chatData,
  };

  chrome.runtime.sendMessage(
    { action: "onAddChat", folderData },
    async (response) => {
      if (response?.success) {
        // console.log("The chat was added successfully");
      } else {
        // console.error("Didn't insert the folder");
      }
    }
  );
};

let onEditFolder = (folderName, colorVal, folderId) => {
  let folderData = {
    folderName,
    folderId,
    colorVal,
  };

  chrome.runtime.sendMessage(
    { action: "onEditFolder", folderData },
    async (response) => {
      if (response?.success) {
        // console.log("The folder edited successfully");
      } else {
        // console.log("The folder didn't get updated");
      }
    }
  );
};

// This function does it all, it takes this that contains multiple folders and chat and store them one by one
// Basically, the things the function that's calling this is kinda wired! First of all, I allow a user to create
// Folders on the fly and the function takes the folders created on the fly and the old ones
// and preform a different operation before it pass this heavily modified array to store it!

const onStoreFolderzAndChat = async (foldersToUpdate) => {
  return new Promise((resolve, reject) => {
    for (const folderToUpdate of foldersToUpdate) {
      // Send each folder update to the server one by one
      chrome.runtime.sendMessage(
        { action: "onUpdateFolderChat", folderToUpdate },
        async (response) => {
          if (response?.success) {
            // console.log("The folder edited successfully");

            resolve();
          } else {
            // console.log("The folder didn't get updated");
          }
        }
      );
    }
  });
};

const doCheckAndLoadUserStuff = () => {
  chrome.storage.local.get(
    ["customerId", "hasAccess", "userHasPayed", "isLoggedIn", "userId"],
    async (result) => {
      let { customerId, hasAccess, isLoggedIn, userId, userHasPayed } = result;

      if (isLoggedIn && userId && !userHasPayed && !hasAccess)
        loadFoldersFromStorage();
      else if (isLoggedIn && userId && userHasPayed && hasAccess && customerId)
        getUserFolders();
    }
  );
};

// --------------------------------------------------------------------------------------------------------------------

// Call these functions when the extension and the dom loads
window.addEventListener("load", () => {
  // Appending element to the main container
  mainElement.appendChild(searchContainer); // The search
  mainElement.appendChild(createBookmarks()); // The Bookmarks
  folderz.appendChild(h3Element);
  folderz.appendChild(createFolderContainer);
  mainElement.appendChild(folderz); // The folderz title

  // Load the chat ann folders only if the user is loggedIn
  chrome.storage.local.get(["isLoggedIn", "userId"], (result) => {
    let { userId, isLoggedIn } = result;

    // let { userId, isLoggedIn } = userInfoOnLoad;
    if (userId && isLoggedIn) {
      // setInterval(getCredentials, 2000);

      loadBookmarksFromStorage();
      // loadFoldersFromStorage();
      doCheckAndLoadUserStuff();
    }
  });

  disableFunctionalities();
  disableAllFunctionalities();

  // Initial run
  addElements();
  getCredentials();
  observeDOMChanges(); // This function is to load all the user's chats on the initial load

  // Periodically check for new code blocks (as a fallback)
  setInterval(addElements, 2000);
});
