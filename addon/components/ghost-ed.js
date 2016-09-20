import Ember from 'ember';
import layout from '../templates/components/ghost-ed';
import Mobiledoc from 'mobiledoc-kit';
import { MOBILEDOC_VERSION } from 'mobiledoc-kit/renderers/mobiledoc';


export default Ember.Component.extend({
  layout
});

const cards = [];
const atoms = [];
const markups = [];


const BLANK_DOC = {
	version: MOBILEDOC_VERSION,
	markops: [],
	atoms: [],
	cards: [],
	sections: [] 
};


export default Ember.Component.extend({
	layout,
	didRender( ) {
		const options = { BLANK_DOC ,  cards  , markups ,  atoms };
		let editor = new Mobiledoc.Editor(options);
		editor.render(this.$()[0]);
    	window.editor = editor; //make editor a global so that I can inspect it's state with the console.
	}
});