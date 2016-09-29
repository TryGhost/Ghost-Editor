import Ember from 'ember';
import layout from '../templates/components/ghost-card';

export default Ember.Component.extend({
  layout,
  didRender() {
  	let editor = this.get('editor');
  	this.$('li')[0].addEventListener('dragstart', event => {
  		
  		// we go through all the listeners and add a mouse over handler on every element
  		
  		editor.post.sections.forEach( item => {
  			// we need to use named functions to unbind functions
  			Ember.$(item.renderNode._element).on('dragover', ev => dragover(editor, item, ev));
  			Ember.$(item.renderNode._element).on('dragout', ev => dragout(editor, item, ev));
  			//Ember.$(item.renderNode._element).on('drop', ev => alert('drop'));//drop(editor, this, ev));
  		}); // the alternatives include elementFromPoint, but this seems faster
  	});
   	this.$('li')[0].addEventListener('dragend', (event) => {
  		drop(editor, this);
  	});

  }
});

// needs to be bound to a post section
function dragover(editor, item, event) {
	editor.dateNow = editor.dateNow || 0;
	if(editor.dateNow + 300 > Date.now()) {
		return;
	}
	editor.dateNow = Date.now();
	let $el = Ember.$(item.renderNode._element);
	let offset = $el[0].getBoundingClientRect();//event.srcElement.getBoundingClientRect();
    let mouseX = event.originalEvent.pageX - offset.left;
    let mouseY = event.originalEvent.pageY - offset.top;
    if(!editor.__GHOST_DRAG_ITEM__ ) {
      editor.__GHOST_DRAG_ITEM__ = item;
    } else if(editor.__GHOST_DRAG_ITEM__.renderNode._element !== item.renderNode._element) {
    	Ember.$(editor.__GHOST_DRAG_ITEM__.renderNode._element).removeClass('dropper-left dropper-right dropper-top dropper-bottom');
    	editor.__GHOST_DRAG_ITEM__ = item;
    } else {
    	$el.removeClass('dropper-left dropper-right dropper-top dropper-bottom'); // should probably cache the position, but premature optimisation and all that.
    }
    if( mouseX < 100 ) { //&& window.dragel.card.resizeMode != "full_width_only"
      $el.addClass('dropper-left');
    } else if( mouseX > offset.width-100 ){ //  && window.dragel.card.resizeMode != "full_width_only"
    	$el.addClass('dropper-right');
    } else if( mouseY > offset.height / 2 ) {
    	$el.addClass('dropper-bottom');
    } else {
    	$el.addClass('dropper-top');
     
    }

    event.preventDefault();
}

function dragout(editor, item, event) {
	let $el = Ember.$(this.renderNode._element);
	$el.removeClass('dropper-left dropper-right dropper-top dropper-bottom');
  delete editor.__GHOST_DRAG_ITEM__;
}

function drop(editor, card) {
   
     // turn off all the listeners taht we just
   if(!editor.__GHOST_DRAG_ITEM__) {
    return;
   }
   // drop the element
  editor.run( postEditor => {
      let card2 = postEditor.builder.createCardSection(card.card.name || "image", { pos : "top" });
      
      postEditor.insertSectionBefore(editor.post.sections, card2, editor.__GHOST_DRAG_ITEM__.next);
  });

   editor.post.sections.forEach(section => {
    let $el = Ember.$(section.renderNode._element);
    $el.removeClass('dropper-left dropper-right dropper-top dropper-bottom');
    $el.off('dragover'); //, dragover.bind(section)
    $el.off('dragout'); //, dragout.bind(section)
    $el.off('drop'); //, drop.bind(this)
  });

}