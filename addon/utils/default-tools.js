import Ember from 'ember';

export default function (editor) {

    return [
        {
            name: "pull-quote",
            icon: "assets/tools/pullquote.svg",
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
            icon: "assets/tools/list-bullets.svg",
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
            icon: "assets/tools/list-number.svg",
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
            name: "p",
            icon: "assets/tools/paragraph.svg",
            selected: false,
            type: 'block',
            visibility: 'secondary',
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
            name: "h2",
            icon: "",
            visibility: 'primary',
            selected: false,
            type: 'block',
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
            name: "h3",
            icon: "",
            selected: false,
            type: 'block',
            visibility: 'primary',
            onClick: (editor) => {
                editor.run(postEditor => {
                    postEditor.toggleSection('h3');
                });
            },
            checkElements: function (elements) {
                Ember.set(this, "selected", elements.filter(element => element.tagName === 'h3').length > 0);
            }
        },
        {
            name: "blockquote",
            icon: "assets/tools/quote.svg",
            selected: false,
            type: 'block',
            visibility: 'primary',
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
            name: "b",
            icon: "assets/tools/bold.svg",
            selected: false,
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
            icon: "assets/tools/italic.svg",
            selected: false,
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
            icon: "assets/tools/link.svg",
            selected: false,
            visibility: 'primary',
            onClick: (editor) => {
                editor.run(postEditor => {
                    postEditor.toggleMarkup('a');
                });
            },
            checkElements: function (elements) {
                Ember.set(this, "selected", elements.filter(element => element.tagName === 'a').length > 0);
            }
        },
        {
            name: "u",
            icon: "assets/tools/underline.svg",
            selected: false,
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
            icon: "assets/tools/strikethrough.svg",
            selected: false,
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
            name: "sub",
            icon: "assets/tools/subscript.svg",
            selected: false,
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
            icon: "assets/tools/superscript.svg",
            selected: false,
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
            visibility: "primary",
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
            name: "html",
            selected: false,
            type: 'newline',
            visibility: "primary",
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
            name: "md",
            selected: false,
            type: 'newline',
            visibility: "primary",
            onClick: (editor) => {
                editor.run(postEditor => {
                    postEditor.toggleMarkup('sup');
                });
            },
            checkElements: function (elements) {
                Ember.set(this, "selected", elements.filter(element => element.tagName === 'sup').length > 0);
            }
        }
    ];
}

