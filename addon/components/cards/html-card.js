import Ember from 'ember';
import layout from '../../templates/components/html-card';

export default Ember.Component.extend({
    layout,
    isEditing: false,
    html: "",
    init() {
        this._super(...arguments);
        let payload = this.get('payload');
        if (payload.hasOwnProperty('html')) {
            this.html = payload.html;
            this.isEditing = false;
        } else {
            payload.html = "";
            this.isEditing = true;
        }
    },
    didRender() {
        Ember.$('textarea').on('change', (e) => {
            console.log(this)
            this.get('payload').html = e.target.value;
            this.get('env').save(this.get('payload'), false);
        });
    }
});
