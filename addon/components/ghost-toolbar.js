import Ember from 'ember';
import layout from '../templates/components/ghost-toolbar';

import Tools from '../utils/temp-tools';


export default Ember.Component.extend({
    layout,
    classNames: ['toolbar'],
    tools: [],
    toolbar: Ember.computed(function () {
        return this.tools;
    }).property('tools.@each.selected'),
    init() {
        this._super(...arguments);
        let editor = this.editor = this.get('editor');
        this.tools = Tools(editor);


        editor.cursorDidChange(() => {
            //if collapsed and the node has changed:
            let element = editor.range.head.section.renderNode._element;
            if (this._element !== element) {
                //this.$().css('top', (this.$(element).offset().top + Ember.$('.ghost-editor').scrollTop()-80) + 'px');
                this._element = element;
            }

            this.propertyWillChange('toolbar');

            console.log("ED", editor.activeMarkups.concat([{tagName: editor.activeSection._tagName}]));
            this.tools.forEach(tool => {
                if (tool.hasOwnProperty('checkElements')) {
                    tool.checkElements(editor.activeMarkups.concat([{tagName: editor.activeSection._tagName}]));
                }
            });

            this.propertyDidChange('toolbar');
        });

    }
});
