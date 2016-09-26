import Ember from 'ember';
import layout from '../templates/components/ghost-editor';
import Mobiledoc from 'mobiledoc-kit';
import { MOBILEDOC_VERSION } from 'mobiledoc-kit/renderers/mobiledoc';


export const BLANK_DOC = {
    version: MOBILEDOC_VERSION,
    markups: [],
    atoms: [],
    cards: [],
    sections: [] 
};


export default Ember.Component.extend({
    layout,
    classNames: ['editor-holder'],
    init( ) {
        this._super(...arguments);
        let mobiledoc = this.get('value') || BLANK_DOC;
        if(typeof mobiledoc === "string") {
            mobiledoc = JSON.parse(mobiledoc);
        }

        //if the doc is cached then the editor is loaded and we don't need to continue.
        if(this._cached_doc && this._cached_doc === mobiledoc ) {
            return;
        }
        
        const options = { 
            mobiledoc : mobiledoc,
            cards : this.get('cards') || [],
            markups : [],
            atoms : this.get('atoms') || [],
            spellcheck: true,
            autofocus: this.get('shouldFocusEditor')
        };

        let editor = this.editor = new Mobiledoc.Editor(options);
        
        editor.postDidChange(()=>{
            Ember.run.join(() => {
                //store a cache of the local doc so that we don't need to reinitialise it.
                this._cached_doc = editor.serialize(MOBILEDOC_VERSION); 
                this.sendAction('onChange', this._cached_doc);
                if(this._cached_doc !== BLANK_DOC && !this._firstChange) {
                    this._firstChange = true;
                    this.sendAction('onFirstChange', this._cached_doc);
                    //editor.selectRange(editor.post.headPosition());
                }
            });
        });
    },
    didRender( ) {
        
        if(this._rendered) {
            return;
        }
        let editorDom = this.$('.editor')[0];
        editorDom.__GHOST_EDITOR = this.editor; // attach reference of editor to dom for debugging and testing.
                                                // TODO - only do the above when in debug or testing mode
        this.editor.render(editorDom);
        this._rendered = true;
        /*if(this.get('container').lookup('controller:application').currentPath === 'editor.edit') {

        }*/

        // shouldFocusEditor is only true when transitionaing from new to edit, otherwise it's false or undefined.
        // therefore, if it's true it's after the first lot of content is entered and we expect the caret to be at the
        // end of the document.
        if(this.get('shouldFocusEditor')) {
            var range = document.createRange();
            range.selectNodeContents(this.editor.element);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
    
});