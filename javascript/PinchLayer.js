var ENABLE_DRAG = false;
var PINCH_STEP = 10;
var PINCH_MIN = 30;
var PINCH_MAX = 2000;

var PinchLayer = Ext.extend(Ext.Container, 
{
	// @privat
	initComponent: function() 
	{
		PinchLayer.current = 10;
		PinchLayer.alpha = 1;
		PinchLayer.level = 0;
		PinchLayer.tagPanel = null;
		PinchLayer.bgcolor = "000000";
		PinchLayer.startcolor = new Array(0, 174, 255);
		PinchLayer.pinchPos = new Array(0,0);
		PinchLayer.pinchStart = false;
		PinchLayer.pinching = false;
		PinchLayer.zoomStep = 0;
						
		var config = 
		{
			cls: "pinchLayer",
			draggable: false
		};
		
		Ext.apply(this, config, this.initialConfig);
		PinchLayer.superclass.initComponent.call(this);
	},
	
    setParent: function(par)
    {
    	PinchLayer.tagPanel = par;
    },
    	
	// @private
	onRender : function(ct, position) 
	{
		PinchLayer.superclass.onRender.call(this, ct, position);
		// add event listener
		this.mon
		(
			this.el,
			{
				pinch: this.onPinch,
				pinchstart: this.onPinchStart,
				pinchend: this.onPinchEnd,
				touchstart: this.onTouchStart,
				touchend: this.onTouchEnd,
				touchmove: this.onTouchMove
			}
		);
	},
	
	onTouchStart: function(e,el,obj)
	{
		if(ENABLE_DRAG)
		{
			//console.log("touchmove: " + e.deltaX + ", " + e.deltaY);
			PinchLayer.tagPanel.onDragStart();
		}
	},
	
	onTouchEnd: function(e,el,obj)
	{
		if(ENABLE_DRAG)
		{
			
		}
	},
	
	onTouchMove: function(e,el,obj)
	{
		if(ENABLE_DRAG)
		{
			if(!PinchLayer.pinching)
				PinchLayer.tagPanel.setPos(e.deltaX, e.deltaY);
		}
	},
	
	onPinchStart: function(e,el,obj)
	{
		PinchLayer.pinchStart = true;
		PinchLayer.pinching = true;
	},

	// @privat
	afterRender: function() 
	{
		PinchLayer.superclass.afterRender.call(this);
	},


	/**
	 * Adds the touch event listener
	 */
	addTouchEvents: function() 
	{
		this.mon
		(
			this.el,
			{
				pinch: this.onPinch,
				pinchstart: this.onPinchStart,
				pinchend: this.onPinchEnd,
				touchstart: this.onTouchStart,
				touchend: this.onTouchEnd,
				touchmove: this.onTouchMove,
				scope: this
			}
		);
	},

	/**
	 * remove the touch event listener
	 */
	removeTouchEvents: function() 
	{
		this.mun
		(
			this.el,
			{
				pinch: this.onPinch,
				pinchstart: this.onPinchStart,
				pinchend: this.onPinchEnd,
				touchstart: this.onTouchStart,
				touchend: this.onTouchEnd,
				touchmove: this.onTouchMove,
				scope: this
			}
		);
	},
	
	
	getZoomFactor: function()
	{
		return PinchLayer.current/PINCH_MIN;
	},

	/**
	 * On pinch destroy the object
	 *bla
	 * @param {} e
	 * @param {} el
	 * @param {} obj
	 */
	onPinch: function(e, el, obj) 
	{
		if(e.deltaScale > 0)
		{
			PinchLayer.current += PINCH_STEP;
			PinchLayer.current = Math.min(PINCH_MAX, PinchLayer.current);    
	    }
		else
		{
			PinchLayer.current -= PINCH_STEP;
			PinchLayer.current = Math.max(PINCH_MIN, PinchLayer.current);
	    }
		
		
	 	PinchLayer.level = Math.floor(PinchLayer.current/200);
		
		//console.log("pinchlevel: " + PinchLayer.level + " pinchSize: " + PinchLayer.current);
	 	
	 	if(PinchLayer.pinchStart)
		{
			PinchLayer.pinchPos[0] = e.midPointX;
			PinchLayer.pinchPos[1] = e.midPointY;
			PinchLayer.tagPanel.onPinchStart(e.midPointX, e.midPointY);
			PinchLayer.pinchStart = false;
			//pstart = true;
			//console.log("pinchLayer -> pinchStart: " + e.midPointX + ", " + e.midPointY);
		}
	 	
		
		var zoom = PinchLayer.current/PINCH_MIN;
	 	var c = calcColor(PinchLayer.current, PINCH_MAX);
	 	
	 	PinchLayer.tagPanel.updateTags(PinchLayer.current, PinchLayer.level, zoom, c);
	 	
		this.update("<div id=\"tagContainer\" class=\"test\" style=\"background-color: #"+c+";\">zoomstep: "+ PinchLayer.current +"/"+PINCH_MAX+" | pinchPos: (" +PinchLayer.pinchPos[0]+ ","+PinchLayer.pinchPos[1]+ ") | zoom: "+zoom+ "</div>");
	},
	
	onPinchEnd: function(e, el, obj)
	{
		PinchLayer.pinchStart = true;
		PinchLayer.pinching = false;
		PinchLayer.tagPanel.updateTagsLayout();
	}
});


function calcColor(current, max)
{
   var per = 1 - current*10 / max;
   
   var g = Math.max(0, Math.floor( PinchLayer.startcolor[1] * per ) );
   var b = Math.max(0, Math.floor( PinchLayer.startcolor[2] * per ) );
   
   var color = this.RGBtoHex(0, g, b);
   
   return color;
}
 
function RGBtoHex(r,g,b)
{
	return toHex(r)+ toHex(g)+ toHex(b);
}

function toHex(N) 
{
	if (N==null) return "00";
	N=parseInt(N); if (N==0 || isNaN(N)) return "00";
	N=Math.max(0,N); N=Math.min(N,255); N=Math.round(N);
	return "0123456789ABCDEF".charAt((N-N%16)/16) + "0123456789ABCDEF".charAt(N%16);
}
