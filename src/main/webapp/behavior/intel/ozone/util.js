var Intel = Intel || {};
Intel.ozone = Intel.ozone || {};


/**
 * Intel.ozone.getWidgetEventingController
 *
 * The Ozone eventing controller needs to be supplied a relay html file as
 * a fallback for browsers that don't natively support window message passing.
 * 
 * This fallback relay file needs to be provided relative to the server hostname,
 * including the context path. This Method helps construct an Ozone.eventing.Widget
 * instance that is correctly initialized to the corect fallback path.
 *
 * It utilizes the Ozone eventing APIs so an Ozone.eventing.Widget is required.
 *
 * @returns  A new Ozone.eventing.Widget instance
 * 
 * @example
 * 
 * 	var eventWidget = Intel.ozone.getWidgetEventingController();
 * 
 */
Intel.ozone.getWidgetEventingController = function() {
	var pathParts = /(\/.*)\//.exec(window.location.pathname);
	var contextPath = (pathParts && pathParts.length > 1)?pathParts[1]:"";
	var relativeRelayPath = "/behavior/ozone/js/eventing/rpc_relay.uncompressed.html";
	var fullRelayPath = contextPath + relativeRelayPath;
	return new Ozone.eventing.Widget(fullRelayPath);
};

/**
 * Intel.ozone.getOzoneDomain
 *
 * This method is useful for getting the domain name of the Ozone server
 * that this widget is current hosted within.
 * 
 * It utilizes the Ozone eventing APIs so an Ozone.eventing.Widget instance is required.
 *
 * @params   widget - The eventing widget (Ozone.eventing.Widget).
 * @returns  String
 * 
 * @example
 * 
 * 	var widget = new Ozone.eventing.Widget('/samples/js/eventing/rpc_relay.uncompressed.html')
 *  var ozoneServer = Intel.ozone.getOzoneDomain(widget);
 *
 */
Intel.ozone.getOzoneDomain = function(/* Ozone.eventing.Widget*/ widget) {
	var parentPath = widget.getContainerRelay();
	
	var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

	// parse_url.exec will give us an array with entries of
	// ['url', 'scheme', 'slash', 'host', 'port','path', 'query', 'hash'];
	var result = parse_url.exec(parentPath);
	//build domain from scheme, colon, slash, host 
	var parentDomain = result[1] + ":" + result[2] + result[3];
	//if port present, add colon, port
	if(result[4]){
		parentDomain += ":" + result[4];
	}
	return parentDomain;
};

/**
 * Intel.ozone.initWidgetPrefServer
 *
 * This method will initialize the Ozone.pref.PrefServer for use
 * within an active widget. Without this initialization, the PrefServer
 * will always try to load the preferences from the server hosting the
 * widget.
 * 
 * It utilizes the Ozone eventing APIs so an Ozone.eventing.Widget instance is required.
 *
 * @params  widget - The eventing widget (Ozone.eventing.Widget).
 *
 * @requires Ozone.pref.PrefServer
 * @example
 * 
 * 	var widget = new Ozone.eventing.Widget('/samples/js/eventing/rpc_relay.uncompressed.html')
 *  Intel.ozone.initWidgetPrefServer(widget);
 *  Ozone.pref.PrefServer.getUserPreference("i3.intel.ozone.widgets", "wmsServer",
 *  		function(result){
 *  			alert("Preference Success: "+result.value);
 *  		},
 *  		function(err){
 *  			alert("Preference Error: "+err);
 *  		}
 *  );
 */
Intel.ozone.initWidgetPrefServer = function(widget) {
	var ozoneDomain = Intel.ozone.getOzoneDomain(widget);

	owfdojo.config.dojoBlankHtmlUrl = 'behavior/ozone/js/prefs/blank.html';
	
	//PrefServer is a singleton
	Ozone.pref.PrefServer.setUrl(ozoneDomain + "/owf/prefs");
};
