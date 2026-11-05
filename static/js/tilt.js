const stage = document.querySelector(".stage");
const tilt = document.querySelector(".tilt");

if (stage && tilt && !matchMedia("(pointer: coarse)").matches) {
    const rest = "rotateY(-6deg) rotateX(3deg)";
    tilt.style.transform = rest;
    stage.addEventListener("pointermove", (e) => {
        const r = stage.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 12}deg)`;
    });
    stage.addEventListener("pointerleave", () => {
        tilt.style.transform = rest;
    });
}
