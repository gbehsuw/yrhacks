const inputElement = document.querySelector("#searchInput");
const searchIcon = document.querySelector("#searchCloseIcon");
const sortWrapper = document.querySelector(".sortWrapper");

// add event listeners
inputElement.addEventListener("input", () => {
    handleInputChange(inputElement);
});
searchIcon.addEventListener("click",
    handleSearchClose
);
sortWrapper.addEventListener("click",
    handleSortIcon
);

// when user uses search bar
function handleInputChange(inputElement) {
    const inputValue = inputElement.value;
    if (inputValue !== "") {
        document.querySelector(".searchCloseIcon").classList.add("searchCloseIconVisible");
    } else {
        document.querySelector(".searchCloseIcon").classList.remove("searchCloseIconVisible");
    }
}

// when user closes search
function handleSearchClose() {
    document.querySelector("#searchInput").value = "";
    document.querySelector(".searchCloseIcon").classList.remove("searchCloseIconVisible");
    handleSortIcon()
}

// when user uses filter
function handleSortIcon() {
    document.querySelector(".filterWrapper").classList.toggle("filterWrapperOpen");
    document.querySelector("body").classList.toggle("filterWrapperOverlay")
}
