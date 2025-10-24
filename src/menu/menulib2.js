const jbone = require("jbone");
const view = require("backbone-viewj");

// This could has been inlined from https://github.com/wilzbach/menu-builder
// It is intended to be replaced with in-MSA controls
// see https://github.com/wilzbach/msa/issues/149 for more details

const MenuBuilder = view.extend({
    initialize: function (opts) {
        this._nodes = [];
        this.name = opts.name || "";
        this.el.className += "smenubar";
    },
    render: function () {
        let fc = this.el.firstChild;
        while (fc) {
            this.el.removeChild(fc);
            fc = this.el.firstChild;
        }

        // replace child
        this.el.appendChild(this.buildDOM());
    },
    setName: function (name) {
        this.name = name;
    },
    addNode: function ({ label, callback, style = { cursor: 'pointer' }, children = null, disabled = false, prefix, showSuffixOnHover = false, suffix }) {
        if (this._nodes == null) {
            this._nodes = [];
        }

        this._nodes.push({
            label,
            callback,
            style,
            prefix,
            suffix,
            showSuffixOnHover,
            children,
            disabled,
        });
    },

    addDivider: function () {
        if (this._nodes == null) {
            this._nodes = [];
        }

        this._nodes.push({
            type: 'divider'
        });
    },

    addTitle: function (label) {
        if (this._nodes == null) {
            this._nodes = [];
        }

        this._nodes.push({
            type: 'title',
            label,
        });
    },

    getNode: function (label) {
        let rNode;
        this._nodes.forEach(function (el) {
            if (el.label === label) {
                rNode = el;
            }
        });
        return rNode;
    },

    modifyNode: function (label, callback, opts) {
        let node = this.getNode(label);
        node.callback = callback || node.callback;
        opts = opts || {};
        node.style = opts.style || node.style;
    },

    renameNode: function (label, newLabel) {
        let node = this.getNode(label);
        node.label = newLabel || node.label;
    },

    removeNode: function (label) {
        let node = this.getNode(label);
        this._nodes.splice(this._nodes.indexOf(node), 1);
    },

    removeAllNodes: function () {
        this._nodes = [];
    },

    buildDOM: function () {
        let div = document.createElement("div");
        div.className = "dropdown";
        div.appendChild(this._buildM({
            nodes: this._nodes,
            name: this.name
        }));
        return div;
    },
    _buildM: function (data) {
        const name = data.name;
        const nodes = data.nodes;

        const createMenuItem = (node) => {
            if (node.type === 'divider') {
                const divider = document.createElement("div");
                divider.className = "dropdown-divider";
                return divider;
            }

            if (node.type === 'title') {
                const title = document.createElement("div");
                title.textContent = node.label;
                title.className = 'title';
                return title;
            }

            const li = document.createElement("li");
            li.className = node.disabled ? "dropdown-item disabled" : "dropdown-item";

            if (node.showSuffixOnHover) {
                li.classList.add("showOnHover");
            }

            if (node.prefix) {
                const icon = document.createElement("span");
                icon.style = `${node.prefix.style || 'font-size: 11px; width: 24px'}`;

                icon.className = `${node.prefix.className || ''}`;
                icon.title = node.prefix.title || "";
                // icon.style.marginRight = "10px";
                li.appendChild(icon);
            }

            const text = document.createElement("span");;
            text.textContent = node.label;
            text.style.lineHeight = 1.2;
            text.style.width = "100%";
            text.style.textOverflow = "ellipsis";
            text.style.overflow = "hidden"
            li.appendChild(text);

            // Apply style
            if (node.style) {
                for (const key in node.style) {
                    li.style[key] = node.style[key];
                }
            }

            if (node.callback) {
                li.addEventListener("click", (e) => {
                    if (!e.target.classList.contains("trailing-icon")) {
                        node.callback(e);
                    }
                });
            }

            if (node.suffix) {
                const icon = document.createElement("span");
                icon.className = `trailing-icon ${node.suffix.className || ''}`;
                icon.title = node.suffix.title || "";
                icon.style.marginLeft = "10px";
                icon.style.cursor = "pointer";

                if (typeof node.suffix.onclick === 'function') {
                    icon.addEventListener("click", (e) => {
                        e.stopPropagation();
                        node.suffix.onclick(e);
                    });
                }

                li.appendChild(icon);
            }

            if (Array.isArray(node.children) && node.children.length > 0) {
                li.classList.add("has-submenu");

                const submenu = document.createElement("ul");
                submenu.className = "dropdown-menu submenu";
                submenu.style.display = "none";

                node.children.forEach(child => {
                    submenu.appendChild(createMenuItem(child));
                });

                li.appendChild(submenu);

                li.addEventListener("mouseenter", () => {
                    submenu.style.display = "block";
                });
                li.addEventListener("mouseleave", () => {
                    submenu.style.display = "none";
                });
            }

            this.trigger("new:node", li);
            return li;
        };

        const menuUl = document.createElement("ul");
        menuUl.className = "dropdown-menu";
        menuUl.setAttribute('aria-labelledby', name.replace(/\s+/g, '') + "DropDown");

        nodes.forEach(node => {
            const menuItem = createMenuItem.call(this, node);
            menuUl.appendChild(menuItem);
        });

        this.trigger("new:menu", menuUl);

        // Main button
        const displayedButton = document.createElement("a");
        displayedButton.textContent = name;
        displayedButton.className = "btn btn-secondary dropdown-toggle";
        displayedButton.setAttribute('role', 'button');
        displayedButton.setAttribute('data-toggle', 'dropdown');
        displayedButton.id = name.replace(/\s+/g, '') + "DropDown";

        this.trigger("new:button", displayedButton);

        jbone(displayedButton).on("click", ((_this) => {
            return (e) => {
                _this._showMenu(e, menuUl, displayedButton);
                return window.setTimeout(() => {
                    return jbone(document.body).one("click", (e) => {
                        if (!e.target.closest('.trailing-icon')) {
                            menuUl.classList.remove('show');
                            return;
                        }
                    });
                }, 5);
            };
        })(this));

        const frag = document.createDocumentFragment();
        frag.appendChild(displayedButton);
        frag.appendChild(menuUl);
        return frag;
    },


    _showMenu: function (e, menu, target) {
        let rect;
        menu.classList.add('show');
        rect = target.getBoundingClientRect();
    }
});
export default MenuBuilder;
