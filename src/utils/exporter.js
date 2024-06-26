import {fasta as Fasta,
        gff as GFF,
        xhr} from "bio.io";

const blobURL = require("blueimp_canvastoblob");
const saveAs = require("file-saver");
import {flatten, compact} from "lodash";
import html2canvas from 'html2canvas';

const Exporter =

  {openInJalview: function(url, colorscheme) {
    if (url.charAt(0) === '.') {
      // relative urls
      url = document.URL.substr(0,document.URL.lastIndexOf('/')) + "/" + url;
    }

    // check whether this is a local url
    if (url.indexOf("http") < 0) {
      // append host and hope for the best
      var host = "http://" + window.location.hostname;
      url = host + url;
    }

    url = encodeURIComponent(url);
    var jalviewUrl = "http://www.jalview.org/services/launchApp?open=" + url;
    jalviewUrl += "&colour=" + colorscheme;
    return window.open(jalviewUrl, '_blank');
  },

  publishWeb: function(that, cb) {
    var text = Fasta.write(that.seqs.toJSON());
    text = encodeURIComponent(text);
    var url = "http://sprunge.biojs.net";
    return xhr({
      method: "POST",
      body: "sprunge=" + text,
      uri: url,
      headers:
        {"Content-Type": "application/x-www-form-urlencoded"}
    }, function(err,rep,body) {
      var link = body.trim();
      return cb(link);
    }
    );
  },

  shareLink: function(that, cb) {
    var url = that.g.config.get("importURL");
    var msaURL = "http://msa.biojs.net/app/?seq=";
    var fCB = function(link) {
      var fURL = msaURL + link;
      if (cb) {
        return cb(fURL);
      }
    };
    if (!url) {
      return Exporter.publishWeb(that, fCB);
    } else {
      return fCB(url);
    }
  },

  saveAsFile: function(that,name) {
    // limit at about 256k
    const text = Fasta.write(that.seqs.toJSON());
    const blob = new Blob([text], {type : 'text/plain'});
    return saveAs(blob, name);
  },

  saveSelection: function(that,name) {
    let selection = that.g.selcol.pluck("seqId");
    console.log(selection);
    if (selection.length > 0) {
      // filter those seqids
      selection = that.seqs.filter((el) => selection.indexOf(el.get("id")) >= 0);
      var end = selection.length - 1;
      for (let i = 0; 0 < end ? i <= end : i >= end; 0 < end ? i++ : i--) {
        selection[i] = selection[i].toJSON();
      }
    } else {
      selection = that.seqs.toJSON();
      console.warn("no selection found");
    }
    var text = Fasta.write(selection);
    var blob = new Blob([text], {type : 'text/plain'});
    return saveAs(blob, name);
  },

  saveAnnots: function(that,name) {
    var features = that.seqs.map(function(el) {
      features = el.get("features");
      if (features.length === 0) { return; }
      var seqname = el.get("name");
      features.each(function(s) {
        return s.set("seqname", seqname);
      });
      return features.toJSON();
    });
    features = flatten(compact(features));
    if (!features || !features.length) {
    	alert("No feature annotations found to export");
    	return;
    }
    var text = GFF.exportLines(features);
    var blob = new Blob([text], {type : 'text/plain'});
    return saveAs(blob, name);
  },

  /*saveAsImg: function(that,name) {
      // TODO: this is very ugly
      var canvas = that.getView('stage').getView('body').getView('seqblock').el;
      if ((typeof canvas !== "undefined" && canvas !== null)) {
        var url = canvas.toDataURL('image/png');
        return saveAs(blobURL(url), name, "image/png");
      }
  }*/
  saveAsImg: function(that,name) {
      // TODO: this is less ugly, but it still doesn't download the full alignment, only what's shown on screen
	  var elementToCapture = document.getElementsByClassName('biojs_msa_stage')[0];
	  html2canvas(elementToCapture).then(function(canvas) {
		  document.querySelector('body').appendChild(canvas);
		  var url = canvas.toDataURL('image/png');
		  saveAs(blobURL(url), name, "image/png");
		  canvas.remove();
		  return;
	  });
  }
  };
export default Exporter;
