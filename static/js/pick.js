document.querySelectorAll("[data-pick]").forEach((group) => {
    group.querySelectorAll(".tab").forEach((tab) => {
        tab.addEventListener("click", () => {
            group.querySelectorAll(".tab").forEach((t) => t.classList.remove("on"));
            tab.classList.add("on");
            document.querySelectorAll('[data-group="' + group.dataset.pick + '"]').forEach((block) => {
                block.hidden = block.dataset.id !== tab.dataset.show;
            });
        });
    });
});
