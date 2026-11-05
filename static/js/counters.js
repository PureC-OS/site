const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (!e.isIntersecting) {
            return;
        }
        io.unobserve(e.target);
        const end = +e.target.dataset.count;
        const suffix = e.target.dataset.suffix || "";
        const t0 = performance.now();
        const tick = (t) => {
            const k = Math.min(1, (t - t0) / 1400);
            e.target.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suffix;
            if (k < 1) {
                requestAnimationFrame(tick);
            }
        };
        requestAnimationFrame(tick);
    });
}, { threshold: 0.5 });

document.querySelectorAll("[data-count]").forEach((el) => io.observe(el));
