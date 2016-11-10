import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import startApp from '../../helpers/start-app';
//import run from 'ember-runloop';
import Ember from 'ember';
let App;
moduleForComponent('ghost-editor', 'Integration | Component | ghost editor', {
  integration: true,
    setup: function() {
        App = startApp();
    },
    teardown: function() {
        Ember.run(App, 'destroy');
    }
});


const blankDoc = {version:"0.3.0",atoms:[],cards:[],markups:[],sections:[[1,"p",[[0,[],0,""]]]]};

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });


    assert.expect(2);

    this.set('mobiledoc', blankDoc);
    this.render(hbs`{{ghost-editor value=mobiledoc}}`);

    assert.ok(
        this.$('.surface').prop('contenteditable'),
        'editor is created'
    );


    let editor = window.editor;
    return wait().then(() => {
        return selectRangeWithEditor(editor, editor.post.tailPosition());
    }).then(() => {
        Ember.run(() => editor.insertText('abcdef'));
        return wait();
    }).then(() => {
        assert.equal('abcdef', $('.surface')[0].childNodes[0].innerHTML, 'editor renders changes into the dom');
    });
});

test('markdown support', function(assert) {
   assert.expect(1);

    this.set('mobiledoc', blankDoc);
    this.render(hbs`{{ghost-editor value=mobiledoc}}`);

    let editor = window.editor;
    return wait().then(() => {
        return selectRangeWithEditor(editor, editor.post.tailPosition());
    }).then(() => {
        Ember.run(() => editor.insertText('1.'));
        keyEvent('.surface', 'keyup', 75)
        return wait();
    }).then(() => {
        assert.equal('1.', $('.surface')[0].childNodes[0].innerHTML, 'editor renders changes into the dom');
        stop();
    });
});

let runLater = (cb) => window.requestAnimationFrame(cb);
function selectRangeWithEditor(editor, range) {
    editor.selectRange(range);
    return new Ember.RSVP.Promise(resolve => runLater(resolve));
}
