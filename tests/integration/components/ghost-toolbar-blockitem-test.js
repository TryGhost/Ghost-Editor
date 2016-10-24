import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ghost-toolbar-blockitem', 'Integration | Component | ghost toolbar blockitem', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ghost-toolbar-blockitem}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ghost-toolbar-blockitem}}
      template block text
    {{/ghost-toolbar-blockitem}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
