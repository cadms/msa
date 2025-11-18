const view = require("backbone-viewj");
const dom = require("dom-helper");

const LabelView = view.extend({

  initialize: function (data) {
    this.seq = data.seq;
    this.g = data.g;

    return this.manageEvents();
  },

  manageEvents: function () {
    var events = {};
    if (this.g.config.get("registerMouseClicks")) {
      events.click = "_onclick";
    }
    if (this.g.config.get("registerMouseHover")) {
      events.mousein = "_onmousein";
      events.mouseout = "_onmouseout";
    }
    this.delegateEvents(events);
    this.listenTo(this.g.config, "change:registerMouseHover", this.manageEvents);
    this.listenTo(this.g.config, "change:registerMouseClick", this.manageEvents);
    this.listenTo(this.g.vis, "change:labelName change:labelId change:labelPartition change:labelCheckbox", this.render);
    this.listenTo(this.g.zoomer, "change:labelIdLength change:labelNameLength change:labelPartLength change:labelCheckLength", this.render
    );
    return this.listenTo(this.g.zoomer, "change:labelFontSize change:labelLineHeight change:labelWidth change:rowHeight", this.render
    );
  },

  render: function () {
    dom.removeAllChilds(this.el);

    this.el.setAttribute("class", "table_row");

    if (this.g.vis.get("labelCheckbox")) {
      var checkBox = document.createElement("input");
      checkBox.setAttribute("type", "checkbox");
      checkBox.value = this.model.get('id');
      checkBox.name = "seq";
      checkBox.style.width = this.g.zoomer.get("labelCheckLength") + "px";
      this.el.appendChild(checkBox);
    }

    if (this.g.vis.get("labelId")) {
      var id = document.createElement("div");
      id.className = 'id';
      var val = this.model.get("id");
      if (!isNaN(val)) {
        val++;
      }
      id.textContent = val;
      this.el.appendChild(id);
      this.el.setAttribute("title", val)
    }

    if (this.g.vis.get("labelPartition")) {
      var part = document.createElement("div");
      part.className = 'label';
      const textContent = this.model.get("partition");
      part.textContent = textContent;
      part.style.display = "inline-block";
      this.el.appendChild(id);
      this.el.appendChild(part);
      this.el.setAttribute("title", textContent)
    }

    if (this.g.vis.get("labelName")) {
      var name = document.createElement("div");
      const textContent = this.model.get("name");
      name.textContent = textContent;
      name.className = 'label';

      if (this.model.get("ref") && this.g.config.get("hasRef")) {
        name.style.fontWeight = "bold";
      }
      this.el.appendChild(name);
      this.el.setAttribute("title", textContent)
    }

    if (this.g.vis.get("numMatch")) {
      var match = document.createElement("div");
      match.setAttribute("class", "match_label");

      if (this.model.get("ref") && this.g.config.get("hasRef")) {
        match.style.fontWeight = "bold";
      }
      this.el.appendChild(match);
    }

    if (this.g.vis.get("numDiff")) {
      var diff = document.createElement("div");
      diff.setAttribute("class", "diff_label");


      if (this.model.get("ref") && this.g.config.get("hasRef")) {
        diff.style.fontWeight = "bold";
      }
      this.el.appendChild(diff);
    }

    this.el.style.overflow = scroll;
    this.el.style.fontSize = `${this.g.zoomer.get('labelFontsize')}px`;
    return this;
  },

  _onclick: function (evt) {
    var seqId = this.model.get("id");
    return this.g.trigger("row:click", { seqId: seqId, evt: evt });
  },

  _onmousein: function (evt) {
    var seqId = this.model.get("id");
    return this.g.trigger("row:mouseout", { seqId: seqId, evt: evt });
  },

  _onmouseout: function (evt) {
    var seqId = this.model.get("id");
    return this.g.trigger("row:mouseout", { seqId: seqId, evt: evt });
  }
});

export default LabelView;
