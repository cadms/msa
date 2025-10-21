import MenuBuilder from "../menubuilder";
import Exporter from "../../utils/exporter";

import { fasta } from "bio.io";

const FastaExporter = fasta.write;

const ShareSym = "\u21AA";

const ExportMenu = MenuBuilder.extend({

  initialize: function (data) {
    this.g = data.g;
    this.msa = data.msa;
    return this.el.style.display = "inline-block";
  },

  render: function () {
    this.setName("Export");

    /*this.addNode("Share view (URL)" + ShareSym, () => {
      return Exporter.shareLink(this.msa, function(link) {
        return window.open(link, '_blank');
      });
    });

    this.addNode("View in Jalview", () => {
      var url = this.g.config.get('url');
      if (!(typeof url !== "undefined" && url !== null)) {
        return alert("Sequence weren't imported via an URL");
      } else {
        if (url.indexOf("localhost" || url === "dragimport")) {
          return Exporter.publishWeb(this.msa, (link) => {
            return Exporter.openInJalview(link, this.g.colorscheme.get("scheme"));
          });
        } else {
          return Exporter.openInJalview(url, this.g.colorscheme.get("scheme"));
        }
      }
    }); */

    this.addNode({
      prefix: {
        className: 'fal fa-download'
      },
      label: "Export alignment (FASTA)",
      callback: () => {
        return Exporter.saveAsFile(this.msa, "all.fasta");
      }
    });

    /*this.addNode("Export alignment (URL)", () => {
      return Exporter.publishWeb(this.msa, function(link) {
        return window.open(link, '_blank');
      });
    });*/

    this.addNode({
      prefix: {},
      label: "Export selected sequences (FASTA)",
      callback: () => {
        return Exporter.saveSelection(this.msa, "selection.fasta");
      }
    });

    this.addNode({
      prefix: {},
      label: "Export MSA image (SVG)",
      callback: () => {
        this.g.trigger("export:svg")
      }
    })

    this.addNode({
      prefix: {},
      label: "Export MSA image (PNG)",
      callback: () => {
        return Exporter.saveAsImg(this.msa, "biojs-msa.png");
      }
    });

    this.el.appendChild(this.buildDOM());
    return this;
  }
});
export default ExportMenu;
