const CHANGELOG_URL = "https://raw.githubusercontent.com/PureC-OS/PureC-OS/main/CHANGELOG.md";

const VERSION_RE = /v?\d+(?:\.\d+)+/gi;

function parseChangelog(text) {
    const releases = [];
    let rel = null;
    let sec = null;
    let item = null;

    const newSection = (title, level) => {
        sec = { title, level, items: [] };
        rel.sections.push(sec);
        item = null;
    };

    for (const raw of text.split("\n")) {
        const line = raw.replace(/\s+$/, "");
        let m;

        if (/^# /.test(line)) {
            continue;
        }
        if ((m = /^## (.*)$/.exec(line))) {
            const head = m[1].trim();
            const split = head.split(/\s+[—–-]\s+/);
            const versions = split[0].match(VERSION_RE);
            if (versions && split[0].replace(VERSION_RE, "").trim() === "") {
                rel = { versions, title: split.slice(1).join(" — "), sections: [] };
                releases.push(rel);
                sec = null;
                item = null;
            } else {
                if (!rel) {
                    rel = { versions: [], title: "", sections: [] };
                    releases.push(rel);
                }
                newSection(head, 3);
            }
            continue;
        }
        if (!rel) {
            continue;
        }
        if ((m = /^### (.*)$/.exec(line))) {
            newSection(m[1].trim(), 4);
            continue;
        }
        if ((m = /^[-*] (.*)$/.exec(line))) {
            if (!sec) {
                newSection(null, 4);
            }
            item = { text: m[1].trim() };
            sec.items.push(item);
            continue;
        }
        if (line.trim() === "") {
            item = null;
            continue;
        }
        if (item && /^\s/.test(line)) {
            item.text += " " + line.trim();
            continue;
        }
        if (!sec) {
            newSection(null, 4);
        }
        item = { text: line.trim(), note: true };
        sec.items.push(item);
    }
    return releases;
}

function node(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) {
        e.className = cls;
    }
    if (text !== undefined) {
        e.textContent = text;
    }
    return e;
}

function inline(parent, text) {
    const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
    let last = 0;
    let m;
    while ((m = re.exec(text))) {
        if (m.index > last) {
            parent.appendChild(document.createTextNode(text.slice(last, m.index)));
        }
        if (m[1]) {
            parent.appendChild(node("code", null, m[1].slice(1, -1)));
        } else if (m[2]) {
            parent.appendChild(node("strong", null, m[2].slice(2, -2)));
        } else {
            const lm = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(m[3]);
            if (/^https?:\/\//.test(lm[2])) {
                const a = node("a", null, lm[1]);
                a.href = lm[2];
                a.target = "_blank";
                a.rel = "noopener";
                parent.appendChild(a);
            } else {
                parent.appendChild(document.createTextNode(lm[1]));
            }
        }
        last = re.lastIndex;
    }
    if (last < text.length) {
        parent.appendChild(document.createTextNode(text.slice(last)));
    }
}

function renderRelease(rel, index) {
    const d = node("details", "rel");
    d.id = "rel-" + index;
    if (index === 0) {
        d.open = true;
    }

    const count = rel.sections.reduce((n, s) => n + s.items.length, 0);
    const sum = node("summary", "rel-sum");
    const badge = node("span", "rel-ver", rel.versions.length ? rel.versions.join(" · ") : "—");
    const title = node("span", "rel-title", rel.title || "Changes");
    const meta = node("span", "rel-meta", count + " changes");
    sum.append(badge, title, meta);
    d.appendChild(sum);

    const body = node("div", "rel-body");
    rel.sections.forEach((s) => {
        if (s.title) {
            const h = node(s.level === 3 ? "h3" : "h4", s.level === 3 ? "rel-group" : "rel-sec");
            inline(h, s.title);
            body.appendChild(h);
        }
        if (!s.items.length) {
            return;
        }
        const ul = node("ul", "rel-list");
        s.items.forEach((it) => {
            const li = node("li", it.note ? "note" : "");
            li.dataset.t = it.text.toLowerCase();
            inline(li, it.text);
            ul.appendChild(li);
        });
        body.appendChild(ul);
    });
    d.appendChild(body);
    return d;
}

function renderChangelog(root, releases) {
    root.textContent = "";

    const tools = node("div", "cl-tools");
    const search = node("input", "cl-search");
    search.type = "search";
    search.placeholder = "Search the changelog…";
    search.setAttribute("aria-label", "Search the changelog");
    const toggle = node("button", "btn cl-toggle", "Expand all");
    toggle.type = "button";
    tools.append(search, toggle);

    const layout = node("div", "cl-layout");
    const index = node("nav", "cl-index");
    index.appendChild(node("div", "cl-index-title", "Versions"));
    const list = node("div", "cl-list");

    const items = releases.map((rel, i) => {
        const el = renderRelease(rel, i);
        list.appendChild(el);
        const a = node("a", null, rel.versions.length ? rel.versions[0] : rel.title || "Changes");
        a.href = "#rel-" + i;
        a.addEventListener("click", () => {
            el.open = true;
        });
        index.appendChild(a);
        return { el, a };
    });

    const empty = node("p", "cl-empty", "Nothing found.");
    empty.hidden = true;
    list.appendChild(empty);

    layout.append(index, list);
    root.append(tools, layout);

    let expanded = false;
    toggle.addEventListener("click", () => {
        expanded = !expanded;
        items.forEach(({ el }) => {
            el.open = expanded;
        });
        toggle.textContent = expanded ? "Collapse all" : "Expand all";
    });

    search.addEventListener("input", () => {
        const q = search.value.trim().toLowerCase();
        let shown = 0;
        items.forEach(({ el, a }) => {
            const lis = el.querySelectorAll("li");
            let hit = 0;
            lis.forEach((li) => {
                const ok = !q || li.dataset.t.includes(q);
                li.hidden = !ok;
                if (ok) {
                    hit++;
                }
            });
            el.querySelectorAll("h3, h4").forEach((h) => {
                const next = h.nextElementSibling;
                h.hidden = !!q && !(next && next.tagName === "UL" && next.querySelector("li:not([hidden])"));
            });
            const visible = !q || hit > 0;
            el.hidden = !visible;
            a.hidden = !visible;
            if (q && visible) {
                el.open = true;
            }
            if (visible) {
                shown++;
            }
        });
        empty.hidden = shown > 0;
    });
}

const clRoot = document.getElementById("changelog");

if (clRoot) {
    fetch(CHANGELOG_URL)
        .then((r) => {
            if (!r.ok) {
                throw new Error(r.status);
            }
            return r.text();
        })
        .then((text) => {
            const releases = parseChangelog(text);
            if (releases.length) {
                renderChangelog(clRoot, releases);
            }
        })
        .catch(() => {
            clRoot.classList.add("cl-offline");
        });
}
