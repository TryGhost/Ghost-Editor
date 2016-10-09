import Ember from 'ember';
import layout from '../templates/components/ghost-toolbar';

import Tools from '../utils/default-tools';
import ghostPaths from 'ghost-editor/utils/ghost-paths';

export default Ember.Component.extend({
    layout,
    classNames: ['toolbar'],
    classNameBindings: ['non-primary-block-selected'],
    tools: [],
    toolbar: Ember.computed(function () {
        // TODO if a block section other than a primary section is selected then
        // the returned list removes one of the primary sections to compensate,
        // so that there are only ever four primary sections.
        let visibleTools = [ ];
        if(this.isBlank) {
            this.tools.forEach(tool => {
                if (tool.type === 'block' || tool.type === 'newline') {
                    visibleTools.push(tool);
                }
            });
        } else {
            let isNonPrimaryToolSelected = false;   // if a non primary tool is selected then the offset for the
                                                    // negatie margin in the CSS animation needs to change.
            this.tools.forEach(tool => {
                if(tool.type !== 'newline') {
                    visibleTools.push(tool);
                    if(tool.type === 'block' && tool.selected && tool.visibility !== 'primary') {
                        isNonPrimaryToolSelected = true;
                    }
                }
            });
            this.set('non-primary-block-selected', isNonPrimaryToolSelected);
        }
        return visibleTools;
    }).property('tools.@each.selected'),
    init() {
        this._super(...arguments);
        let editor = this.editor = this.get('editor');
        this.tools = Tools(editor);

        this.iconURL = ghostPaths().assetRoot + 'tools/';
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
                let $editor = Ember.$('.ghost-editor');

                $this.animate({
                    top: offset.top + $editor.scrollTop()-height-20,
                    left: offset.left + $editor.scrollLeft()
                }, 50);
             //   $this.css('top', (offset.top + $editor.scrollTop()-height-20) + 'px');
             //   $this.css('left', (offset.left + $editor.scrollLeft()) + 'px');
                $this.fadeIn();
                this._element = element;
            }

            this.propertyWillChange('toolbar');

            this.isBlank = editor.range.head.section.isBlank && editor.range.head.isTail();

            this.tools.forEach(tool => {
                if (tool.hasOwnProperty('checkElements')) {
                    // if its a list we want to know what type
                    let sectionTagName = editor.activeSection._tagName === 'li'
                        ? editor.activeSection.parent._tagName
                        : editor.activeSection._tagName;
                    tool.checkElements(editor.activeMarkups.concat([{tagName: sectionTagName}]));
                }
            });

            this.propertyDidChange('toolbar');
        });
    }
});
