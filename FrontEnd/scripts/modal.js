// Modal opening and closing

document.addEventListener("DOMContentLoaded", () => {
    const linkOpenModal = document.querySelector(".js-modal");
    linkOpenModal.addEventListener("click", openModal);

    showProject();
})

let modal = null;
const focusableSelector = 'a, button, input, textarea';
let focusableElements = [];
let previouslyFocusedElement = null;

const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href"));
    focusableElements = Array.from(modal.querySelectorAll(focusableSelector));
    previouslyFocusedElement = document.querySelector(':focus');
    modal.style.display = null;
    focusableElements[0].focus();
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop-propagation").addEventListener("click", stopPropagation);
}

const closeModal = function (e) {
    if (modal === null) return
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
    e.preventDefault();
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop-propagation").removeEventListener("click", stopPropagation);
    const hideModal = function () {
        modal.style.display = "none";
        modal.removeEventListener("animationend", hideModal);
        modal = null;
    }
    modal.addEventListener("animationend", hideModal);
}

const stopPropagation = function (e) {
    e.stopPropagation();
}

const focusInModal = function (e) {
    e.preventDefault();
    let index = focusableElements.findIndex(f => f === modal.querySelector(':focus'));
    if (e.shiftKey === true) {
        index--
    } else {
        index++;
    }
    if (index >= focusableElements.length) {
        index = 0;
    }
    if (index < 0) {
        index = focusableElements.length - 1;
    }
    focusableElements[index].focus();
}

window.addEventListener("keydown", function (e) {
    e.preventDefault();
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e);
    }
})

// Projects presented in modal

async function showProject() {
    const url = 'http://localhost:5678/api/works';
    const response = await fetch(url).then(response => response.json());

    for (let i = 0; i < response.length; i++) {
        const projectImageUrl = response[i].imageUrl;

        const imageProject = document.createElement("img");
        imageProject.src = projectImageUrl;

        const projectInModal = document.createElement("div");
        projectInModal.setAttribute("class", "project-in-modal");
        projectInModal.append(imageProject);

        const divShowProjectModal = document.querySelector(".modal-gallery");
        divShowProjectModal.append(projectInModal);
    }
}