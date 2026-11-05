const burger = document.getElementById("burger");
const links = document.getElementById("links");

if (burger && links) {
    burger.addEventListener("click", () => links.classList.toggle("open"));
}
