import Ember from 'ember';
import layout from '../templates/components/ghost-wordcount';

export default Ember.Component.extend({
    layout,
    init( ) {

        window.setInterval(() => {
            this.element.firstChild.innerHTML = this.get('editor').element.textContent.split(' ').length + ' words';
        }, 1000);
    }
});
