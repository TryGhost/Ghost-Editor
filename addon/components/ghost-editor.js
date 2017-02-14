import Ember from 'ember';
import layout from '../templates/components/ghost-editor';
import Mobiledoc from 'mobiledoc-kit';
import {MOBILEDOC_VERSION} from 'mobiledoc-kit/renderers/mobiledoc';
import createCardFactory from '../utils/card-factory';
import defaultCommands from '../options/default-commands';
import editorCards  from '../cards/index';
//import { VALID_MARKUP_SECTION_TAGNAMES } from 'mobiledoc-kit/models/markup-section'; //the block elements supported by mobile-doc



export const BLANK_DOC = {
    version: MOBILEDOC_VERSION,
    atoms: [],
    markups: [],
    cards: [],
    sections: []
};

export default Ember.Component.extend({
    layout,
    classNames: ['editor-holder'],
    emberCards: Ember.A([]),
    init() {
        this._super(...arguments);


        let mobiledoc = this.get('value') || BLANK_DOC;
        let userCards = this.get('cards') || [];

        if (typeof mobiledoc === "string") {
            mobiledoc = JSON.parse(mobiledoc);
        }

        //if the doc is cached then the editor is loaded and we don't need to continue.
        if (this._cached_doc && this._cached_doc === mobiledoc) {
            return;
        }


        let createCard = createCardFactory.apply(this, {}); //need to pass the toolbar

        const options = {
            mobiledoc: mobiledoc,
            //temp
            cards: createCard(editorCards.concat(userCards)),
            atoms: [{
                name: 'soft-return',
                type: 'dom',
                render() {
                    return document.createElement('br');
                }
            }],
            spellcheck: true,
            autofocus: this.get('shouldFocusEditor'),
            placeholder: 'Click here to start ...'
        };
        this.editor = new Mobiledoc.Editor(options);
    },
    willRender() {
        if(this._rendered) {
            return;
        }
        let editor =this.editor;


        editor.willRender(() => {
            //console.log(Ember.run.currentRunLoop);
            //if (!Ember.run.currentRunLoop) {
              //  this._startedRunLoop = true;
              //  Ember.run.begin();
            //}
        });

        editor.didRender(() => {

            this.sendAction('loaded', editor);
                //Ember.run.end();


        });
        editor.postDidChange(()=> {
            Ember.run.join(() => {
                //store a cache of the local doc so that we don't need to reinitialise it.
                this._cached_doc = editor.serialize(MOBILEDOC_VERSION);
                this.sendAction('onChange', this._cached_doc);
                if (this._cached_doc !== BLANK_DOC && !this._firstChange) {
                    this._firstChange = true;
                    this.sendAction('onFirstChange', this._cached_doc);
                }
            });
        });

    },
    didRender() {

        if(this._rendered) {
            return;
        }
        let editorDom = this.$('.surface')[0];
        editorDom.__GHOST_EDITOR = this.editor; // attach reference of editor to dom for debugging and testing.
                                                // TODO - only do the above when in debug or testing mode
        this.editor.render(editorDom);
        this._rendered = true;

        window.editor = this.editor;
        defaultCommands(this.editor); // initialise the custom text handlers for MD, etc.
        // shouldFocusEditor is only true when transitionaing from new to edit, otherwise it's false or undefined.
        // therefore, if it's true it's after the first lot of content is entered and we expect the caret to be at the
        // end of the document.
        if (this.get('shouldFocusEditor')) {
            var range = document.createRange();
            range.selectNodeContents(this.editor.element);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            this.editor._ensureFocus();
        }

        this.editor.didUpdatePost(postEditor => {
            let topSection = this.editor.post.sections.toArray()[0]; //todo create a .first();
            if(topSection.tagName !== 'h1') {
                let range = this.editor.post.sections.toArray()[0].toRange();
                postEditor.toggleSection('h1', range);
            }
        });


    },
    willDestroy() {
        this.editor.destroy();
    },

    // replace the title with a string.
    setTitle(content) {
        let range = this.editor.post.sections.toArray()[0].toRange();
        this.editor.run(postEditor => {
            let position = postEditor.deleteRange(range);
            postEditor.insertTextWithMarkup(position, content);
        });
    },
    getTitle() {
        return this.editor.post.sections.toArray()[0].text;
    }

});


