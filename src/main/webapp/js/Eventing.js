var SELF_CLOSE_EVENT_NAME 			= "sample.selfClose";
var CMD_WIDGET_TO_CLOSE				= "sample.closeWidget";
var WIDGET_ANNOUNCES_STARTING		= "sample.widgetOpening";

var VERIFY_WIDGET_ALIVE				= "sample.widget.isAlive";
var VERIFY_WIDGET_ALIVE_ACK  		= "sample.widget.isAliveResult";

// This is the file version, dated Aug 27, 2013 that was missing from John's deploy to EC2-DEMO.

//=========================================================================================================
//=========================================================================================================
function catchEvent (senderGuid, event, channel)
{
   console.log (" [ "+ widgetName + " Widget] received ["+ event +" Event] on  ["+ channel +" Channel] from ["+ senderGuid.id + "Widget]" );

   if (event == widgetName ) 
	   closeThisWidget ()
 
}; 

function getMapGuid (widgetArray, windowId)
{
    try{
        var thisWidget = {
                key: windowId
        };
        
        var guid    = null;
        var widgets = widgetArray.rows || widgetArray;
        
        for(var i=0,l=widgets.length; i<l; ++i){
        	if((widgets[i].value.url).indexOf(thisWidget.key) != -1)
        	{
        		guid = widgets[i].path;                  
                break;
            }
        } 
        if ( guid == null )  
        	throw "GUID not Found";
        else 
            return (guid);
    }
    catch(e){
    	alert("getWindowGuid(): Unable to get widget GUID for [" + windowId + "], Exception==>"+ e);
    }                   
};

function registerUnload (eventingWidget){
	var BEFORE_CLOSE_EVT = "beforeclose";

	var controller = this;

	//if the widget state API is available, use it for onClose events
	if(Ozone && Ozone.state && Ozone.state.WidgetState){
		var widgetState = new Ozone.state.WidgetState({
			widgetEventingController: eventingWidget,
			autoInit: true,
			onStateEventReceived: function(sender, msg)
			{
				msg = ($.type(msg)=="string")? $JSON.parse(msg) : msg;
				
				if(msg && msg.eventName == BEFORE_CLOSE_EVT)
				{
					 widgetState.removeStateEventOverrides({
			                events: [BEFORE_CLOSE_EVT],
			                callback: function() 
			                {
			                	scriptScope.selfCloseWidget();
			                }
			         });
				}
			}
		});

		//beforeclose cannot be a listener, must be interceptor or override
		widgetState.addStateEventOverrides({
			events: [BEFORE_CLOSE_EVT]
		});

	//otherwise use window, which was broken in newer Ozone versions
	}
	else
	{
		$(window)
			.unload(function()
			{
				scriptScope.closeThisWidget ( );
			});
	}
}; // registerUnload()

