import Ember from 'ember';
import layout from '../../templates/components/html-card';

export default Ember.Component.extend({
    layout,
    isEditing: false,
    html: "",
    init() {
        this._super(...arguments);
        let payload = this.get('payload');
        if (payload.hasOwnProperty('value')) {
            this.html = payload.value;
            this.isEditing = false;
        } else {
            payload.value = "";
            this.isEditing = true;
        }
    }
});
