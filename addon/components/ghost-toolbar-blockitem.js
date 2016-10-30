import Ember from 'ember';
import layout from '../templates/components/ghost-toolbar-blockitem';

import Tools from '../utils/default-tools';

export default Ember.Component.extend({
    layout,
    classNames: ['toolbar-block'],
    tools: [],
    toolbar: Ember.computed(function () {
        let postTools = [ ];
        let selectedPostTools = [ ];

        this.tools.forEach(tool => {

            if (tool.type === 'block') {
                if(tool.selected && tool.visibility !== 'primary') {
                    // we have a one tool difference on the left hand side.
                    this.set('non-primary-block-selected', true);
                }
                if (tool.selected) {
                    selectedPostTools.push(tool);
                } else {
                    postTools.push(tool);
                }
            }

        });
        return selectedPostTools.concat(postTools);

    }).property('tools.@each.selected'),

    init() {
        this._super(...arguments);
        let editor = this.editor = this.get('editor');
        this.tools = new Tools(editor, this);

        this.iconURL = this.get('assetPath') + '/tools/';
    },
    didRender() {
        let $this = this.$();
        let editor = this.editor;
        let $editor = Ember.$('.gh-editor-container');

        if(!editor.range || !editor.range.head.section || (editor.range.head.isBlank &&
            editor.range.head.section.renderNode._element.tagName.toLowerCase() === 'p')) {
            this.$().hide();
        }


        editor.cursorDidChange(() => {
            // if there is no cursor:

            if((!editor.range || !editor.range.head.section || editor.range.head.isBlank)) {
                $this.fadeOut();
                return;
            }

            let element = editor.range.head.section.renderNode._element;

            if(this._element === element) {
                return;
            }

            // if the section is a blank section then don't show this menu
            if(editor.range.head.section.isBlank) {
                $this.fadeOut();
                return;
            }

            this.propertyWillChange('toolbar');

            this.__state = 'normal';
            this.isBlank = true;

            let offset =  this.$(element).position();
            let edOffset = $editor.offset();



            $this.css('top', offset.top + $editor.scrollTop() - edOffset.top - 5);
            if(element.tagName.toLowerCase()==='li') {
                $this.css('left', this.$(element.parentNode).position().left + $editor.scrollLeft() - 90);
            } else {
                $this.css('left', offset.left + $editor.scrollLeft() - 90);
            }


            $this.fadeIn();

            this._element = element;


            this.tools.forEach(tool => {
                if (tool.hasOwnProperty('checkElements')) {
                    // if its a list we want to know what type
                    let sectionTagName = editor.activeSection._tagName === 'li' ? editor.activeSection.parent._tagName : editor.activeSection._tagName;
                    tool.checkElements(editor.activeMarkups.concat([{tagName: sectionTagName}]));
                }
            });

            this.propertyDidChange('toolbar');

        });
    }
});
