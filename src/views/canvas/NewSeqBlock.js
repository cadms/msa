const boneView = require("backbone-childs");
const dom = require("dom-helper");

const View = boneView.extend({
    initialize: function (data) {
        this.g = data.g;
        this.el = data.el;
        this.el.className = 'sequence_block';

        this.isDragging = false;
        this.startIndex = null;
        this.endIndex = null;
        this.activeRow = null;

        this.highlightBox = document.createElement("div");
        this.highlightBox.style.position = "absolute";
        this.highlightBox.style.border = "2px solid red";
        this.highlightBox.style.borderRadius = "5px";
        this.highlightBox.style.pointerEvents = "none";
        this.highlightBox.style.transition = "all 0.2s ease";
        this.el.appendChild(this.highlightBox);
        this.color = this.g.colorscheme.getSelectedScheme();
        if (this.color.type == 'dyn') {
            this.color = null;
        }
        this.listenTo(this.g.columns, "change:hidden", this.render);
        this.listenTo(this.g.colorscheme, "change:scheme", function () {
            this.color = this.g.colorscheme.getSelectedScheme();
            console.log(this.color);

            if (this.color.type == 'dyn') {
                this.color = null;
            }
            return this.render();
        });

        return this.listenTo(this.g.selcol, "reset", this.clearHere);

    },

    render: function () {
        dom.removeAllChilds(this.el);


        // Iterate through all sequence objects and create rows in the table
        const sequences = this.g.seqs.models;
        const hiddenColumnIds = this.g.columns.get('hidden');
        sequences.forEach((sequenceObject, index) => {
            var row = document.createElement('div');
            row.className = 'sequence_row';
            row.setAttribute('sequence_id', sequenceObject.get('id'));

            if (index % 2 === 0) {
                row.style.backgroundColor = "white";
            } else {
                row.style.backgroundColor = "#f6f6f6";
            }

            const sequence = sequenceObject.attributes.seq.split("");
            sequence.forEach((seqChar, characterIndex) => {
                var char = document.createElement('div');
                char.className = 'sequence_cell';
                char.textContent = seqChar;
                char.attributes.seqId = 0;

                let color = '';
                if (this.color) {
                    color = this.color.map[seqChar.toUpperCase()];
                }
                char.style.backgroundColor = color;
                // Mouse down starts the selection
                char.addEventListener("mousedown", e => {
                    this.highlightBox.style.width = "0";
                    this.highlightBox.style.height = "0";
                    this.highlightBox.style.opacity = '1';
                    this.isDragging = true;
                    this.activeRow = row;
                    this.startIndex = characterIndex;
                    this.endIndex = characterIndex;
                    this._updateSelection(this.activeRow, this.startIndex, this.endIndex);
                });

                // Mouse over continues selection
                char.addEventListener("mouseover", e => {
                    if (this.isDragging && this.activeRow === row) {
                        this.endIndex = characterIndex;
                        this._updateSelection(this.activeRow, this.startIndex, this.endIndex);
                    }
                });

                // Mouse up ends selection
                char.addEventListener("mouseup", e => {
                    console.log(this.activeRow.getAttribute('sequence_id'));
                    this.isDragging = false;
                    const res = { seqId: Number(this.activeRow.getAttribute('sequence_id')), feature: null, rowPos: characterIndex, evt: e, startPos: this.startIndex, endPos: this.endIndex };
                    if (typeof res !== "undefined" && res !== null) {
                        this.g.trigger("residue:click", res);
                    }
                });
                row.appendChild(char);
                char.style.display = hiddenColumnIds.includes(characterIndex) ? 'none' : 'auto'

            });

            this.el.appendChild(row);
        });

        return this;
    },

    clearHere: function () {
        console.log(this.g.selcol.models);
        const hasPosModel = this.g.selcol.models.some(model => model.get('type') === 'pos');
        if (hasPosModel) return;
        this.highlightBox.style.width = '0';
        this.highlightBox.style.height = '0';
        this.highlightBox.style.opacity = '0';
        this.activeRow = null;
        this.isDragging = false;
        this.startIndex = null;
        this.endIndex = null;
        this.activeRow = null;
    },


    _setColor: function () {
        return this.color = this.g.colorscheme.getSelectedScheme();
    },

    _updateSelection: function (row, start, end) {
        const cells = row.querySelectorAll(".sequence_cell");
        const [from, to] = start <= end ? [start, end] : [end, start];

        const firstCell = cells[from];
        const lastCell = cells[to];

        const rowRect = row.getBoundingClientRect();
        const firstRect = firstCell.getBoundingClientRect();
        const lastRect = lastCell.getBoundingClientRect();

        this.highlightBox.style.top = `${firstRect.top - rowRect.top}px`;
        this.highlightBox.style.left = `${firstRect.left - rowRect.left}px`;
        this.highlightBox.style.width = `${lastRect.right - firstRect.left}px`;
        this.highlightBox.style.height = `${firstRect.height}px`;

        row.appendChild(this.highlightBox);
    },
});

export default View;
