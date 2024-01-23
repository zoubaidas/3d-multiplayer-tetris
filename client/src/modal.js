/**
 * 
 * Modal Component - 
 * Used to display a modal on the screen with title, message and button - ShowModal and HideModal
 * 
 * @param {string} titleText - Title of the modal
 * @param {string} messageText - Message of the modal
 * @param {string} btnText - Text of the button
 * @param {function} callback - Callback function when the button is clicked
 * 
 * @example
 * ShowModal('Title', 'Message', 'Button Text', () => {
 *     // Callback function
 * });
 */

function ShowModal(titleText, messageText, btnText, callback) {
    var modal = document.getElementById("modal");
    var title = document.getElementById("modalTitle");
    var message = document.getElementById("modalMessage");
    var btn = document.getElementById("modalBtn");

    if (!titleText || titleText === '') {
        title.style.display = "none";
    }
    else {
        title.style.display = "block";
        title.innerHTML = titleText;
    }
    message.innerHTML = messageText;
    if (!btnText || btnText === '') {
        btn.style.display = "none";
    } else {
        btn.style.display = "inline";
        btn.innerHTML = btnText;

        btn.onclick = function () {
            callback();
        }
    }
    modal.style.display = "flex";
}

function HideModal() {
    var modal = document.getElementById("modal");
    modal.style.display = "none";
}


export { HideModal, ShowModal };

