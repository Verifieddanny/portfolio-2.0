const timeEl = document.querySelector(".time");
const dateEl = document.querySelector(".day");
const loader = document.querySelector(".loader");
const tiktok = document.querySelector(".tiktok");
const twitter = document.querySelector(".twitter");
const pageDisplay = document.querySelectorAll(".getDisplay");
const github = document.querySelector(".github_white");
const aboutMe = document.querySelector(".customer-service");
const tiktokDisplay = document.querySelector(".tiktokDisplay");
const twitterDisplay = document.querySelector(".twitterDisplay");
const githubDisplay = document.querySelector(".github_whiteDisplay");
const aboutMeDisplay = document.querySelector(".customer-serviceDisplay");
const windows = document.querySelector(".windows");
const minimize = document.querySelectorAll(".tasksBar div:nth-child(1)");
const maxmize = document.querySelectorAll(".tasksBar div:nth-child(2)");
const closeWin = document.querySelectorAll(".tasksBar div:nth-child(3)");
const body = document.querySelector("body");
// const firstDivison = document.querySelector(".first-division");
// const description = document.querySelector(".first-division div");

//windows loader

setTimeout(function () {
  loader.classList.add("hide");
}, 2500);

//time config code

function getTimeDate() {
  const nows = new Date();

  nows.toLocaleString("en-US", {
    hour12: false,
  });
  //for the date convention
  let month = nows.getMonth() + 1;
  let day = nows.getDate();
  let year = nows.getFullYear();

  let date = `${month}/${day}/${year}`;
  //for the time convention
  let hour = nows.getHours();
  let min = nows.getMinutes().toString().padStart(2, "0");
  let sec = nows.getSeconds().toString().padStart(2, "0");

  let time = `${hour}:${min}:${sec}`;

  timeEl.textContent = time;
  dateEl.textContent = date;
}

setInterval(getTimeDate, 1000);

let executed = {};
let displays = [];
function displayEl(element) {
  element.addEventListener("click", function () {
    if (!executed[element.className]) {
      let el = document.querySelector(`.${element.className}Display`);

      el.style.display = "flex";
      const img = `
      <div class="active" data-id='${
        element.className === "tiktok"
          ? 1
          : element.className === "twitter"
          ? 2
          : element.className === "github_white"
          ? 3
          : element.className === "customer-service"
          ? 4
          : 0
      }'>
      <img class="taskApp tkt ${element.className}Clone" src="./src/${
        element.className
      }.png" />
      <div>`;
      windows.insertAdjacentHTML("beforeend", img);
      executed[element.className] = true;

      //
    }
  });
}

displayEl(tiktok);
displayEl(twitter);
displayEl(github);
displayEl(aboutMe);

function makeDraggable(element, container) {
  let isDragging = false;
  let initialX, initialY, offsetX, offsetY;

  element.addEventListener("mousedown", startDrag);
  element.addEventListener("touchstart", startDrag);

  function startDrag(event) {
    event.preventDefault();

    isDragging = true;

    initialX = event.clientX || event.touches[0].clientX;
    initialY = event.clientY || event.touches[0].clientY;

    const rect = element.getBoundingClientRect();
    offsetX = rect.left;
    offsetY = rect.top;

    document.addEventListener("mousemove", drag);
    document.addEventListener("touchmove", drag, { passive: false });

    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchend", stopDrag);
    document.addEventListener("touchcancel", stopDrag);
  }

  function drag(event) {
    if (!isDragging) return;
    event.preventDefault();

    const currentX = event.clientX || event.touches[0].clientX;
    const currentY = event.clientY || event.touches[0].clientY;
    const deltaX = currentX - initialX;
    const deltaY = currentY - initialY;

    const newX = offsetX + deltaX;
    const newY = offsetY + deltaY;

    // Check if the element is within the container bounds
    const containerRect = container.getBoundingClientRect();
    const containerLeft = containerRect.left;
    const containerTop = containerRect.top;
    const containerRight = containerRect.right;
    const containerBottom = containerRect.bottom;

    if (
      newX >= containerLeft &&
      newX + element.offsetWidth <= containerRight &&
      newY >= containerTop &&
      newY + element.offsetHeight <= containerBottom
    ) {
      // Update the position of the element
      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;
    }
  }

  function stopDrag() {
    isDragging = false;
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("touchmove", drag);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchend", stopDrag);
    document.removeEventListener("touchcancel", stopDrag);
  }
}
let originHeight, originWidth;

