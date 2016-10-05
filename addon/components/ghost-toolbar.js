import Ember from 'ember';
import layout from '../templates/components/ghost-toolbar';

import Tools from '../utils/default-tools';


export default Ember.Component.extend({
    layout,
    classNames: ['toolbar'],
    tools: [],
    toolbar: Ember.computed(function () {
        let visibleTools = [ ];
        if(this.isBlank) {
            this.tools.forEach(tool => {
                if (tool.type === 'block' || tool.type === 'newline') {
                    visibleTools.push(tool);
                }
            });
        } else {
            this.tools.forEach(tool => {
                if(tool.type !== 'newline') {
                    visibleTools.push(tool);
                }
            });
        }
        return visibleTools;
    }).property('tools.@each.selected'),
    init() {
        this._super(...arguments);
        let editor = this.editor = this.get('editor');
        this.tools = Tools(editor);
    },
    didRender() {
        let $this = this.$();
        let editor = this.editor;
        let height = $this.height();


        if(!editor.range || editor.range.head.isBlank) {
            this.$().hide();
        }


        editor.cursorDidChange(() => {
            //if collapsed and the node has changed:
            if(!editor.range || editor.range.head.isBlank) {
                $this.fadeOut();
                return;
            }

            let element = editor.range.head.section.renderNode._element;
            let offset =  this.$(element).offset();
            if (this._element !== element) {
                $this.css('top', (offset.top + Ember.$('.ghost-editor').scrollTop()-height-20) + 'px');
                $this.css('left', (offset.left + Ember.$('.ghost-editor').scrollLeft()) + 'px');
                $this.fadeIn();
                this._element = element;
            }

            this.propertyWillChange('toolbar');

            this.isBlank = editor.range.head.section.isBlank && editor.range.head.isTail();

            this.tools.forEach(tool => {
                if (tool.hasOwnProperty('checkElements')) {
                    tool.checkElements(editor.activeMarkups.concat([{tagName: editor.activeSection._tagName}]));
                }
            });

            this.propertyDidChange('toolbar');
        });
    }
});
