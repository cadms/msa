import MenuBuilder from "../menubuilder";

const FilterMenu = MenuBuilder.extend({

  initialize: function (data) {
    this.g = data.g;

    return this.el.style.display = "inline-block";
  },

  render: function () {
    this.setName("Filters");
    const hasSavedFilters = this.g.alignmentFilters && this.g.alignmentFilters.length !== 0;
    this.addNode({
      label: "Save Filter as...",
      callback: () => {
        Ext.GlobalEvents.fireEvent('save_filter', this.g.columns.get('hidden'), () => {
          this._nodes = [];
          this.$el.empty();
          this.render();
        });
      }
    });

    this.addNode({
      label: hasSavedFilters ? "Filters" : "Filters (none)",
      disabled: !hasSavedFilters,
      children: hasSavedFilters && this.g.alignmentFilters.map((filter, index) => {

        return {
          label: filter.name,
          callback: () => {
            this.g.columns.set("hidden", filter.hidden_columns);
            Ext.toast({
              title: `Filter Set`,
              html: `Filter "${filter.name}" has been set.`,

              width: 300,
              align: 'br'
            });
          },
          showSuffixOnHover: true,
          suffix: {
            className: "fa x-tool-close redOnHover",
            title: "Delete item",
            onclick: () => {
              Ext.GlobalEvents.fireEvent('delete_filter', filter.id, () => {
                this._nodes = [];
                this.$el.empty();
                this.render();
              });
            }
          },
        };
      })
    });

    this.addDivider();

    this.addNode({
      label: "Find Motif (supports RegEx)",
      callback: () => {
        let search = prompt("your search", "D");
        return this.g.user.set("searchText", search);
      }
    });

    this.addNode({
      label: "Find by label",
      callback: () => {
        const prompt = Ext.Msg.show({
          title: 'Jump to a Label',
          prompt: true,
          buttons: Ext.Msg.OKCANCEL,
          scope: this,
          fn: function (btnText, val) {
            if (btnText !== 'ok' || val === '') return
            this.model.forEach(m => {
              if (m.get('name') === val) {
                this.g.zoomer.setTopOffset(m.get('id'))
              }
            })
          }
        });

        const inputEl = prompt.getEl().query('input')[0]
        inputEl.setAttribute('placeholder', 'Enter a label name...')

      }
    });

    this.addDivider();

    this.addNode({
      label: "Hide columns by selection",
      callback: () => {
        const hiddenOld = this.g.columns.get("hidden");
        const hidden = hiddenOld.concat(this.g.selcol.getAllColumnBlocks({ maxLen: this.model.getMaxLength(), withPos: true }));
        this.g.selcol.reset([]);
        this.g.selcol.renderComparisonColumns();
        return this.g.columns.set("hidden", hidden);
      }
    });

    this.addNode({
      label: "Hide columns by gaps",
      callback: () => {
        let threshold = prompt("Enter threshold (in percent)", 20);
        threshold = threshold / 100;
        const maxLen = this.model.getMaxLength();
        const hidden = [];
        const end = maxLen - 1;
        for (let i = 0; i <= end; i++) {
          let gaps = 0;
          let total = 0;
          this.model.each((el) => {
            if (el.get('seq')[i] === "-") { gaps++; }
            return total++;
          });
          const gapContent = gaps / total;
          if (gapContent > threshold) {
            hidden.push(i);
          }
        }

        this.g.selcol.reset([]);
        this.g.selcol.renderComparisonColumns();
        return this.g.columns.set("hidden", hidden);
      }
    });

    this.addNode({
      label: "Hide columns by conserv threshold",
      callback: (e) => {
        let threshold = prompt("Enter threshold (in percent)", 20);
        threshold = threshold / 100;
        const maxLen = this.model.getMaxLength();
        const hidden = [];
        // TODO: cache this value
        const conserv = this.g.stats.scale(this.g.stats.conservation());
        const end = maxLen - 1;
        for (let i = 0; i <= end; i++) {
          if (conserv[i] < threshold) {
            hidden.push(i);
          }
        }
        return this.g.columns.set("hidden", hidden);
      }
    });

    this.addNode({
      label: "Hide seqs by selection",
      callback: () => {
        const hidden = this.g.selcol.where({ type: "row" });
        const ids = hidden.map((el) => el.get('seqId'));
        this.g.selcol.reset([]);

        return this.model.each((el) => {
          if (ids.indexOf(el.get('id')) >= 0) {
            return el.set('hidden', true);
          }
        });
      }
    });

    this.addNode({
      label: "Hide seqs by gaps",
      callback: () => {
        const threshold = prompt("Enter threshold (in percent)", 40);
        return this.model.each((el, i) => {
          const seq = el.get('seq');
          const gaps = [...seq].reduce((memo, c) => c === '-' ? ++memo : memo, 0);
          if (gaps > threshold) {
            return el.set('hidden', true);
          }
        });
      }
    });

    this.addNode({
      label: "Hide seqs by identity",
      callback: () => {
        let threshold = prompt("Enter threshold (in percent)", 20);
        threshold = threshold / 100;
        // const identityArr = this.g.stats.identity()
        // const filtered = this.model.filter(el => identityArr[el.id] < threshold) 
        // return this.model.remove(filtered)
        return this.model.each((el) => {
          if (this.g.stats.identity()[el.id] < threshold) {
            return el.set('hidden', true);
          }
        });
      }
    });

    this.addDivider();


    this.addNode({
      label: "Reset",
      callback: () => {
        this.g.columns.set("hidden", []);
        this.g.user.set("searchText", null)
        return this.model.each((el) => {
          if (el.get('hidden')) {
            return el.set('hidden', false);
          }
        });
      }
    });

    this.el.appendChild(this.buildDOM());
    return this;
  },
});
export default FilterMenu;