function makeResizable(element, minWidth, minHeight) {
  const computedStyle = window.getComputedStyle(element);
  originWidth = computedStyle.width;

  originHeight = computedStyle.height;

  interact(element).resizable({
    edges: { left: true, right: true, bottom: true, top: true },
    modifiers: [
      interact.modifiers.restrictSize({
        min: { width: minWidth, height: minHeight },
      }),
    ],
    listeners: {
      move(event) {
        const { target, rect } = event;
        const { width, height } = rect;

        target.style.width = `${width}px`;
        target.style.height = `${height}px`;
      },
    },
  });
  return { originHeight, originWidth };
}

// Usage:
pageDisplay.forEach((getDis) => {
  makeDraggable(getDis, body);
  makeResizable(getDis, 620, 528);
});

//task bars
let isExpanded = false;
let originalPos = {};

function bigger(element) {
  if (!isExpanded) {
    // Expand the element
    originalPos.left = element.style.left;
    originalPos.top = element.style.top;
    element.style.left = "0";
    element.style.top = "0";

    element.style.width = "100vw";
    element.style.height = "100vh";
    element.classList.add("toggle");
  } else {
    // Return to original position
    element.style.left = originalPos.left;
    element.style.top = originalPos.top;
    element.style.width = originWidth;
    element.style.height = originHeight;
    element.classList.remove("toggle");
  }

  isExpanded = !isExpanded;
}

function small(element) {
  element.style.transition = `0.5s all ease-in-out`;
  element.classList.add("minimize");
  element.style.transition = ` transform 0.3s ease`;
}
function closeWindow(element) {
  const dataId = element.dataset.id;

  const taskBarApp = document.querySelectorAll(".windows .active");

  taskBarApp.forEach((apps) => {
    if (dataId === apps.dataset.id) {
      apps.remove(apps);
    }
  });

  element.style.display = "none";

  executed = {};
}

function getParent(val) {
  const parentElement = val.offsetParent;
  const grandparentElement = parentElement.parentElement;
  return grandparentElement;
}

maxmize.forEach((maxDisplay) =>
  maxDisplay.addEventListener("click", function () {
    const grandparentElement = getParent(maxDisplay);
    bigger(grandparentElement);
  })
);

minimize.forEach((miniDisplay) => {
  miniDisplay.addEventListener("click", function () {
    const grandparentElement = getParent(miniDisplay);
    small(grandparentElement);
  });
});

closeWin.forEach((closeUp) => {
  closeUp.addEventListener("click", function () {
    const grandparentElement = getParent(closeUp);
    closeWindow(grandparentElement);
  });
});

windows.addEventListener("click", function (event) {
  const target = event.target;
  if (target.classList.contains("tiktokClone")) {
    if (tiktokDisplay.classList.contains("minimize")) {
      tiktokDisplay.classList.remove("minimize");
    }
  } else if (target.classList.contains("twitterClone")) {
    if (twitterDisplay.classList.contains("minimize")) {
      twitterDisplay.classList.remove("minimize");
    }
  } else if (target.classList.contains("github_whiteClone")) {
    if (githubDisplay.classList.contains("minimize")) {
      githubDisplay.classList.remove("minimize");
    }
  } else if (target.classList.contains("customer-serviceClone")) {
    if (aboutMeDisplay.classList.contains("minimize")) {
      aboutMeDisplay.classList.remove("minimize");
    }
  }
});

//twitter widget
// Load the Twitter widget JavaScript asynchronously
(function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "twitter-wjs");

const myDiv = document.querySelector(".description");
const pText = document.querySelector(".description p");
const headText = document.querySelector(".description .h1");
function adjustFontSize() {
  const width = myDiv.offsetWidth;
  const fontSize = width / 8;
  const fontSizeMini = width / 16; // Adjust the division value as per your requirement
  pText.style.fontSize = `${fontSizeMini}px`;
  headText.style.fontSize = `${fontSize}px`;
}

window.addEventListener("resize", adjustFontSize);

pageDisplay.forEach((page) => {
  page.addEventListener("click", () => {
    console.log(`qqw`, page);
    pageDisplay.forEach((display) => {
      if (display.classList.contains("to-front")) {
        display.classList.remove("to-front");
      }
    });
    if (page.classList.contains("to-front")) {
      page.classList.remove("to-front");
    } else {
      page.classList.add("to-front");
    }
  });
});
