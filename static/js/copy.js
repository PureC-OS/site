document.querySelectorAll(".copy").forEach((box) => {
    const btn = document.createElement("button");
    btn.textContent = "copy";
    btn.addEventListener("click", () => {
        navigator.clipboard.writeText(box.querySelector(".code").innerText).then(() => {
            btn.textContent = "copied!";
            setTimeout(() => (btn.textContent = "copy"), 1500);
        });
    });
    box.appendChild(btn);
});
