const jbone = require("jbone");
const view = require("backbone-viewj");

const VerticalDivider = view.extend({
    initialize: function () {
        this.el.className += "msa-vertical-divider";
    },

    render: function () {
        // Remove all children first (if needed)
        let fc = this.el.firstChild;
        while (fc) {
            this.el.removeChild(fc);
            fc = this.el.firstChild;
        }

        // Apply inline styles for vertical divider
        Object.assign(this.el.style, {
            width: "1px",
            height: "-webkit-fill-available",
            backgroundColor: "#ccc",
            display: "inline-block",
            margin: "5px",
            flexShrink: "0",
        });

        return this;
    }
});

module.exports = VerticalDivider;
