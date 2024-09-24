const extraStuff = document.querySelector("_the_container");

// The chat icon
const icon = document.createElement("img");
icon.src = chrome.runtime.getURL("./images/chat.png"); // Use chrome.runtime.getURL to get the correct path
icon.alt = "Custom Icon";
icon.id = "custom-icon"; // Set the id
icon.style.width = "16px"; // Adjust the size as needed
icon.style.height = "16px"; // Adjust the size as needed
icon.style.verticalAlign = "middle"; // Example: aligning vertically

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
    if (!thirdChild || !thirdChild.classList?.contains("search-bar")) {
      searchInsert[y].insertBefore(extraStuff, thirdChild);

      let inputEle = document.querySelector("search-bar");
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
