import Ember from 'ember';
import layout from '../templates/components/ghost-toolbar-button';

export default Ember.Component.extend({
  layout,
  actions:{
    //this.get("editor").run(postEditor => {postEditor.toggleMarkup('strong');});
    click: function() {this.tool.onClick(this.editor);}
  }
});
