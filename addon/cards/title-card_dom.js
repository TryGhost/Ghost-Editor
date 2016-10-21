export default {
    name: 'title-card',
    label: 'Title Card',
    icon: '',
    willRender: function({env, options, payload}) {

        env.postModel.renderNode.element.firstChild.textContent="";
        env.postModel.renderNode.element.children[0].contentEditable=true;
        let input = document.createElement('h1');
        return input;
    }
};
