import Ember from 'ember';
import layout from '../templates/components/ghost-toolbar';

var tools = [ //temp, this will be dynamic...
        {
            name : "p",
            icon : "",
            selected: false,
            onClick : (editor) => {
                editor.run(postEditor => {postEditor.toggleSection('p');});
            },
            checkElements: function(elements) {
                Ember.set(this,"selected",elements.filter(element => element._tagName === 'p').length > 0);
            }
        },
        {
            name : "h2",
            icon : "",
            selected: false,
            onClick : (editor) => {
                editor.run(postEditor => {postEditor.toggleSection('h2');});
            },
            checkElements: function(elements) {
                Ember.set(this,"selected",elements.filter(element => element._tagName === 'h2').length > 0);
            }
        },
        {   
            name : "h3",
            icon : "",
            selected: false,
            onClick : (editor) => {
                editor.run(postEditor => {postEditor.toggleSection('h3');});
            },
            checkElements: function(elements) {
                Ember.set(this,"selected",elements.filter(element => element._tagName === 'h3').length > 0);
            }
        },
        {   
            name : "ul",
            icon : "",
            selected: false,
            onClick : (editor) => {
                editor.run(postEditor => {postEditor.toggleSection('ul');});
            },
            checkElements: function(elements) {
                Ember.set(this,"selected",elements.filter(element => element._tagName === 'ul').length > 0);
            }
        },
        {   
            name : "ol",
            icon : "",
            selected: false,
            onClick : (editor) => {
                editor.run(postEditor => {postEditor.toggleSection('ol');});
            },
            checkElements: function(elements) {
                Ember.set(this,"selected",elements.filter(element => element._tagName === 'ol').length > 0);
            }
        },      
        {
            name : "b",
            icon : "",
            selected: false,
            onClick : (editor) => {
                editor.run(postEditor => {postEditor.toggleMarkup('strong');});
            },
            checkElements: function(elements) {
                Ember.set(this,"selected",elements.filter(element => element.tagName === 'strong').length > 0);
            }
        },
        {
            name : "i",
            icon : "",
            selected: false,
            onClick : (editor) => {
                editor.run(postEditor => {postEditor.toggleMarkup('em');});
            },
            checkElements: function(elements) {
                Ember.set(this,"selected",elements.filter(element => element.tagName === 'em').length > 0);
            }
        },
        {
            name : "cardtest",
            icon : "",
            selected: false,
            onClick : (editor) => {
                editor.post.sections.forEach( item => {
                    Ember.$(item.renderNode._element).hover(el => {
                        alert(el);
                    });
                });
            }
        }
];


export default Ember.Component.extend({
  layout,
  classNames: ['toolbar'],
  tools: [],
  toolbar: Ember.computed(function(){
    return this.tools;
  }).property('tools.@each.selected'),
  init( ) {
    this._super(...arguments);
    let editor = this.editor = this.get('editor');

    this.tools = tools;


    editor.cursorDidChange(() => {
        //if collapsed and the node has changed:
        let element = editor.range.head.section.renderNode._element;
        if(this._element !== element) {
            this.$().css('top', (this.$(element).offset().top + Ember.$('.ghost-editor').scrollTop()-80) + 'px');
            this._element = element;
        }

        this.propertyWillChange('toolbar');
       
        this.tools.forEach(tool => {
            if(tool.hasOwnProperty('checkElements')) {
                
                tool.checkElements(editor.activeMarkups.concat([{tagName : editor.activeSection._tagName}]));
            }
        });

         this.propertyDidChange('toolbar');
       
        
       // editor.activeMarkups[0].tagName
    });
    console.log('editor', this.editor);

  }
});
