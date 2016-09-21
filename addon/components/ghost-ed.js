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
	didRender( ) {
		
		if(this._cached_doc) {
			return;
		}
		
		const options = { 
			doc : this._cached_doc || this.get('value') || BLANK_DOC,
			cards : this.get('cards') || [],
			markups : [],
			atoms : this.get('atoms') || [] 
		};
		let editor = new Mobiledoc.Editor(options);
		editor.render(this.$()[0]);
		editor.postDidChange(()=>{
			
			Ember.run.join(() => {
				this.sendOnChange(editor);
//				this.sendAction('on-change', editor.serialize('0.3.0'));
			});
		});
    	window.editor = editor; //make editor a global so that I can inspect it's state with the console.
	},
	sendOnChange(editor) {
		console.log("SENDONCHANGE");
		this._cached_doc = editor.serialize(MOBILEDOC_VERSION);
		this.sendAction('on-change', JSON.stringify(this._cached_doc));
	}
});