;(function(){
	var docFrag = document.createDocumentFragment();

	Ext.define('Supsi.Utils', {
		isDebug: true,
		singleton : true,

		constructor: function(config) {
			this.initConfig(config);
			return this;
		},

		config : {},
		log: function(){
			this.isDebug && console.log.apply(console, arguments);
		},
		unwrap: function(node){
			for(var i = 0, l = docFrag.childNodes.length; i < l; i++){
				docFrag.removeChild(docFrag.childNodes[i]);
			}
			for(i = 0, l = node.childNodes.length; i < l; i++){
				docFrag.appendChild(node.childNodes[i]);
			}
			node.parentNode.replaceChild(docFrag, node);
		}
	});
})();
