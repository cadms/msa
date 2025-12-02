const view = require("backbone-viewj");
const dom = require("dom-helper");
const jbone = require("jbone");
import * as svg from "../../utils/svg";

const MarkerView = view.extend({

  className: "biojs_msa_marker",

  initialize: function (data) {
    this.g = data.g;
    this.listenTo(this.g.zoomer, "change:stepSize change:labelWidth change:columnWidth change:markerStepSize change:markerFontsize", this.render);
    this.listenTo(this.g.vis, "change:labels change:metacell", this.render);
    this.listenTo(this.g.selcol, "reset add remove", this.updateHighlights);

    return this.manageEvents();
  },

  updateHighlights: function () {
    console.log('updateHighlights');
    this.el.querySelectorAll(".msa-col-header").forEach(el => {
      el.style.color = "";
      el.style.fontWeight = "";
    });

    this.g.selcol.models.forEach(model => {
      const type = model.get("type");
      if (type != "pos" && type != "column") return;
      const start = model.get("xStart");
      const end = model.get("xEnd");
      const step = start < end ? 1 : -1;

      for (let i = start; i !== end + step; i += step) {
        console.log(i);
        const el = this.el.querySelector(`.msa-col-header[rowpos="${i}"]`);

        if (el) {
          el.style.color = "#f00";
          el.style.fontWeight = "bold";
        };
      }
    });
  },

  render: function () {
    dom.removeAllChilds(this.el);

    const fontSize = this.g.zoomer.get("markerFontsize");
    const cellWidth = this.g.zoomer.get("columnWidth");
    const stepSize = this.g.zoomer.get("stepSize");
    const markerStepSize = this.g.zoomer.get("markerStepSize");

    const hidden = this.g.columns.get("hidden");

    this.el.style.fontSize = fontSize;
    this.el.style.display = "flex";
    this.el.style.position = 'relative'

    const nMax = this.model.getMaxLength();
    let visibleColumn;

    for (let n = 0; n < nMax; n++) {
      if (hidden.indexOf(n) >= 0) {
        let el = this.markerHidden(n, stepSize);
        if (el) {
          const placeholder = document.createElement('div');
          placeholder.style.width = '0px';
          placeholder.style.position = 'relative';
          el.style.position = 'absolute';
          el.style.top = '0';
          el.style.left = '-4px';
          el.style.right = '0';
          el.style.bottom = '0';
          el.style.zIndex = '10';
          placeholder.appendChild(el);

          this.el.appendChild(placeholder)

          // el.style.position = 'absolute';
          // el.style.zIndex = '10';
          // el.style.top = '0';
          // el.style.left = visibleColumn == 0 ? cellWidth - 5 : `${(visibleColumn * cellWidth) - 5}px`;
          // this.el.appendChild(el);

          // let wrapper = document.createElement('div');
          // wrapper.style.position = 'absolute';
          // el.style.position = 'relative';
          // el.style.zIndex = '10';
          // el.style.top = '0';
          // el.style.left = `${(visibleColumn * cellWidth) - (cellWidth / 2)}px`;
          // wrapper.appendChild(el);
          // this.el.appendChild(wrapper);

          // // Show markerHidden but take it out of flex flow
          // el.style.position = 'absolute';
          // el.style.zIndex = '10'; // Ensure it's above other content
          // // Set position relative to parent if needed
          // el.style.top = '0';
          // el.style.left = `${n * cellWidth}px`; // Position at correct column
          // this.el.appendChild(el);


        }
        // n += stepSize;
        continue;
      }
      visibleColumn = n;
      let span = document.createElement("div");
      span.className = 'msa-col-header';

      span.textContent = (n + 1);
      span.rowPos = n;
      span.setAttribute("rowpos", n);

      // if ((n + 1) % markerStepSize === 0) {
      //   span.textContent = (n + 1);
      // } else if ((n + 1) % stepSize === 0) {
      //   span.textContent = ".";
      // } else {
      //   span.textContent = " ";
      // }
      // span.rowPos = n;



      this.el.appendChild(span);
    }

    return this;
  },

  markerHidden: function (n, stepSize) {
    const hidden = this.g.columns.get("hidden").slice(0);

    const min = Math.max(0, n - stepSize);
    let prevHidden = true;
    for (let j = min; j <= n; j++) {
      prevHidden &= hidden.indexOf(j) >= 0;
    }

    // filter duplicates
    if (prevHidden) { return; }

    const nMax = this.model.getMaxLength();

    let length = 0;
    let index = -1;
    // accumlate multiple rows
    for (let n2 = n; n2 <= nMax; n2++) {
      if (!(index >= 0)) { index = hidden.indexOf(n2); }// sets the first index
      if (hidden.indexOf(n2) >= 0) {
        length++;
      } else {
        break;
      }
    }

    const s = svg.base({ height: 10, width: 10 });
    s.style.position = "relative";
    const triangle = svg.polygon({
      points: "0,0 5,5 10,0", style:
        "fill:lime;stroke:purple;stroke-width:1"
    });
    jbone(triangle).on("click", (evt) => {
      hidden.splice(index, length);
      return this.g.columns.set("hidden", hidden);
    });

    s.appendChild(triangle);
    return s;

    // let container = document.createElement("div");
    // container.style.display = 'flex';
    // container.style.justifyContent = 'center';
    // container.style.alignItems = 'center';
    // container.style.width = '25px';

    // const s = svg.base({ height: 10, width: 10 });
    // s.style.position = "relative";
    // const triangle = svg.polygon({
    //   points: "0,0 5,5 10,0", style:
    //     "fill:lime;stroke:purple;stroke-width:1"
    // });
    // jbone(triangle).on("click", (evt) => {
    //   hidden.splice(index, length);
    //   return this.g.columns.set("hidden", hidden);
    // });

    // s.appendChild(triangle);
    // container.appendChild(s);
    // return container;
  },

  manageEvents: function () {
    const events = {};
    if (this.g.config.get("registerMouseClicks")) {
      events.click = "_onclick";
    }
    if (this.g.config.get("registerMouseHover")) {
      events.mousein = "_onmousein";
      events.mouseout = "_onmouseout";
    }
    this.delegateEvents(events);
    this.listenTo(this.g.config, "change:registerMouseHover", this.manageEvents);
    return this.listenTo(this.g.config, "change:registerMouseClick", this.manageEvents);
  },

  _onclick: function (evt) {
    const rowPos = evt.target.rowPos;
    const stepSize = this.g.zoomer.get("stepSize");
    return this.g.trigger("column:click", { rowPos: rowPos, stepSize: stepSize, evt: evt });
  },

  _onmousein: function (evt) {
    const rowPos = this.g.zoomer.get("stepSize" * evt.rowPos);
    const stepSize = this.g.zoomer.get("stepSize");
    return this.g.trigger("column:mousein", { rowPos: rowPos, stepSize: stepSize, evt: evt });
  },

  _onmouseout: function (evt) {
    const rowPos = this.g.zoomer.get("stepSize" * evt.rowPos);
    const stepSize = this.g.zoomer.get("stepSize");
    return this.g.trigger("column:mouseout", { rowPos: rowPos, stepSize: stepSize, evt: evt });
  }
});

export default MarkerView;
