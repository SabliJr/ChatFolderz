let chats = [];

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

      // Remove the bookmarked icon and append the unbookmarked icon
      if (bookmarkedIcon) {
        bookmarkAdd.removeChild(bookmarkedIcon);
        bookmarkAdd.appendChild(unbookmarkedIcon);
      }
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
      bookmarkAdd.replaceChild(unbookmarkedIcon, bookmarkedIcon);
      removeUnbookmarkedChat(chat);
      if (isInBookmarkFolder) {
        updateOriginalChatIcon(chat);
      }
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

function cleanChatAndAppend(folder_div, chat, do_I_have_to) {
  let folderContent;
  do_I_have_to
    ? (folderContent = getFromDom(folder_div))
    : (folderContent = folder_div.querySelector("._folder-content"));
  let cloneChat = chat.cloneNode(true);

  let toAppendDiv = cloneChat.querySelector(
    "div.no-draggable span[data-state='closed']"
  );

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
    const elementToRemove = cloneChat; // Capture the element to remove before attaching the listener

    // Attach the event listener for removing the specific element
    let handleRemoveClick = removeClickEvent(elementToRemove, folderMinusIcon);
    folderMinusIcon.addEventListener("click", handleRemoveClick);
  }

  if (folderContent) folderContent.appendChild(cloneChat);
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
            //Creating a btn to save the changes
            let saveBtn = document.createElement("button");
            saveBtn.innerText = "Save";
            saveBtn.classList.add("_save_btn");

            let la_folderz = document.querySelector("._folderz");
            let folderzClone = la_folderz.cloneNode(true);
            folderzClone.id = "_la_folderz";

            let la_title = folderzClone.querySelector("._folderz_title");
            la_title.style.margin = "0";

            let clonedFolderDivs = folderzClone.querySelectorAll("._la_folder");
            clonedFolderDivs.forEach((folder) => {
              let folderInput = document.createElement("input");
              folderInput.type = "checkbox";
              folderInput.id = "_folder_chat_input";

              let whereToAppend = folder.querySelector(
                "._folder_title_container"
              );

              if (whereToAppend.firstChild) {
                whereToAppend.insertBefore(
                  folderInput.cloneNode(true),
                  whereToAppend.firstChild
                );
              } else {
                whereToAppend.appendChild(folderInput);
              }
            });

            saveBtn.addEventListener("click", () => {
              clonedFolderDivs.forEach((folder) => {
                let folder_input = folder.querySelector("#_folder_chat_input");
                if (folder_input && folder_input.checked) {
                  cleanChatAndAppend(folder, chat, true);
                  if (folderzClone) folderzClone.remove();
                }
              });
            });

            // Append the clone to the body (or any other container)
            folderzClone.appendChild(saveBtn);
            document.body.appendChild(folderzClone);
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
                  container
                );

                cleanChatAndAppend(folder_div, chat, false);

                // At the end remove the popup
                if (popup) onRemovePop();
              });
          }
        });
      }
    }
  });
};

// Function to remove event listeners (call this when needed)
let removeBookmarkListeners = () => {
  console.log("This function get called!!");
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

    // Remove the bookmark and the options btn
    let rBtn = optionBtn[r].querySelector(
      "div.no-draggable span[data-state='closed'] button"
    );
    let rImg = optionBtn[r].querySelector(
      "div.no-draggable span[data-state='closed'] img"
    );

    if (rImg) toAppendDiv.removeChild(rImg);
    if (rBtn) toAppendDiv.removeChild(rBtn);

    // Check if the icon already exists to prevent duplicates
    if (!toAppendDiv.querySelector("img._folder_minus_icon")) {
      // Creating the minus folder icon
      let folderMinusIcon = document.createElement("img");
      folderMinusIcon.src = chrome.runtime.getURL("./images/minus.png");
      folderMinusIcon.alt = "Folder minus icon";
      folderMinusIcon.classList.add("_folder_minus_icon");

      toAppendDiv.appendChild(folderMinusIcon);
      const elementToRemove = optionBtn[r]; // Capture the element to remove before attaching the listener

      // Attach the event listener for removing the specific element
      let handleRemoveClick = removeClickEvent(
        elementToRemove,
        folderMinusIcon
      );
      folderMinusIcon.addEventListener("click", handleRemoveClick);
    }
  }
}

let createNewFolder = (folderName, colorVal, container) => {
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

  // Creating the folder edit icon
  let editIcon = document.createElement("img");
  editIcon.src = chrome.runtime.getURL("./images/edit.png");
  editIcon.alt = "Folder edit icon";
  editIcon.classList.add("_folder_edit_icon");

  // Creating delete folder icon
  let deleteFolder = document.createElement("img");
  deleteFolder.src = chrome.runtime.getURL("./images/bin.png");
  deleteFolder.alt = "Folder edit icon";
  deleteFolder.classList.add("_folder_edit_icon");

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
  folderTitleSpan.appendChild(editIcon);
  folderTitleSpan.appendChild(deleteFolder);

  // Append icon and name to folder div
  folderTitleContainer.appendChild(folderIcon);
  folderTitleContainer.appendChild(folderTitleSpan);
  folderDiv.appendChild(folderTitleContainer);
  folderDiv.appendChild(folderContent);

  // Add click event to toggle the visibility of the folder contents
  folderTitle.addEventListener("click", () => {
    toggleFolderContents(
      folderContent,
      folderIcon,
      openFolder,
      folderTitleContainer
    );
  });

  // Add click event to edit the folder
  editIcon.addEventListener("click", () => {
    openEditPopup(folderTitle, folderTitleSpan, folderContent);
  });

  // Insert the new folder into the container
  container.appendChild(folderDiv);

  // Deleting the folder
  deleteFolder.addEventListener("click", () => {
    folderDiv.remove();
  });

  return folderDiv;
};

// This function converts RGB to Hex
function rgbToHex(rgb) {
  // Extract the RGB values
  const result = rgb.match(/\d+/g);
  if (!result) return "#f6b73c"; // Default color if parsing fails

  // Convert each value to hex and pad with zeros if necessary
  const r = parseInt(result[0]).toString(16).padStart(2, "0");
  const g = parseInt(result[1]).toString(16).padStart(2, "0");
  const b = parseInt(result[2]).toString(16).padStart(2, "0");

  // Combine into a single hex string
  return `#${r}${g}${b}`;
}

// This function is to edit the folder
let openEditPopup = (folderTitle, folderTitleSpan, folderContent) => {
  // Create and append popup to body again to edit it
  let popup = createPopup();

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
        createNewFolder(folderName, colorVal, container);
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

// Appending element to the main container
mainElement.appendChild(searchContainer); // The search
mainElement.appendChild(createBookmarks()); // The Bookmarks
folderz.appendChild(h3Element);
folderz.appendChild(createFolderContainer);
mainElement.appendChild(folderz); // The folderz title

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
