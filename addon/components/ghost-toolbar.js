import Ember from 'ember';
import layout from '../templates/components/ghost-toolbar';

import Tools from '../utils/default-tools';

export default Ember.Component.extend({
    layout,
    classNames: ['toolbar'],
    classNameBindings: ['non-primary-block-selected', 'gh-newline', 'gh-card', 'gh-selected'],
    tools: [],
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
        this.tools = Tools(editor);

        this.iconURL = this.get('assetPath') + '/tools/';
    },
    didRender() {
        let $this = this.$();
        let editor = this.editor;
        let $editor = Ember.$('.ghost-editor');
        let height = $this.height();


        if(!editor.range || editor.range.head.isBlank) {
            this.$().hide();
        }


        $editor.click( _ => {
            if(this.editor.mobiledoc.sections.length === 0) {
                // hack - fix
                this.propertyWillChange('toolbar');
                this.__state = 'newline';

               // let element = editor.range.head.section.renderNode._element;
               // let offset =  this.$(element).position();
                let $editor = Ember.$('.ghost-editor');
                $this.stop();
                $this.animate({
                    top: 46,
                    left: 218
                }, 50);

                $this.fadeIn();
               // this._element = element;
                //  }

                $this.toggleClass("gh-newline", true);
                this.propertyDidChange('toolbar');
            }
        });



        editor.cursorDidChange(() => {
            // if there is no cursor:
            if(!editor.range || editor.range.head.isBlank) {
                $this.fadeOut();
                return;
            }
            this.propertyWillChange('toolbar');

                if(editor.range.head.section.renderNode.element !== editor.range.tail.section.renderNode.element
                    || editor.range.head.offset !== editor.range.tail.offset) {
                    // if we have a selection, then the toolbar appears just above said selection:

                    let range = window.getSelection().getRangeAt(0); // get the actual range within the DOM.


                    this.__state = 'selection';
                    let element = editor.range.head.section.renderNode._element;
                    let position =  range.getBoundingClientRect();


                    let edOffset = $editor.offset();

                    let width = this.$().width();

                    $this.stop();
                    $this.animate({
                        top: position.bottom + $editor.scrollTop() - edOffset.top + 20,
                        left: position.left + (position.width / 2) + $editor.scrollLeft() - edOffset.left - 30
                    }, 50);

                    $this.fadeIn();
                    this._element = element;



                    $this.toggleClass("gh-newline", false);
                    $this.toggleClass("gh-card", false);
                    $this.toggleClass("gh-selection", true);
                    $this.toggleClass("gh-normal", false);


                } else if(editor.range.head.section.renderNode.element === editor.range.tail.section.renderNode.element
                    && editor.range.head.section.isCardSection) {
                    // if we have a card selected, then the toolbar appears just below the card:
                    this.__state = 'card';

                    let element = editor.range.head.section.renderNode._element;
                    let offset =  this.$(element).position();
                   // if (this._element !== element) {
                        let $editor = Ember.$('.ghost-editor');
                        $this.stop();
                        $this.animate({
                            top: offset.top + $editor.scrollTop() + Ember.$(element).find('.__mobiledoc-card').outerHeight(),
                            left: offset.left + $editor.scrollLeft()
                        }, 50);

                        $this.fadeIn();
                        this._element = element;
                   // }

                    $this.toggleClass("gh-newline", false);
                    $this.toggleClass("gh-card", true);
                    $this.toggleClass("gh-selection", false);
                    $this.toggleClass("gh-normal", false);


                } else if(editor.range.head.section.isBlank &&
                    editor.range.head.section.renderNode.element === editor.range.tail.section.renderNode.element) {
                    // if we have a new line then the toolbar appears just to the right of the cursor:
                    this.__state = 'newline';

                    let element = editor.range.head.section.renderNode._element;
                    let offset =  this.$(element).position();
                   // if (this._element !== element) {
                        let $editor = Ember.$('.ghost-editor');
                        $this.stop();
                        $this.animate({
                            top: offset.top + $editor.scrollTop() - 5,
                            left: offset.left + $editor.scrollLeft() + 20
                        }, 50);

                        $this.fadeIn();
                        this._element = element;
                  //  }

                    $this.toggleClass("gh-newline", true);
                    $this.toggleClass("gh-card", false);
                    $this.toggleClass("gh-selection", false);
                    $this.toggleClass("gh-normal", false);

                } else {
                    // if we are editing, then the toolbar is in the top left hand corner:
                    
                    let element = editor.range.head.section.renderNode._element;
                    let offset =  this.$(element).position();
                    let height = this.$(element).height();
                    if (this._element !== element || this.__state !== 'normal' || this.__height !== height) {
                        let $editor = Ember.$('.ghost-editor');
                        $this.stop();
                        $this.animate({
                            top: offset.top + $editor.scrollTop() + Ember.$(element).outerHeight(),
                            left: offset.left + $editor.scrollLeft()
                        }, 50);

                        $this.fadeIn();
                        this._element = element;
                        this.__state = 'normal';
                        this.__height = height;
                        $this.toggleClass("gh-newline", false);
                        $this.toggleClass("gh-card", false);
                        $this.toggleClass("gh-selection", false);
                        $this.toggleClass("gh-normal", true);
                    }



                }

               //o0 console.log("toolbar state", this.__state);


            this.isBlank = editor.range.head.section.isBlank && editor.range.head.isTail();

            this.tools.forEach(tool => {
                if (tool.hasOwnProperty('checkElements')) {
                    // if its a list we want to know what type
                    let sectionTagName = editor.activeSection._tagName === 'li'
                        ? editor.activeSection.parent._tagName
                        : editor.activeSection._tagName;
                    tool.checkElements(editor.activeMarkups.concat([{tagName: sectionTagName}]));
                }
            });

            this.propertyDidChange('toolbar');
        });
    }
});
