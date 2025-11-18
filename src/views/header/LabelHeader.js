const k = require("koala-js");
const view = require("backbone-viewj");
const dom = require("dom-helper");

const LabelHeader = view.extend({

  className: "table_header",

  initialize: function (data) {
    this.g = data.g;

    this.listenTo(this.g.vis, "change:metacell change:labels", this.render);
    return this.listenTo(this.g.zoomer, "change:labelWidth change:metaWidth", this.render);
  },

  render: function () {

    dom.removeAllChilds(this.el);

    if (this.g.vis.get("labels")) {
      this.labelDOM();
    }

    if (this.g.vis.get("metacell")) {
      this.metaDOM()
    }

    return this;
  },

  labelDOM: function () {


    if (this.g.vis.get("labelCheckbox")) {
      this.el.appendChild(this.addEl(".", 'id'));
    }

    if (this.g.vis.get("labelId")) {
      this.el.appendChild(this.addEl("ID", 'id'));
    }

    if (this.g.vis.get("labelPartition")) {
      this.el.appendChild(this.addEl("part", 'label'));
    }

    if (this.g.vis.get("labelName")) {
      var name = this.addEl("Label", 'label');
      this.el.appendChild(name);
    }

    if (this.g.vis.get("numMatch")) {
      this.el.appendChild(this.addEl("# Match", 'comparison'));
    }

    if (this.g.vis.get("numDiff")) {
      this.el.appendChild(this.addEl("# Diff", 'comparison'));
    }

    return this.el;
  },

  addEl: function (content, className) {
    var id = document.createElement("div");
    id.textContent = content;
    if (className) {
      id.className = className;
    }

    return id;
  },

  metaDOM: function () {
    if (this.g.vis.get("metaGaps")) {
      this.el.appendChild(this.addEl("Gaps", "meta"));
    }
    if (this.g.vis.get("metaIdentity")) {
      this.el.appendChild(this.addEl("Ident", "meta"));
    }


    return this.el;
  }
});
export default LabelHeader;
