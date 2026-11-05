const BOOT_LINES = [
    ["info", "[ limine ] loading kernel image, handoff to x86_64 long mode"],
    ["ok", "[  OK  ] GDT / IDT / TSS installed"],
    ["ok", "[  OK  ] physical memory manager up"],
    ["ok", "[  OK  ] paging: higher-half kernel, COW enabled"],
    ["ok", "[  OK  ] ACPI tables parsed"],
    ["ok", "[  OK  ] SMP: application processors online"],
    ["ok", "[  OK  ] PCI bus enumerated"],
    ["ok", "[  OK  ] AHCI + ATA-PIO storage probed"],
    ["ok", "[  OK  ] xHCI / EHCI USB controllers ready"],
    ["ok", "[  OK  ] e1000 network interface up"],
    ["ok", "[  OK  ] VFS mounted: ext2 root filesystem"],
    ["ok", "[  OK  ] scheduler started, entering Ring 3"],
    ["info", "[ init  ] launching desktop session"],
    ["dim", "PureC OS ready. Welcome."]
];

const box = document.getElementById("boot");

if (box) {
    const lines = [];
    let i = 0;
    const render = () => {
        box.innerHTML = lines.map(([c, t]) => `<div class="${c}">${t}</div>`).join("") + '<div><span class="cur"></span></div>';
    };
    const next = () => {
        if (i >= BOOT_LINES.length) {
            setTimeout(() => {
                i = 0;
                lines.length = 0;
                next();
            }, 3500);
            return;
        }
        lines.push(BOOT_LINES[i++]);
        if (lines.length > 12) {
            lines.shift();
        }
        render();
        setTimeout(next, 260 + Math.random() * 330);
    };
    next();
}
