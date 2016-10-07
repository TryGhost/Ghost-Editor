// Dynamically require all files in the dir.
var fs      = require('fs'),
    path    = require('path');

var htmlCards = [],
    editorCards = [],
    ampCards = [],
    textCards = [],
    cards = [];

fs.readdirSync(__dirname).forEach(card => {
    if(card !== 'index.js' ) {
        var _card = require(path.resolve(__dirname, card));

        if(!_card.hasOwnProperty('editor') || !_card.hasOwnProperty('html') ||
            !_card.editor.hasOwnProperty('name') || !_card.html.hasOwnProperty('name')) {
            throw new Error('Card ' + _card + " is incorrectly configured, a card must have both an editor and html part and those parts must have names.");
        }
        _card.editor.type = 'dom';
        _card.html.type = 'html';

        editorCards.push(_card.editor);

        htmlCards.push(_card.html);

        if(_card.hasOwnProperty('amp')) {
            ampCards.push(_card.amp);
        }
        if(_card.hasOwnProperty('text')) {
            textCards.push(_card.text);
        }

        cards.push(_card);
    }
 });


module.exports = {
    editor: editorCards,
    html: htmlCards,
    amp: ampCards,
    text: textCards,
    all: cards
}


