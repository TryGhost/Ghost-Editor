import Ember from 'ember';
import layout from '../templates/components/ghost-editor';
import Mobiledoc from 'mobiledoc-kit';
import {MOBILEDOC_VERSION} from 'mobiledoc-kit/renderers/mobiledoc';
import createCardFactory from '../utils/cardFactory';
import editorCards  from '../cards/index';
//import { VALID_MARKUP_SECTION_TAGNAMES } from 'mobiledoc-kit/models/markup-section'; //the block elements supported by mobile-doc

export const BLANK_DOC = {
    version: MOBILEDOC_VERSION,
    atoms: [],
    markups: [],
    cards: [],
    sections: [[1,"p",[]]]
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

        console.log("CARDS", editorCards);

        const options = {
            mobiledoc: mobiledoc,
            //temp
            cards: createCard(editorCards),
            markups: [],
            atoms: [],
            spellcheck: true,
            autofocus: this.get('shouldFocusEditor'),
            placeholder: 'Click here to start ...'
        };


       let editor = this.editor = new Mobiledoc.Editor(options);

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

        if (this._rendered) {
            return;
        }
        let editorDom = this.$('.surface')[0];
        editorDom.__GHOST_EDITOR = this.editor; // attach reference of editor to dom for debugging and testing.
                                                // TODO - only do the above when in debug or testing mode
        this.editor.render(editorDom);
        this._rendered = true;

        window.editor = this.editor;

        this.editor.onTextInput(

            {
                name: 'bold',
                match: /\*\*(.+?)\*\*/,
                run(editor, matches) {
                    let range = editor.range;
                    range = range.extend(-(matches[0].length));
                    editor.run(postEditor => {
                        let position = postEditor.deleteRange(range);
                        let bold = postEditor.builder.createMarkup('strong');
                        let nextPosition = postEditor.insertTextWithMarkup(position, matches[1], [bold]);
                        postEditor.insertTextWithMarkup(nextPosition, '', []); // insert the un-marked-up space
                    });
                }
            });


        this.editor.onTextInput(

            {
                name: 'em',
                match: /[^\*]\*[^\*](.+?)\*/,
                run(editor, matches) {
                    let range = editor.range;
                    range = range.extend(-(matches[0].length));
                    editor.run(postEditor => {
                        let position = postEditor.deleteRange(range);
                        let em = postEditor.builder.createMarkup('em');
                        let nextPosition = postEditor.insertTextWithMarkup(position, matches[1], [em]);
                        postEditor.insertTextWithMarkup(nextPosition, '', []); // insert the un-marked-up space
                    });
                }
            });

        this.editor.onTextInput(

            {
                name: 'link',
                match: /\[(.*)?\]\((.*)?\)/,
                run(editor, matches) {
                    let url = matches[2];
                    let text = matches[1];

                    let range = editor.range;
                    range = range.extend(-(matches[0].length));
                    editor.run(postEditor => {
                        let position = postEditor.deleteRange(range);
                        let a = postEditor.builder.createMarkup('a', {href: url});
                        let nextPosition = postEditor.insertTextWithMarkup(position, text, [a]);
                        postEditor.insertTextWithMarkup(nextPosition, '', []); // insert the un-marked-up space
                    });

                    //let markup = postEditor.builder.createMarkup('a', {href: url});
                }
            });
/*
        this.editor.onTextinput(

        {
            name: 'heading',
                // "# " -> h1, "## " -> h2, "### " -> h3
                match: /(?:__|[*#])|\[(.*?)\]\(.*?\)$/,
            run(editor, matches) {
                console.log("LINK MATCHES", matches);
            }
        });*/



        //VALID_MARKUP_SECTION_TAGNAMES


        /*if(this.get('container').lookup('controller:application').currentPath === 'editor.edit') {

         }*/

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
            editor._ensureFocus();
        }


    }

});


function replaceWithHeaderSection(editor, headingTagName) {
    let { range: { head, head: { section } } } = editor;
    // Skip if cursor is not at end of section
    if (!head.isTail()) {
        return;
    }

    editor.run(postEditor => {
        let { builder } = postEditor;
        let newSection = builder.createMarkupSection(headingTagName);
        postEditor.replaceSection(section, newSection);
        postEditor.setRange(newSection.headPosition());
    });
}

