let placeholder = {
    name: "placeholder",
    label: "placeholder",
    didRender({env, options, payload}) {
        let img = document.createElement('img');
        img.src = "http://Chartholdr.io/line/400/400";
        return img;
    },
    didEdit({env, options, payload, toolbar}) {
        let img = document.createElement('img');
        img.src = "http://Chartholdr.io/line/400/400";
        return img;
    }
}

export default placeholder;
