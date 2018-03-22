//<dialog open> ....
//has no browser support yet
//following is key-trap for a modal window
//as shown in lesson 17

//Will hold prev focused element
var focusedElementBeforeModal;

//Find modal and overlay
var modal = document.querySelector('.modal');
var modalOverlay = document.querySelector('.modal-overlay');

var modalToggle = document.querySelector('.modal-toggle');
modalToggle.addEventListener('click', openModal);

function openModal() {
  //Save current focus
  focusedElementBeforeModal = document.activeElement;

  //Listen for and trap Keyboard
  modal.addEventListener('keydown', trapTabKey);

  //Listen for indicators to close modal
  modalOverlay.addEventListener('click', closeModal);

  //Sign-Up button
  var signUpBtn = modal.querySelector('#signup');
  signUpBtn.addEventListener('click', closeModal);

  //Find all focusable children
  var focusableElementsString = `a[href], area[href],
    input:not([disabled]), select:not([disabled]),
    textarea:not([disabled]), button:not([disabled]),
    iframe, object, embed, [tabindex="0"], [contenteditable]`;

  var focusableElements = modal.querySelectorAll(focusableElementsString);

  //Convert NodeList to Array
  focusableElements = Array.prototype.slice.call(focusableElements);

  var firstTabStop = focusableElements[0];
  var lastTabStop = focusableElements[focusableElements.length - 1];

  //Show the modal and overlay
  modal.style.display = 'block';
  modalOverlay.style.display = 'block';

  //Focus first children
  firstTabStop.focus();

  function trapTabKey(e) {
    //Check for TAB key press
    if (e.keyCode === 9){

      //Shift+TAB
      if(e.shiftKey){
        if(document.activeElement === firstTabStop) {
          e.preventDefault();
          lastTabStop.focus();
        }
      } else {
        if (document.activeElement === lastTabStop) {
          e.preventDefault();
          firstTabStop.focus();
        }
      }
    }

    //Escape
    if (e.keyCode === 27){
      closeModal();
    }
  }
}

function closeModal() {
  //Hide modal and overlay
  modal.style.display = 'none';
  modalOverlay.style.display = 'none';

  //Set focus back to element that had it before modal opened
  focusedElementBeforeModal.focus();
}
