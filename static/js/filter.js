document.querySelectorAll("[data-tabs]").forEach((group) => {
    const rows = document.querySelectorAll(group.dataset.tabs + " tbody tr");
    group.querySelectorAll(".tab").forEach((tab) => {
        tab.addEventListener("click", () => {
            group.querySelectorAll(".tab").forEach((t) => t.classList.remove("on"));
            tab.classList.add("on");
            const f = tab.dataset.filter;
            rows.forEach((r) => {
                r.style.display = f === "all" || r.dataset.kind.split(" ").includes(f) ? "" : "none";
            });
        });
    });
});
