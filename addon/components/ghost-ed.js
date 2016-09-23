import Ember from 'ember';
import layout from '../templates/components/ghost-ed';
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
            autofocus: false
        };

        let editor = this.editor = new Mobiledoc.Editor(options);
        
        editor.postDidChange(()=>{
            
            Ember.run.join(() => {
                //store a cache of the local doc so that we don't need to reinitialise it.
                this._cached_doc = editor.serialize(MOBILEDOC_VERSION); 
                this.sendAction('onChange', this._cached_doc);
            });
        });
        window.editor = editor; //make editor a global so that I can inspect it's state with the console.
    },
    didRender( ) {
        
        if(this._rendered) {
            return;
        }
        this.editor.render(this.$('.editor')[0]);
        this._rendered = true;
    }
    
});