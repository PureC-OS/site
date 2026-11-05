const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.setProperty("--d", (i % 4) * 0.08 + "s");
    io.observe(el);
});
