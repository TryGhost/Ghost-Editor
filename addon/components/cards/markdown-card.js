import Ember from 'ember';
import layout from '../../templates/components/markdown-card';

export default Ember.Component.extend({
  layout,
    value : Ember.computed('payload', {
        get(key) {
            return this.get('payload').markdown || '';
        },

        set(key, value) {
            this.get('payload').markdown = value;
            this.get('env').save(this.get('payload'), false);
            return this.get('payload').markdown;
        }

    })

});
