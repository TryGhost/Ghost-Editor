import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ghost-toolbar', 'Integration | Component | ghost toolbar', {
    integration: true
});

test('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{ghost-toolbar}}`);

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(hbs`
    {{#ghost-toolbar}}
      template block text
    {{/ghost-toolbar}}
  `);

    assert.equal(this.$().text().trim(), 'template block text');
});
