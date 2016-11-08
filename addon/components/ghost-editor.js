import Ember from 'ember';
import layout from '../templates/components/ghost-editor';
import Mobiledoc from 'mobiledoc-kit';
import {MOBILEDOC_VERSION} from 'mobiledoc-kit/renderers/mobiledoc';
import {replaceWithListSection, replaceWithHeaderSection} from 'mobiledoc-kit/editor/text-input-handlers';
import createCardFactory from '../helpers/card-factory';
import editorCards  from '../cards/index';



export const BLANK_DOC = {
    version: MOBILEDOC_VERSION,
    atoms: [],
    markups: [],
    cards: [],
    sections: []
};

export default Ember.Component.extend({
    layout,
    classNames: ['editor-holder'],
    emberCards: Ember.A([]),
    init() {
        this._super(...arguments);
    },
    Mobiledoc,
    MOBILEDOC_VERSION,
    replaceWithListSection,
    replaceWithHeaderSection,
    createCardFactory,
    editorCards
});
