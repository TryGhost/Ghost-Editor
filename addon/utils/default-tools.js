import Ember from 'ember';

export default function (editor, toolbar) {

    return [
        {
            name: "p",
            icon: "paragraph.svg",
            selected: false,
            type: 'block',
            onClick: (editor) => {
                editor.run(postEditor => {
                    postEditor.toggleSection('p');
                });
            },
            checkElements: function (elements) {
                Ember.set(this, "selected", elements.filter(element => element.tagName === 'p').length > 0);
            }
        },
        {
            name: "blockquote",
            icon: "quote.svg",
            selected: false,
            type: 'block',
            onClick: (editor) => {
                editor.run(postEditor => {
                    postEditor.toggleSection('blockquote');
                });
            },
            checkElements: function (elements) {
                Ember.set(this, "selected", elements.filter(element => element.tagName === 'blockquote').length > 0);
            }
        },
        {
            name: "pull-quote",
            icon: "pullquote.svg",
            selected: false,
            type: 'block',
            onClick: (editor) => {
                editor.run(postEditor => {
                    postEditor.toggleSection('pull-quote');
                });
            },
            checkElements: function (elements) {
                Ember.set(this, "selected", elements.filter(element => element.tagName === 'pull-quote').length > 0);
            }
        },
        {
            name: "ul",
            icon: "list-bullets.svg",
            selected: false,
            type: 'block',
            onClick: (editor) => {
                editor.run(postEditor => {
                    postEditor.toggleSection('ul');
                });
            },
            checkElements: function (elements) {
                Ember.set(this, "selected", elements.filter(element => element.tagName === 'ul').length > 0);
            }
        },
        {
            name: "ol",
            icon: "list-number.svg",
            selected: false,
            type: 'block',
            onClick: (editor) => {
                editor.run(postEditor => {
                    postEditor.toggleSection('ol');
                });
            },
            checkElements: function (elements) {
                Ember.set(this, "selected", elements.filter(element => element.tagName === 'ol').length > 0);
            }
        },

        {
            name: "h1",
            icon: "",
            visibility: 'primary',
            selected: false,
            type: 'block',
            onClick: (editor) => {
                editor.run(postEditor => {
                    postEditor.toggleSection('h1');
                });
            },
            checkElements: function (elements) {
                Ember.set(this, "selected", elements.filter(element => element.tagName === 'h1').length > 0);
            }
        },
        {
            name: "h2",
            icon: "",
            selected: false,
            type: 'block',
            visibility: 'primary',
            onClick: (editor) => {
                editor.run(postEditor => {
                    postEditor.toggleSection('h2');
                });
            },
            checkElements: function (elements) {
                Ember.set(this, "selected", elements.filter(element => element.tagName === 'h2').length > 0);
            }
        },


        {
            name: "u",
            icon: "underline.svg",
            selected: false,
            type: 'markup',
            onClick: (editor) => {
                editor.run(postEditor => {
                    postEditor.toggleMarkup('u');
                });
            },
            checkElements: function (elements) {
                Ember.set(this, "selected", elements.filter(element => element.tagName === 'u').length > 0);
            }
        },
        {
            name: "s",
            icon: "strikethrough.svg",
            selected: false,
            type: 'markup',
            onClick: (editor) => {
                editor.run(postEditor => {
                    postEditor.toggleMarkup('s');
                });
            },
            checkElements: function (elements) {
                Ember.set(this, "selected", elements.filter(element => element.tagName === 's').length > 0);
            }
        },
        {
            name: "b",
            icon: "bold.svg",
            selected: false,
            type: 'markup',
            visibility: 'primary',
            onClick: (editor) => {
                editor.run(postEditor => {
                    postEditor.toggleMarkup('strong');
                });
            },
            checkElements: function (elements) {
                Ember.set(this, "selected", elements.filter(element => element.tagName === 'strong').length > 0);
            }
        },
        {
            name: "i",
            icon: "italic.svg",
            selected: false,
            type: 'markup',
            visibility: 'primary',
            onClick: (editor) => {
                editor.run(postEditor => {
                    postEditor.toggleMarkup('em');
                });
            },
            checkElements: function (elements) {
                Ember.set(this, "selected", elements.filter(element => element.tagName === 'em').length > 0);
            }
        },
        {
            name: "a",
            icon: "link.svg",
            selected: false,
            type: 'markup',
            visibility: 'primary',
            onClick: (editor) => {
                //editor.run(postEditor => {
                    toolbar.set('isLink', true);
                    toolbar.$('input').focus();
                //});
            },
            checkElements: function (elements) {
                Ember.set(this, "selected", elements.filter(element => element.tagName === 'a').length > 0);
            }
        },
        {
            name: "sub",
            icon: "subscript.svg",
            selected: false,
            type: 'markup',
            onClick: (editor) => {
                editor.run(postEditor => {
                    postEditor.toggleMarkup('sub');
                });
            },
            checkElements: function (elements) {
                Ember.set(this, "selected", elements.filter(element => element.tagName === 'sub').length > 0);
            }
        },
        {
            name: "sup",
            icon: "superscript.svg",
            selected: false,
            type: 'markup',
            onClick: (editor) => {
                editor.run(postEditor => {
                    postEditor.toggleMarkup('sup');
                });
            },
            checkElements: function (elements) {
                Ember.set(this, "selected", elements.filter(element => element.tagName === 'sup').length > 0);
            }
        },
        {
            name: "img",
            selected: false,
            type: 'newline',
            icon: 'file-picture-add.svg',
            visibility: "primary",
            onClick: (editor) => {
                editor.run(postEditor => {
                    let card = postEditor.builder.createCardSection('image-card', {pos: "top"});
                    postEditor.replaceSection(editor.range.headSection, card);

                });
            },
            checkElements: function (elements) {
                Ember.set(this, "selected", elements.filter(element => element.tagName === 'sup').length > 0);
            }
        },
        {
            name: "html",
            selected: false,
            type: 'newline',
            icon: 'html-five.svg',
            visibility: "primary",
            onClick: (editor) => {
                editor.run(postEditor => {
                    let card = postEditor.builder.createCardSection('html-card', {pos: "top"});
                    postEditor.replaceSection(editor.range.headSection, card);
                });
            },
            checkElements: function (elements) {

            }
        },
        {
            name: "md",
            selected: false,
            type: 'newline',
            visibility: "primary",
            icon: 'file-code-1.svg',
            onClick: (editor) => {
                editor.run(postEditor => {
                    let card = postEditor.builder.createCardSection('markdown-card', {pos: "top"});
                    postEditor.replaceSection(editor.range.headSection, card);
                });
            },
            checkElements: function (elements) {

            }
        },
        {
            name: 'edit',
            selected: false,
            type: 'card',
            visibility: 'primary',
            icon: 'file-code-edit.svg',
            onClick: ()=>{},
            checkElements:()=>{}
        }
        ,
        {
            name: 'delete',
            selected: false,
            type: 'card',
            visibility: 'primary',
            icon: 'close.svg',
            onClick: ()=>{},
            checkElements:()=>{}
        }
    ];
}

