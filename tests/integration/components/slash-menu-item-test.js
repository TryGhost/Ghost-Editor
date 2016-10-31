import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('slash-menu-item', 'Integration | Component | slash menu item', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{slash-menu-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#slash-menu-item}}
      template block text
    {{/slash-menu-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
