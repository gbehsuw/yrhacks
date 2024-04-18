const inputElement = document.querySelector("#searchInput");
const searchIcon = document.querySelector("#searchCloseIcon");
const sortWrapper = document.querySelector(".sortWrapper");

inputElement.addEventListener("input", () => {
    handleInputChange(inputElement);
});
searchIcon.addEventListener("click",
    handleSearchClose
);
sortWrapper.addEventListener("click",
    handleSortIcon
);

function handleInputChange(inputElement) {
    const inputValue = inputElement.value;
    if (inputValue !== "") {
        document.querySelector(".searchCloseIcon").classList.add("searchCloseIconVisible");
    } else {
        document.querySelector(".searchCloseIcon").classList.remove("searchCloseIconVisible");
    }
}

function handleInputChange(inputElement) {
    const inputValue = inputElement.value;
    if (inputValue !== "") {
        document.querySelector(".searchCloseIcon").classList.add("searchCloseIconVisible");
    } else {
        document.querySelector(".searchCloseIcon").classList.remove("searchCloseIconVisible");
        handleSortIcon()
    }
}

function handleSearchClose() {
    document.querySelector("#searchInput").value = "";
    document.querySelector(".searchCloseIcon").classList.remove("searchCloseIconVisible");
    handleSortIcon()
}

function handleSortIcon() {
    document.querySelector(".filterWrapper").classList.toggle("filterWrapperOpen");
    document.querySelector("body").classList.toggle("filterWrapperOverlay")
}