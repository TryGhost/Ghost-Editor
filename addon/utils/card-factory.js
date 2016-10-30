import Ember from 'ember';

// returns a create card factory that takes a generic mobiledoc card and adds a ghost specific wrapper around it.
// it also provides helper functionality for Ember based cards.

export default function createCardFactory(toolbar) {
    let self = this;

    function createCard(card_object) {
        // if we have an array of cards then we convert them one by one.
        if (card_object instanceof Array) {
            return card_object.map(card => createCard(card));
        }

        // an ember card doesn't need a render or edit method
        if (!card_object.name || (!card_object.willRender && card_object.genus !== 'ember')) {
            throw new Error("A card must have a name and willRender method");
        }

        card_object.render = ({env, options, payload: _payload}) => {

            //setupUI({env, options, payload});
            let payload = Ember.copy(_payload);
            payload.card_name = env.name;
            if (card_object.genus === 'ember') {
                let card = setupEmberCard({env, options, payload}, "render");
                let div = document.createElement('div');
                div.id = card.id;
                return div;
            }
            return card_object.willRender({env, options, payload});
        };

        card_object.edit = ({env, options, payload: _payload}) => {

            //setupUI({env, options, payload});
            let payload = Ember.copy(_payload);
            payload.card_name = env.name;
            if (card_object.genus === 'ember') {
                let card = setupEmberCard({env, options, payload}, "edit");
                let div = document.createElement('div');
                div.id = card.id;
                return div;
            }
            if (card_object.hasOwnProperty('willRender')) {
                return card_object.willEdit({env, options, payload, toolbar});
            } else {
                return card_object.willRender({env, options, payload, toolbar});
            }
            //do handle and delete stuff
        };

        card_object.type = 'dom';

        card_object.didPlace = () => {

        };

        function setupEmberCard({env, options, payload}, mode = "render", save) {
            const id = "GHOST_CARD_" + Ember.uuid();
            let card = Ember.Object.create({
                id,
                env,
                options,
                payload,
                card: card_object,
                mode,
                save
            });

            self.emberCards.pushObject(card);

            env.onTeardown(() => {
                self.emberCards.removeObject(card);
            });

            return card;
        }

        function setupUI({env, options, payload}, save) {
            let el = env.postModel.renderNode.element;
            el.draggable = "false";
            el.addEventListener('dragstart', e => {
                e.preventDefault();
                return false;
            });


            let handle = new Handle({env, options, payload});
            if( buttons ) {

                buttons.forEach( item => handle.addButton( item.name , () => { el.removeChild( handle.holder ); item.onclick( ); }) );
            }
            el.insertBefore(handle.holder, el.firstChild);
        }

        return card_object;
        // self.editor.cards.push(card_object);
    }

    // then return the card factory so new cards can be made at runtime
    return createCard;
}


class Handle {
    constructor({env, options, payload}, save) {
        let holder = this.holder = document.createElement('div');

        holder.contentEditable = "false";
        holder.className = "card-handle";

        let dragger = document.createElement('button');
        dragger.value = "Dragger";
        dragger.type = "button";
        dragger.className = 'move';
        dragger.innerHTML = "&nbsp;";
        //dragger.draggable = "true";
       // dragger.addEventListener('dragstart', event => window.dragel = this);
       // dragger.addEventListener('drag', event => console.log("DRAGGING", event));
        holder.appendChild( dragger );

        let delButtion = document.createElement('button');
        delButtion.value = "Del";
        delButtion.type = "button";
        delButtion.innerHTML = "×";

        if (env.strikeOne) {
            delButtion.className = "confirm";
        }
        delButtion.addEventListener("click", e => {
            if (!env.strikeOne) {
                delButtion.className = "confirm";
                env.strikeOne = true;
                setTimeout(() => {
                    delButtion.className = "";
                    delete env.strikeOne;
                }, 3000);
            } else {
                $(env.postModel.renderNode._element).slideUp(env.remove);
            }
        });

        holder.appendChild(delButtion);
    }

    addButton(name, callback) {
        let button = document.createElement('button');

        button.type = "button";
        button.innerHTML = name;
        button.addEventListener("click", callback);

        this.holder.insertBefore(button, this.holder.getElementsByTagName('button')[0]);
    }
}
