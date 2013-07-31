;(function(){
	var docFrag = document.createDocumentFragment();

	Ext.define('Supsi.Utils', {
		singleton : true,

		constructor: function(config) {
			this.initConfig(config);
			return this;
		},

		config : {},

		unwrap: function(node){
			for(var i = 0, l = docFrag.childNodes.length; i < l; i++){
				docFrag.removeChild(docFrag.childNodes[i])
			}
			for(i = 0, l = node.childNodes.length; i < l; i++){
				docFrag.appendChild(node.childNodes[i]);
			}
			node.parentNode.replaceChild(docFrag, node);
		}
	});
})();
