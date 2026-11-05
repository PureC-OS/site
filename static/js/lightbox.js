const shots = document.querySelectorAll(".shot");

if (shots.length) {
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = "<img alt=''>";
    document.body.appendChild(lb);
    shots.forEach((s) => {
        s.addEventListener("click", () => {
            lb.querySelector("img").src = s.querySelector("img").src;
            lb.classList.add("on");
        });
    });
    lb.addEventListener("click", () => lb.classList.remove("on"));
    addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            lb.classList.remove("on");
        }
    });
}
