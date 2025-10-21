import MenuBuilder from "../menubuilder";
import Exporter from "../../utils/exporter";

const k = require("koala-js");

const ImportMenu = MenuBuilder.extend({

  initialize: function (data) {
    this.g = data.g;
    this.el.style.display = "inline-block";
    return this.msa = data.msa;
  },

  render: function () {
    var msa = this.msa;
    var uploader = k.mk("input");
    uploader.type = "file";
    uploader.style.display = "none";
    //uploader.accept
    // http://www.w3schools.com/jsref/prop_fileupload_accept.asp
    // for now we allow multiple files
    uploader.multiple = true;
    uploader.addEventListener("change", () => {
      var files = uploader.files || [];
      return msa.u.file.importFiles(files);
    });

    this.el.appendChild(uploader);

    var filetypes = "Fasta, Clustal, GFF, Jalview features, Newick";

    this.setName("Import/Export");
    this.addTitle('Import');

    this.addNode({
      prefix: {
        className: 'fal fa-upload'
      },
      label: "URL",
      callback: (e) => {
        var url = prompt("Import files from URL" + "\nSupported file types: " + filetypes);
        if (url.length > 5) {
          return this.msa.u.file.importURL(url, function () { });
        }
      }
    });
    // mass update on zoomer
    //zoomer = @g.zoomer.toJSON()
    //#zoomer.textVisible = false
    //#zoomer.columnWidth = 4
    //zoomer.boxRectHeight = 2
    //zoomer.boxRectWidth = 2
    //@g.zoomer.set zoomer

    this.addNode({
      prefix: {},
      label: "From file " + filetypes,
      callback: () => {
        return uploader.click();
      }
    });

    this.addNode({
      prefix: {},
      label: "Drag & Drop",
      callback: () => {
        return alert("Yep. Just drag & drop your file " + filetypes);
      },
      suffix: {
        className: 'fal fa-chevron-right'
      },
    });

    this.addDivider();

    this.addTitle('Export');

    this.addNode({
      prefix: {
        className: 'fal fa-download'
      },
      label: "Export alignment (FASTA)",
      callback: () => {
        return Exporter.saveAsFile(this.msa, "all.fasta");
      }
    });

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
export default ImportMenu;
