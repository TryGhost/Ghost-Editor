import Ember from 'ember';
import layout from '../templates/components/ghost-editor';
import Mobiledoc from 'mobiledoc-kit';
import {MOBILEDOC_VERSION} from 'mobiledoc-kit/renderers/mobiledoc';
import {replaceWithListSection, replaceWithHeaderSection} from 'mobiledoc-kit/editor/text-input-handlers';
import createCardFactory from '../utils/card-factory';
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

        this.editor.onTextInput(
            {
                name: 'strong',
                match: /\*\*(.+?)\*\*$/,
                run(editor, matches) {
                    let range = editor.range;
                    range = range.extend(-(matches[0].length));
                    editor.run(postEditor => {

                        let position = postEditor.deleteRange(range);
                        let bold = postEditor.builder.createMarkup('strong');
                        let nextPosition = postEditor.insertTextWithMarkup(position, matches[1], [bold]);
                        postEditor.insertTextWithMarkup(nextPosition, '', []);
                    });
                }
            });
        this.editor.onTextInput(

            {
                name: 'ustrong',
                match: /__(.+?)__$/,
                run(editor, matches) {
                    let range = editor.range;
                    range = range.extend(-(matches[0].length));
                    editor.run(postEditor => {
                        let position = postEditor.deleteRange(range);
                        let bold = postEditor.builder.createMarkup('strong');
                        let nextPosition = postEditor.insertTextWithMarkup(position, matches[1], [bold]);
                        postEditor.insertTextWithMarkup(nextPosition, '', []);
                    });
                }
            });

        this.editor.onTextInput(

            {
                name: 'em',
                match: /(^|[^\*])\*([^\*].*?)\*$/,
                run(editor, matches) {
                    let range = editor.range;
                    let match = matches[0][0] === '*' ? matches[0] : matches[0].substr(1);
                    range = range.extend(-(match.length));
                    editor.run(postEditor => {
                        let position = postEditor.deleteRange(range);
                        let em = postEditor.builder.createMarkup('em');
                        let nextPosition = postEditor.insertTextWithMarkup(position, matches[2], [em]);
                        postEditor.insertTextWithMarkup(nextPosition, '', []);
                    });
                }
            });

        this.editor.onTextInput(
            {
                name: 'uem',
                match: /(^|[^_])_([^_].+?)_$/,
                run(editor, matches) {
                    let range = editor.range;
                    let match = matches[0][0] === '_' ? matches[0] : matches[0].substr(1);
                    range = range.extend(-(match.length));

                    editor.run(postEditor => {
                        let position = postEditor.deleteRange(range);
                        let em = postEditor.builder.createMarkup('em');
                        let nextPosition = postEditor.insertTextWithMarkup(position, matches[2], [em]);
                        postEditor.insertTextWithMarkup(nextPosition, '', []); // insert the un-marked-up space
                    });
                }
            });

        this.editor.onTextInput(
            {
                name: 'link',
                match: /(^|[^!])\[(.*?)\]\((.*?)\)$/,
                run(editor, matches) {
                    let url = matches[3];
                    let text = matches[2];
                    let match = matches[0][0] === '[' ? matches[0] : matches[0].substr(1);
                    let range = editor.range;
                    range = range.extend(-match.length);
                    editor.run(postEditor => {
                        console.log(matches);
                        let position = postEditor.deleteRange(range);
                        let a = postEditor.builder.createMarkup('a', {href: url});
                        let nextPosition = postEditor.insertTextWithMarkup(position, text, [a]);
                        postEditor.insertTextWithMarkup(nextPosition, '', []); // insert the un-marked-up space
                    });
                }
            });

        this.editor.onTextInput(
            {
                name: 'image',
                match: /!\[(.*?)\]\((.*?)\)$/,
                run(editor, matches) {
                    let img = matches[2];
                    let alt = matches[1];

                    let range = editor.range;
                    range = range.extend(-(matches[0].length));
                    editor.run(postEditor => {
                        let card = postEditor.builder.createCardSection('image-card', {pos: "top", img, alt});
                        postEditor.replaceSection(editor.range.headSection, card);
                    });
                }
            });

        this.editor.onTextInput(
            {
                name: 'markdown',
                match: /```([\s\S]*?)```$/,
                run(editor, matches) {
                    let code = matches[0];

                    let range = editor.range;
                    range = range.extend(-(matches[0].length));
                    editor.run(postEditor => {
                        let card = postEditor.builder.createCardSection('markdown-card', {pos: "top", markdown: code });
                        postEditor.replaceSection(editor.range.headSection, card);
                    });
                }
            });

        this.editor.onTextInput(
            {
                name: 'strikethrough',
                match: /~~(.+?)~~$/,
                run(editor, matches) {
                    let range = editor.range;
                    range = range.extend(-(matches[0].length));
                    editor.run(postEditor => {
                        let position = postEditor.deleteRange(range);
                        let s = postEditor.builder.createMarkup('s');
                        let nextPosition = postEditor.insertTextWithMarkup(position, matches[1], [s]);
                        postEditor.insertTextWithMarkup(nextPosition, '', []); // insert the un-marked-up space
                    });
                }
            });

        this.editor.onTextInput(

            {
                name: 'dashul',
                match: /^- $/,
                run(editor) {
                    replaceWithListSection(editor, 'ul');
                }
            });
        this.editor.onTextInput(
            {
                name: 'blockquote',
                match: /^> $/,
                run(editor) {
                    replaceWithHeaderSection(editor, 'blockquote');
                }
            });


        const softReturnKeyCommand = {
            str: 'SHIFT+ENTER',

            run(editor) {
                editor.run(postEditor => {
                    const mention = postEditor.builder.createAtom("soft-return");
                    postEditor.insertMarkers(editor.range.head, [mention]);
                });
            }
        };
        this.editor.registerKeyCommand(softReturnKeyCommand);

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


    },
    willDestroy() {
        this.editor.destroy();
    }

});


