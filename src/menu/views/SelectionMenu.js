import MenuBuilder from "../menubuilder";
const SelectionMenu = MenuBuilder.extend({

  initialize(data) {
    this.g = data.g;
    this.removed_arr = []
    return this.el.style.display = "inline-block";
  },

  render() {
    // this.setName((() => {
    //   const icon = document.createElement("i");
    //   icon.className = "fal fa-pen";
    //   return icon;
    // })());
    this.setName("Edit");

    this.addNode({
      prefix: {
        className: 'fal fa-pen',
      },
      label: "Edit entire sequence",
      callback: () => {
        const t = this
        const selcol = t.g.selcol
        const firstSel = selcol.models[0]
        const row = firstSel.get('seqId')
        const seq = t.model.at(row).get('seq')
        Ext.GlobalEvents.fireEvent('msa_edit', seq, row)

      }
    });

    this.addNode({
      prefix: {},
      label: "Edit by character selection",
      callback: () => {
        const t = this
        const selcol = t.g.selcol

        const firstSel = selcol.models[0]
        const row = firstSel.get('seqId')
        let seq = t.model.at(row).get('seq')
        const selRange = selcol.models.map(m => m.get('xStart'))

        const startCol = firstSel.get('xStart')
        const endCol = firstSel.get('xEnd')
        const oldVal = seq.substring(startCol, endCol + 1) // selected chars
        console.log('selRange: ', selRange);
        console.log('startCol: ', startCol);
        console.log('endCol: ', endCol);

        Ext.Msg.show({
          title: 'Edit',
          prompt: true,
          value: oldVal,
          buttons: Ext.Msg.OKCANCEL,
          scope: this,
          fn: function (btnText, val) {
            console.log(val);
            // check if the user has clicked on positions that are not in the same seq/row
            function checkSeqId(arr) {
              const uniqueSeqIds = new Set()
              for (const obj of arr) {
                uniqueSeqIds.add(obj.get('seqId'))
              }
              return uniqueSeqIds.size > 1
            }

            if (btnText !== 'ok' || val === '' || val === oldVal) return

            if (val.length > oldVal.length || val.length < oldVal.length) {
              Ext.Msg.alert('Invalid Character Length', 'Please enter a replacement value of the same length.')
              return
            }

            if (checkSeqId(selcol.models)) {
              Ext.Msg.alert('Invalid Selection', 'Please select values that are of the same sequence.')
              return
            }

            seq = `${seq.substring(0, startCol)}${val}${seq.substring(endCol + 1)}`
            t.model.at(row).set('seq', seq)

          }
        });

      }
    });

    this.addNode({
      prefix: {},
      label: "Edit label",
      callback: () => {
        const t = this
        const selcol = t.g.selcol
        const firstSel = selcol.models[0]
        const row = firstSel.get('seqId')
        const seqLabel = t.model.at(row).get('name')

        Ext.Msg.show({
          prefix: {},
          title: 'Edit Label',
          prompt: true,
          value: seqLabel,
          buttons: Ext.Msg.OKCANCEL,
          scope: this,
          fn: function (btnText, val) {
            if (btnText !== 'ok' || val === '' || val === seqLabel) return
            t.model.at(row).set('name', val)
          }
        });
      }
    });

    this.addDivider();

    this.addNode({
      prefix: {},
      label: 'Strict Comparison',
      callback: () => {
        this.g.comparisontype = 'strict';
        setTimeout(() => {
          this.g.selcol.renderComparisonColumns();
        }, 50);
        Ext.toast({
          html: `Comparison type changed`,
          title: `Strict Comparison Selected`,
          width: 300,
          align: 'br'
        });
        this._nodes = [];
        this.$el.empty();
        this.render();
      },
      suffix: {
        className: this.g.comparisontype == 'strict' && "fal fa-check"
      },
    });

    this.addNode({
      prefix: {},
      label: "Loose Comparison",
      callback: () => {
        this.g.comparisontype = 'loose';
        setTimeout(() => {
          this.g.selcol.renderComparisonColumns();
        }, 50);
        Ext.toast({
          html: `Comparison type changed`,
          title: `Loose Comparison Selected`,
          width: 300,
          align: 'br'
        });

        this._nodes = [];
        this.$el.empty();
        this.render();
      },
      suffix: {
        className: this.g.comparisontype == 'loose' && "fal fa-check"
      },
    });

    this.addDivider();

    this.addNode({
      prefix: {
        className: 'fal fa-trash',
      },
      label: "Remove sequence",
      callback: () => {
        const t = this
        const selcol = t.g.selcol
        const firstSel = selcol.models[0]
        const row = firstSel.get('seqId')
        const removed = t.model.at(row).set('hidden', true)

        this.removed_arr.push(removed)

      }
    });

    this.addDivider();

    this.addNode({
      prefix: {
        className: 'fal fa-refresh',
      },
      label: "Reset",
      callback: () => {
        const t = this
        const selcol = t.g.selcol
        const firstSel = selcol.models[0]
        const row = firstSel.get('seqId')
        const oldSeq = t.model.at(row).previous('seq')

        t.model.at(row).set('seq', oldSeq)
        this.removed_arr.forEach(el => el.set('hidden', false))
        this.removed_arr = []
      }
    });
    this.el.appendChild(this.buildDOM());
    return this;
  }
});
export default SelectionMenu;
