var tmp = 0;

var PinchLayer = Ext.extend(Ext.Panel, 
{
	//@privat
	initComponent: function() 
	{
		PinchLayer.tags = null;
		PinchLayer.bgcolor = "000000";
		PinchLayer.pinching = false;
		PinchLayer.pinchStart = false;
		PinchLayer.pinch_posX = 0;			//x pos of start pinch
		PinchLayer.pinch_posY = 0;			//y pos of start pinch
		PinchLayer.pinch_counter = 0;		//incr and decr on pinching
		PinchLayer.pinch_level = 0;			//current pinch level (level 0 displays mother tags)
		PinchLayer.pinch_value = 0;			//pinch value calculated with pinch_counter and customized exp function
		PinchLayer.level_zoom_ratio = 0;	//zoom ratio of current layer
		PinchLayer.pinch_enabled = true;
		
		var config = 
		{
			id: "pinchLayer",
			cls: "pinchLayer_disabled",
			debugCLS: "pinchLayer",
			draggable: false
		};
		
		Ext.apply(this, config, this.initialConfig);
		PinchLayer.superclass.initComponent.call(this);
	},
	
	reset: function()
	{
		PinchLayer.pinch_posX = 0;		
		PinchLayer.pinch_posY = 0;			
		PinchLayer.pinch_counter = 0;	
		PinchLayer.pinch_level = 0;		
		PinchLayer.pinch_value = 0;			
		PinchLayer.level_zoom_ratio = 0;	
		PinchLayer.tags.updateTags(PinchLayer.level_zoom_ratio, PinchLayer.pinch_level);
	},
	
    setParent: function(par)
    {
    	PinchLayer.tags = par;
    },
    	
	// @private
	onRender : function(arguments) 
	{
		PinchLayer.superclass.onRender.call(this, arguments);
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
			PinchLayer.tags.onDragStart();
		}
		
		/*
		PinchLayer.level_zoom_ratio += 0.1;
		PinchLayer.tags.updateTags(PinchLayer.level_zoom_ratio, PinchLayer.pinch_level);
		console.log("items:" + Ext.ComponentMgr.getCount());
		console.log("get:" + Ext.get("tag_1").id + ", " + Ext.get("tag_1").width);
		console.log("domget: " + Ext.getDom("tag_1").id + ", " + Ext.getDom("tag_1").width);
		*/
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
				PinchLayer.tags.setPos(e.deltaX, e.deltaY);
		}
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
		
	initTags: function()
	{
		PinchLayer.tags.updateTags(PinchLayer.level_zoom_ratio, PinchLayer.pinch_level);
	},
	
	getZoomFactor: function()
	{
		return PinchLayer.zoom/PINCH_MIN;
	},

	getPinchPosX:  function() {	return PinchLayer.pinch_posX;	},	
	getPinchPosY:  function() {	return PinchLayer.pinch_posY;	},
	getZoomLevel:  function() { return PinchLayer.pinch_level;  },
	getZoomRatio:  function() { return PinchLayer.level_zoom_ratio; },
	
	/**
	 * On pinch destroy the object
	 *bla
	 * @param {} e
	 * @param {} el
	 * @param {} obj
	 */
	
	enablePinchLayer: function(value)
	{
		PinchLayer.pinch_enabled = value;

		var div = Ext.getDom(this.id);
		
		if(PinchLayer.pinch_enabled)
			div.className = "pinchLayer_enabled";
		else
			div.className = "pinchLayer_disabled";
		
		this.doLayout();
	},
	
	
	onPinchStart: function(e,el,obj)
	{
		PinchLayer.pinchStart = true;
		PinchLayer.pinching = true;
	},

	
	onPinch: function(e, el, obj) 
	{
		if(PinchLayer.pinching)
		{
			if(e.deltaScale > 0)
			{
				PinchLayer.pinch_counter += PINCH_STEP;
				PinchLayer.pinch_counter = Math.min(PINCH_MAX, PinchLayer.pinch_counter); 
		    }
			else
			{
				PinchLayer.pinch_counter -= PINCH_STEP;
				PinchLayer.pinch_counter = Math.max(PINCH_MIN, PinchLayer.pinch_counter); 
		    }
			
			//calculate current pinch level
		 	PinchLayer.pinch_level = Math.floor(PinchLayer.pinch_counter/PINCH_LEVEL_RANGE);
					
		 	//calculate pinch value
			PinchLayer.pinch_value = PinchLayer.pinch_counter;//calcStep(PinchLayer.pinch_counter, PinchLayer.pinch_level);
	
			//calculate actual zoom ratio from current level
			if(PinchLayer.pinch_level > 0)
			{
				PinchLayer.level_zoom_ratio = ( PinchLayer.pinch_value % (PINCH_LEVEL_RANGE * PinchLayer.pinch_level) ) / PINCH_LEVEL_RANGE;
			}
			else
			{
				PinchLayer.level_zoom_ratio = PinchLayer.pinch_value / PINCH_LEVEL_RANGE;
			}
			
			//get pinch start position -> middle between two fingers
		 	if(PinchLayer.pinchStart)
			{
				PinchLayer.pinch_posX = e.midPointX;
				PinchLayer.pinch_posY = e.midPointY;
				PinchLayer.tags.onPinchStart(e.midPointX, e.midPointY);
				PinchLayer.pinchStart = false;
			}
		 	
			
			var zoom = PinchLayer.pinch_value/PINCH_MIN;
		 	var c = calcColor(PinchLayer.pinch_value, PINCH_MAX);
		 	
		 	//PinchLayer.tagPanel.updateTags(PinchLayer.zoom, PinchLayer.level, zoom, c);
		 	PinchLayer.tags.updateTags(PinchLayer.level_zoom_ratio, PinchLayer.pinch_level);
		 	
		 	if(DEBUG_PINCH)
		 		this.update("<div id=\"tagContainer\" class=\"test\" style=\"background-color: #"+c+"; opacity: 1;\">" +
		 					"pinch_counter: " + PinchLayer.pinch_counter + 
		 					" | pinch_value " + PinchLayer.pinch_value + 
		 					" | pinch_level " + PinchLayer.pinch_level +
		 					" | level_ratio " + PinchLayer.level_zoom_ratio + 
		 					"</div>");
		}
	},
	
	onPinchEnd: function(e, el, obj)
	{
		PinchLayer.pinchStart = true;
		PinchLayer.pinching = false;
		//PinchLayer.tags.updateTagsLayout();
	}
});

Ext.reg('PinchLayer', PinchLayer);

function calcColor(current, max)
{
   var per = 1 - current / max;
   
   var g = Math.max(0, Math.floor( PINCH_START_COLOR[1] * per ) );
   var b = Math.max(0, Math.floor( PINCH_START_COLOR[2] * per ) );
   
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

function calcStepSize(l)
{
	var y = PINCH_STEP;// * l;
	
	//var y = PINCH_STEP + Math.floor(x/200 + Math.exp(x/200)); 
	//console.log("x=" + x + " -> y: " + y);
	
	return y;
}
