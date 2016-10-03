export default function (editor) {
    return [ //temp, this will be dynamic...
        {
            name: "p",
            icon: "",
            selected: false,
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
            selected: false,
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
            name: "ul",
            icon: "",
            selected: false,
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
            icon: "",
            selected: false,
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
            name: "b",
            icon: "",
            selected: false,
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
            icon: "",
            selected: false,
            onClick: (editor) => {
                editor.run(postEditor => {
                    postEditor.toggleMarkup('em');
                });
            },
            checkElements: function (elements) {
                Ember.set(this, "selected", elements.filter(element => element.tagName === 'em').length > 0);
            }
        }
    ];
}

