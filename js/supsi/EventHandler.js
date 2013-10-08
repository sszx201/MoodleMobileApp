define([localStorage['filesystemOrigin'] + 'js/supsi/ConstantsOrig.js'], function(Constants){
    var Core = {
        init: function(){
            this.addListeners();
//            setInterval(function(){
//                document.body.style.width = '100%'
//            }, 1000)
        },
        onTouchStart: function(e){
            var target = e.target;
            if(target.hasAttribute(Constants.SCORM_ANNOTATION_ATTRIBUTE)){
				showNoteView(target)
            }
            if(target.hasAttribute(Constants.SCORM_HIGHLIGHT_ATTRIBUTE)){
				onSelectedHighlight(target)
            }
			// todo: implementare tap a tempo perso
			if(typeof jQuery === 'undefined'){
				return;
			}
			jQuery('body').on('touchend', 'img', this.zoomHandler);
        },
		touchstartHandler: function(evt){
		},
		zoomHandler: function(evt){
			var target = evt.target;
			if(target.id && target.id === 'fancybox-img'){
				// plugin pessimo, usa id
				// la vecchia versione dello scorm modificato lo usava, l'ho incluso per questo motivo
				return;
			}
			jQuery.fancybox({
				'padding'		: 0,
				'href'			: target.getAttribute('src')
//					'transitionIn'	: 'elastic',
//					'transitionOut'	: 'elastic'
			});
		},
        addListeners: function(){
            var that = this;
            document.addEventListener('touchstart', function(e){
//            document.addEventListener('click', function(e){
                that.onTouchStart(e);
            }, false);
            document.addEventListener('touchmove', function(e){
				if(e.target.id && (e.target.id === 'fancybox-overlay' || e.target.id === 'fancybox-img')){
					e.preventDefault();
					e.stopPropagation();
					return;
				}

			}, false)

        },
        _touchMoveListener: function(){

        }
    }
    Core.init();
    return Core;
});
