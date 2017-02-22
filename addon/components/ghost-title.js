import Ember from 'ember';
import Mobiledoc from 'mobiledoc-kit';
import layout from '../templates/components/ghost-title';


export default Ember.Component.extend({
  layout,
    classNames: ['title'],
    // init() {
    //
    // },
    // willRender() {
    //     if(this._rendered) {
    //         return;
    //     }
    //
    // },
    didRender() {
        if(this._rendered) {
            return;
        }

        let $this = this.$('h2');
        $this[0].onkeyup = event => {
            if($this[0].textContent != '') {
                $this.removeClass('no-content');
            } else {
                $this.addClass('no-content');
            }

            // sanity check
            // if($this[0].innerHTML !== $this[0].textContent) {
            //     console.log('Title content does not match!');
            //     console.log($this[0].innerHTML, $this[0].textContent)
            //     $this[0].innerHTML = $this[0].textContent;
            //
            //     // todo: retain the range position.
            // }


        };

        $this[0].onkeydown = event => {

            if(event.ctrlKey || event.metaKey){
                switch(event.keyCode) {
                    case 66: // B
                    case 98: // b
                    case 73: // I
                    case 105: // i
                    case 85: // U
                    case 117: // u
                        return false;
                }
            }
            if(event.keyCode === 13) {
                //enter
                return false;
            }


            // down key
            // if we're within ten pixels of the bottom of this element then we try and figure out where to position
            // the cursor in the editor.
            if(event.keyCode === 40) {
                let range = window.getSelection().getRangeAt(0); // get the actual range within the DOM.
                let cursorPositionOnScreen =  range.getBoundingClientRect();
                let offset = $this.offset();
                let bottomOfHeading =  offset.top + $this.height();
                if(cursorPositionOnScreen.bottom > bottomOfHeading - 33) {
                    let editor = this.get('editor');
                    let loc = editor.element.getBoundingClientRect();

                    let cursorPositionInEditor = editor.positionAtPoint(cursorPositionOnScreen.left, loc.top);

                    if(cursorPositionInEditor.isBlank) {
                        editor.element.focus();
                    } else {
                        editor.selectRange(cursorPositionInEditor.toRange());
                    }

                    return false;
                }

            }

            $this.removeClass('no-content');
        };

        this._rendered = true;

    }
});


function resetRange(newRange) {
    // console.log(newRange);
    // window.setTimeout(() => {
    //     let range = document.createRange();
    //     range.setStart(newRange.startContainer, newRange.startOffset);
    //     range.setEnd(newRange.endContainer, newRange.endOffset);
    //
    //     var selection = window.getSelection();
    //     selection.removeAllRanges();
    //     selection.addRange(range);
    // }, 1000);
}
