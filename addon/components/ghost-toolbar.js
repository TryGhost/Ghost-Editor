import Ember from 'ember';
import layout from '../templates/components/ghost-toolbar';

export default Ember.Component.extend({
  layout,
  classNames: ['toolbar'],
  toolbar: Ember.computed(function(){
    return [
        {
            name : "h2",
            icon : "",
            onClick : (editor) => {
                editor.run(postEditor => {postEditor.toggleSection('h2');});
            }
        },
        {   
            name : "h3",
            icon : "",
            onClick : (editor) => {
                editor.run(postEditor => {postEditor.toggleSection('h3');});
            }
        },
        {   
            name : "ul",
            icon : "",
            onClick : (editor) => {
                editor.run(postEditor => {postEditor.toggleSection('ul');});
            }
        },
        {   
            name : "ol",
            icon : "",
            onClick : (editor) => {
                editor.run(postEditor => {postEditor.toggleSection('ol');});
            }
        },      
        {
            name : "b",
            icon : "",
            onClick : (editor) => {
                editor.run(postEditor => {postEditor.toggleMarkup('strong');});
            }
        },
        {
            name : "i",
            icon : "",
            onClick : (editor) => {
                editor.run(postEditor => {postEditor.toggleMarkup('em');});
            }
        }
    ];
  })
});
