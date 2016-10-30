import Ember from 'ember';
import Tools from '../utils/default-tools';
import layout from '../templates/components/slash-menu';

export default Ember.Component.extend({
    layout,
    classNames: ['slash-menu'],
    toolbar: Ember.computed(function () {
        let tools = [ ];
        let match = (this.query || "").trim().toLowerCase();
        this.tools.forEach((tool) => {
            if ((tool.type === 'block' || tool.type === 'newline') && (tool.label.toLowerCase().startsWith(match.toLowerCase()) || tool.name.toLowerCase().startsWith(match.toLowerCase()))) {
                tools.push(tool);
            }
        });

        if(tools.length <  1) {
            this.isActive = false;
            this.$().hide();
        }

        return tools;
    }).property('query'),

    init() {
        this._super(...arguments);
        this.tools =new Tools(this.get('editor'), this);
        this.iconURL = this.get('assetPath') + '/tools/';

        this.editor.cursorDidChange(this.cursorChange.bind(this));
        let self = this;
        this.editor.onTextInput(
        {
            name: 'slash_menu',
            text: '/',
            run(editor) {
                let $this = self.$();
                let $editor = Ember.$('.gh-editor-container');

                self._node = editor.range.head.section;
                self._offset = editor.range.head.offset;
                self.isActive = true;

                let range = window.getSelection().getRangeAt(0); // get the actual range within the DOM.

                let position =  range.getBoundingClientRect();
                let edOffset = $editor.offset();

                $this.show();
                $this.css('top', position.top + $editor.scrollTop() - edOffset.top + 20); //- edOffset.top+10
                $this.css('left', position.left + (position.width / 2) + $editor.scrollLeft() - edOffset.left );

                this.query="";
                this.propertyDidChange('toolbar');
            }
        });

    },
    cursorChange() {
        if(this.isActive) {
            if(!this.editor.range.isCollapsed || this.editor.range.head.section !== this._node || this.editor.range.head.offset < 1) {
                this.isActive = false;
                this.$().hide();
                return;
            }
            this.query = this.editor.range.head.section.text.substring( this._offset, this.editor.range.head.offset);

            this.propertyDidChange('toolbar');

        }

    }
});
