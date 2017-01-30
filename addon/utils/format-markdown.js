/* global showdown, html_sanitize*/
import {helper} from 'ember-helper';
import {htmlSafe} from 'ember-string';
import cajaSanitizers from './caja-sanitizers';

let sdConverter = new showdown.Converter({
    extensions: ['ghostimagepreview', 'showdown-ghost-extra', 'footnotes', 'highlight'],
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

export function formatMarkdown(params) {
    if (!params || !params.length) {
        return;
    }

    let markdown = params[0] || '';
    let escapedhtml = '';

    // convert markdown to HTML
    escapedhtml = sdConverter.makeHtml(markdown);

    // replace script and iFrame
    escapedhtml = escapedhtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        '<pre class="js-embed-placeholder">Embedded JavaScript</pre>');
    escapedhtml = escapedhtml.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
        '<pre class="iframe-embed-placeholder">Embedded iFrame</pre>');

    // sanitize html
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    escapedhtml = html_sanitize(escapedhtml, cajaSanitizers.url, cajaSanitizers.id);
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

    return htmlSafe(escapedhtml);
}

export default helper(formatMarkdown);
