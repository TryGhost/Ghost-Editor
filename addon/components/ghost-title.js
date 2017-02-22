import Ember from 'ember';
import layout from '../templates/components/ghost-title';
import Mobiledoc from 'mobiledoc-kit';
import {MOBILEDOC_VERSION} from 'mobiledoc-kit/renderers/mobiledoc';

export const BLANK_DOC = {
    version: MOBILEDOC_VERSION,
    atoms: [],
    markups: [],
    cards: [],
    sections: [[1,"h2",[]]]
};

export default Ember.Component.extend({
  layout,
    classNames: ['title'],
    init() {
        this._super(...arguments);
        const options = {
            mobiledoc: BLANK_DOC,
            spellcheck: true,
            autofocus: this.get('shouldFocusEditor'),
            placeholder: 'Your post title.'
        };
        this.editor = new Mobiledoc.Editor(options);
    },
    willRender() {
        if(this._rendered) {
            return;
        }
        let editor =this.editor;

        editor.postDidChange(()=> {
            Ember.run.join(() => {
                //store a cache of the local doc so that we don't need to reinitialise it.
                this._cached_doc = editor.serialize(MOBILEDOC_VERSION);
            });
        });

    },
    didRender() {

        if(this._rendered) {
            return;
        }
        let editorDom = this.$()[0];
        this.editor.render(editorDom);
        this._rendered = true;

    }
});
