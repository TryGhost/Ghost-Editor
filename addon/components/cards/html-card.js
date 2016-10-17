import Ember from 'ember';
import layout from '../../templates/components/html-card';


export default Ember.Component.extend({
    layout,
    isEditing: false,
    value : Ember.computed('payload', {
        get(key) {
            console.log("HTMLCARDPAYLOADGET", this.get('payload'));
            console.log(this.get('env'));
            return this.get('payload').html || '';
        },

        set(key, value) {

            this.get('payload').html = value;
            console.log(this.get('env'));
            this.get('env').save(this.get('payload'), false);
            console.log("HTMLCARDPAYLOADSAVE", this.get('payload'));
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
