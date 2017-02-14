import Ember from 'ember';
import layout from '../../templates/components/markdown-card';
import {formatMarkdown} from '../../libs/format-markdown';



/* legacyConverter.makeHtml(_.toString(this.get('markdown')))
 */


export default Ember.Component.extend({
  layout,
    isEditing: true,
    editing: function () {
        if(!this.isEditing) {
            this.set('preview', formatMarkdown([this.get('payload').markdown]));
        }
    }.observes('isEditing'),
    value : Ember.computed('payload', {
        get() {
            return this.get('payload').markdown || '';
        },

        set(_, value) {
            this.get('payload').markdown = value;
            this.get('env').save(this.get('payload'), false);
            return value;
        }

    }),
    actions: {
        updateValue( ) {
            this.get('payload').markdown = this.$('textarea').val();
            this.get('env').save(this.get('payload'), false);
            this.set('preview', formatMarkdown([this.get('payload').markdown]));
        }
    },
    drop(event) {
        const el = this.$('textarea')[0];
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const placeholderText = '![uploading...]()';
        el.value = el.value.substring(0, start) + placeholderText + el.value.substring(end, el.value.length);
        el.selectionStart = start;
        el.selectionEnd = end + placeholderText.length;


        this.send('fileSelected', event.dataTransfer.files);

        event.preventDefault();
    }

});
