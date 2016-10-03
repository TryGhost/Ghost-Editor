import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('mobiledoc-editor', 'Integration | Component | mobiledoc editor', {
    integration: true
});

test('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{mobiledoc-editor}}`);

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(hbs`
    {{#mobiledoc-editor}}
      template block text
    {{/mobiledoc-editor}}
  `);

    assert.equal(this.$().text().trim(), 'template block text');
});
