// currys a createCard method
export default function createCardFactory(editor, toolbar) {
    var toolbar = toolbar;
    var editor = editor;

    function createCard(card_object) {
        // if we have an array of cards then we import them one by one.
        if(card_object instanceof Array) {
            card_object.forEach(card => createCard(card));
            return;
        }

        if(!card_object.name || !card_object.didRender) {
            throw new Error("A card must have a name and didRender method");
        }

        card_object.render = ({env, options, payload}) => {
            card_object.didRender({env, options, payload});
        }

        card_object.edit = ({env,options,payload}) => {
            if(card_object.hasOwnProperty('didEdit')) {
                card_object.didEdit({env,options,payload,toolbar});
            } else {
                card_object.didRender({env,options,payload,toolbar});
            }
            //do handle and delete stuff
        }

        card_object.type = 'dom';

        editor.cards.push(card_object);
    }
    // then return the card factory so new cards can be made at runtime
    return createCard;
}

