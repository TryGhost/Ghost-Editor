import Ember from 'ember';
import layout from '../templates/components/ghost-toolbar-button';

export default Ember.Component.extend({
    layout,
    actions: {
        click: function () {
            this.tool.onClick(this.editor);
        },
    }
});
