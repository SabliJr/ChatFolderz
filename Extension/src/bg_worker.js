// Create a new <link> element for the Font Awesome stylesheet
const link = document.createElement("link");
link.rel = "stylesheet";
link.href =
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css";
link.integrity =
  "sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA==";
link.crossOrigin = "anonymous";

// Append the <link> element to the <head> of the document
document.head.appendChild(link);

// Create a new <i> element for the custom icon
const icon = document.createElement("i");
icon.className = "fa-solid fa-message";

// const targetElements = document.getElements("ol");
// console.log(targetElements);
// Create a MutationObserver to watch for changes to the DOM.

let targetElement = document.querySelectorAll("ol li.relative");
console.log(targetElement);

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    let targetElement = document.querySelectorAll("ol li.relative");
    console.log(targetElement);
    if (targetElement) {
      // Insert your custom logic here
      console.log("Element found, modifying interface...");
      console.log(targetElement);
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });

// Select all <li> elements inside <ol> elements with specific classes
// const appendIcon = () => {
//   const targetElements = document.getElementsByTagName("ol");

//   if (targetElements.length > 0) {
//     targetElements.forEach((element) => {
//       // Clone the icon for each target element to avoid moving the same element
//       const iconClone = icon.cloneNode(true);
//       element.appendChild(iconClone);
//     });
//   } else {
//     console.warn(
//       "No <li> elements found inside <ol> elements with the specified classes. Appending icon to the body instead."
//     );
//     document.body.appendChild(icon);
//   }
// };
