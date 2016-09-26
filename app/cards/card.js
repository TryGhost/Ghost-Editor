// Cards are seperate from Ember because they need to be able to 
// interact with the frontend as well as the backend.


function Card(
    name,
    readableName,
    previewImage,
    allowedStates,    // can be [content_width, floating, or full_width].
    border,               // the border style for the editor, can be fixed or none.
    isEditing,                              // contains env, options, payload, toolbar
    isRendering                             // contains env, options, payload
) {
    var card = {
        name,
        readableName,
        previewImage,
        allowedStates,
        border
    };
    card.edit = ((toolbar) => { })(toolbar);
    card.render = isRendering
}

// A card object is just an extension of the mobile-doc card object,
// it contains the following:
// {
//  name,
//  readableName,
//  allowedState,
//  border,
//  edit(env, options, payload, toolbar),
//  render(env, options, payload)
// }

createCard(card_object) {

}

createCardFactory(toolbar) {
    var toolbar = toolbar;
    return function createCard(card_object) {
        
    }
}