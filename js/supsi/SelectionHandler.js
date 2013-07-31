define(function(){
    var Core = {
        selectedRange: null,
        init: function(){
            this.addListeners();
//            setInterval(function(){
//                document.body.style.width = '100%'
//            }, 1000)
        },
        getSelectedRange: function(){
            return this.selectedRange
        },
        onTouchStart: function(){
            this.selectedRange = null;
			checkSelection.call(null, this.selectedRange);
		},
        onSelectionChange: function(){
            // nr 12-07-2013
            // workaround for iOS 6, grrr; otherwise the range will be lost
            window.getSelection().rangeCount && (this.selectedRange = window.getSelection().getRangeAt(0));
			checkSelection.call(null, this.selectedRange);
        },
        addListeners: function(){
            var that = this;
            document.addEventListener('touchstart', function(e){
                that.onTouchStart(e)
            }, false
            );
            document.addEventListener('selectionchange',
                function(e){
                    that.onSelectionChange()
               }, false)
        },
        _touchMoveListener: function(){

        }
    }
    Core.init();
    return Core;
});