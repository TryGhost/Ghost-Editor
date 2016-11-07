import Ember from 'ember';
import layout from '../../templates/components/markdown-card';
import {formatMarkdown} from '../../helpers/format-markdown';



/* legacyConverter.makeHtml(_.toString(this.get('markdown')))
 */


export default Ember.Component.extend({
  layout,
    isEditing: true,
    editing: function () {
        if(!this.isEditing) {
            // Todo get latest from textarea
            this.set('preview', formatMarkdown([this.payload.markdown]));
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

    })

});
