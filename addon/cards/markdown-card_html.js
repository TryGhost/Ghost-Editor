/* jshint ignore:start */
// this has to be a node style module as it's imported by the front end and ember.
// a card has to have an editor object, and an HTML object. In the future we might have AMP and Text (for FTS) renderers.

var showdown        = require('showdown'),
    sdGhostExtra    = require('showdown-ghost-extra'),
    footnotes       = require('showdown-ghost-footnotes'),
    highlight       = require('showdown-ghost-highlight'),
    converter        = new showdown.Converter({
        extensions: [sdGhostExtra, footnotes, highlight],
        omitExtraWLInCodeBlocks: true,
        parseImgDimensions: true,
        simplifiedAutoLink: true,
        excludeTrailingPunctuationFromURLs: true,
        literalMidWordUnderscores: true,
        strikethrough: true,
        tables: true,
        tablesHeaderId: true,
        ghCodeBlocks: true,
        tasklists: true,
        smoothLivePreview: true,
        simpleLineBreaks: true,
        requireSpaceBeforeHeadingText: true,
        ghMentions: false,
        encodeEmails: true
    });


module.exports = {
    name: 'markdown-card',
    render: function(opts) {
        return converter.makeHtml(opts.payload.markdown || "");
    }
};

/* jshint ignore:end */
