import Ember from 'ember';
import {task} from 'ember-concurrency';
import layout from '../templates/components/ghost-toolbar';

import Tools from '../utils/default-tools';

export default Ember.Component.extend({
    layout,
    classNames: ['toolbar'],
    classNameBindings: ['non-primary-block-selected', 'gh-newline', 'gh-card', 'gh-selected'],
    tools: [],
    isLink: Ember.computed({
        get(key) {
            return this._isLink;
        },
        set(key, value) {
            if(value) {
                let $this = this.$();
                $this.toggleClass("gh-newline", false);
                $this.toggleClass("gh-card", false);
                $this.toggleClass("gh-selection", false);
                $this.toggleClass("gh-normal", false);
            }
            this._isLink = value;
            return this._isLink;
        }
    }),
    toolbar: Ember.computed(function () {
        // TODO if a block section other than a primary section is selected then
        // the returned list removes one of the primary sections to compensate,
        // so that there are only ever four primary sections.
        let visibleTools = [ ];


        if(this.__state === 'newline') {
            let postTools = [ ];
            let selectedPostTools = [ ];
            let newlineTools = [ ];
            let selectedNewlineTools = [ ];
            this.tools.forEach(tool => {

                if (tool.type === 'block') {

                    if (tool.visibility === 'primary' && !tool.selected) {
                        selectedPostTools.push(tool);
                    } else if (tool.selected) {
                        selectedPostTools.unshift(tool); // put the selected tool at the front
                    } else {
                        postTools.push(tool);
                    }
                }
                if (tool.type === 'newline') {
                    if (tool.visibility === 'primary') {
                        selectedNewlineTools.push(tool);
                    } else {
                        newlineTools.push(tool);
                    }
                }
            });
            return selectedPostTools.concat(selectedNewlineTools, postTools, newlineTools);

        } else if(this.__state === 'card' ) {
            this.tools.forEach(tool => {
                if (tool.type === 'card') {
                    visibleTools.push(tool);
                }
            });

        } else if(this.__state === 'selection' ) {
            this.tools.forEach(tool => {
                if (tool.type === 'markup') {
                    visibleTools.push(tool);
                }
            });

        } else {
            let postTools = [ ];
            let selectedPostTools = [ ];
            let markTools = [ ];
            let selectedMarkTools = [ ];
            this.tools.forEach(tool => {

                if (tool.type === 'block') {
                    if(tool.selected && tool.visibility !== 'primary') {
                        // we have a one tool difference on the left hand side.
                        this.set('non-primary-block-selected', true);
                    }
                    if (tool.selected || tool.visibility === 'primary') {
                        selectedPostTools.push(tool);
                    } else {
                        postTools.push(tool);
                    }
                }
                if (tool.type === 'markup') {
                    if (tool.selected || tool.visibility === 'primary') {
                        selectedMarkTools.push(tool);
                    } else {
                        markTools.push(tool);
                    }
                }
            });
            return postTools.concat(selectedPostTools, selectedMarkTools, markTools);

        }
        return visibleTools;
    }).property('tools.@each.selected'),
    init() {
        this._super(...arguments);
        let editor = this.editor = this.get('editor');
        this.tools = Tools(editor, this);

        this.iconURL = this.get('assetPath') + '/tools/';
    },
    didRender() {
        let $this = this.$();
        let editor = this.editor;
        let $editor = Ember.$('.gh-editor-container');
        let height = $this.height();


        if(!editor.range || editor.range.head.isBlank) {
            this.$().hide();
        }


        $editor.click( _ => {
            if(this.editor.mobiledoc.sections.length === 0) {
                // hack - fix
                this.propertyWillChange('toolbar');
                this.__state = 'newline';

                $this.stop();
                $this.animate({
                    top: 46,
                    left: 218
                }, 50);

                $this.fadeIn();

                $this.toggleClass("gh-newline", true);
                this.propertyDidChange('toolbar');
            }
        });



        editor.cursorDidChange(() => {
            // if there is no cursor:
            if((!editor.range || editor.range.head.isBlank)) {
                if(!this.get('isLink')) {
                    $this.fadeOut();
                }
                return;
            }
            this.propertyWillChange('toolbar');

                if(!editor.range.isCollapsed) {
                    // if we have a selection, then the toolbar appears just below said selection:

                    let range = window.getSelection().getRangeAt(0); // get the actual range within the DOM.


                    this.__state = 'selection';

                    let position =  range.getBoundingClientRect();


                    let edOffset = $editor.offset();


                    $this.stop();


                    $this.css('top', position.bottom + $editor.scrollTop() - edOffset.top + 20);
                    $this.css('left', position.left + (position.width / 2) + $editor.scrollLeft() - edOffset.left - 30);

                    $this.fadeIn(50);
                    this._visible = true;


                    this.set('isLink', false);



                    this.tools.forEach(tool => {
                        if (tool.hasOwnProperty('checkElements')) {
                            // if its a list we want to know what type
                            let sectionTagName = editor.activeSection._tagName === 'li'
                                ? editor.activeSection.parent._tagName
                                : editor.activeSection._tagName;
                            tool.checkElements(editor.activeMarkups.concat([{tagName: sectionTagName}]));
                        }
                    });

                    $this.toggleClass("gh-newline", false);
                    $this.toggleClass("gh-card", false);
                    $this.toggleClass("gh-selection", true);
                    $this.toggleClass("gh-normal", false);


                } else if(editor.range.head.section.isBlank) {
                    // if we have a new line then the toolbar appears just to the right of the cursor:
                    this.__state = 'newline';
                    this.isBlank = true;
                    if(!editor.range.head.section) alert("NO RENDER NODE");
                    let element = editor.range.head.section.renderNode._element;
                    let offset =  this.$(element).position();
                    let edOffset = $editor.offset();

                    $this.stop();

                    $this.css('top', offset.top + $editor.scrollTop() - edOffset.top - 5);
                    $this.css('left', offset.left + $editor.scrollLeft() + 50);
                    $this.fadeIn();
                    this._visible = true;


                    this.tools.forEach(tool => {
                        if (tool.hasOwnProperty('checkElements')) {
                            let sectionTagName = editor.activeSection._tagName === 'li'
                                ? editor.activeSection.parent._tagName
                                : editor.activeSection._tagName;
                            tool.checkElements([{tagName: sectionTagName}]);
                        }
                    });


                    this.set('isLink', false);
                    $this.toggleClass("gh-newline", true);
                    $this.toggleClass("gh-card", false);
                    $this.toggleClass("gh-selection", false);
                    $this.toggleClass("gh-normal", false);

                } else {
                    if(this._visible) {
                        this.set('isLink', false);
                        $this.stop();
                        $this.fadeOut();
                        this._visible = false;
                    }


                }

            this.propertyDidChange('toolbar');
        });
    },
    linkKeyDown: task(function(event) {
        // if escape close link
        if (event.keyCode === 27) {
            this.set('isLink', false);
        }
    }),
    linkKeyPress: task(function(event) {
        // if enter run link
        if (event.keyCode == 13) {
            this.set('isLink', false);



            this.editor.run(postEditor => {
                let markup = postEditor.builder.createMarkup('a', {href: event.target.value});
                postEditor.addMarkupToRange(this.get('linkRange'), markup);
            });

            this.set('linkRange', null);
            event.stopPropagation();
        }
    }),
    doLink(range) {

        this.set('isLink', true);
        this.set('linkRange', range);
    }
});
