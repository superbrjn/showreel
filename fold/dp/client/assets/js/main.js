const tasks = document.querySelector(".content-list");

const filterBtn = document.querySelector(".btn__active");
const addBtn = document.querySelector(".btn__create");
const editBtn = document.querySelector(".btn__edit");
const uploadBtn = document.querySelector(".btn__upload");

// filter opt-actual
// filter opt-completed
// filter opt-all

const overlay = document.querySelector(".overlay");
const overlayWindow = overlay.querySelector("modal-window");
const overlayClose = overlay.querySelector(".close-btn");

filterBtn.addEventListener("click", showOptions);
addBtn.addEventListener("click", createNew);
editBtn.addEventListener("click", updateItem);
overlayClose.addEventListener("click", close);

function showOptions(e) {
  // show options bar
  const src = e.currentTarget.querySelector("div"); // take src of pic
  // keep data
  overlayImage.src = src; // put src of pic
  overlay.classList.add("open");
}
function createNew(e) {
  // show modal window
  //const src = e.currentTarget.querySelector("img").src; // take src of pic
  // get data
  // save
  //overlayImage.src = src; // put src of pic
  overlay.classList.add("open");
}
function updateItem(e) {
  // get item data
  const src = e.currentTarget.querySelector("img").src; // take src of pic
  // let edit
  // save
  overlayImage.src = src; // put src of pic
  // show
  overlay.classList.add("open");
}
function close() {
  overlay.classList.remove("open");
}
