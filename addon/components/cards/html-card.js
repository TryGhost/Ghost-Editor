import Ember from 'ember';
import layout from '../../templates/components/html-card';


export default Ember.Component.extend({
    layout,
    name: 'html-card',
    label: 'HTML',
    type: 'dom',
    genus: 'ember',
    isEditing: false,
    value : Ember.computed('payload', {
        get(key) {
            return this.get('payload').html || '';
        },

        set(key, value) {
            this.get('payload').html = value;
            this.get('env').save(this.get('payload'), false);
            return this.get('payload').html;
        }

    }),
    name: 'html-card',
    label: 'HTML',
    type: 'dom',
    genus: 'ember',
    init() {
        this._super(...arguments);
        let payload = this.get('payload');
        if (payload.hasOwnProperty('html')) {
            this.isEditing = false;
        } else {
            this.isEditing = true;
        }
    },
    didRender() {
        //Ember.$('textarea').on('change', (e) => {
        //    this.get('payload').html = e.target.value;
        //    this.get('env').save(this.get('payload'), false);
        //});
    }
});


// non editor cards need to be vanilla javascript
export let html = {

};
