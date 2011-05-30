var PinchLayer = Ext.extend(Ext.Container, 
{
	// @privat
	initComponent: function() 
	{
		PinchLayer.min = 30;
		PinchLayer.max = 2000;
		PinchLayer.step = 5;
		PinchLayer.current = 10;
		PinchLayer.alpha = 1;
		PinchLayer.level = 0;
		PinchLayer.tagPanel = null;
		PinchLayer.bgcolor = "000000";
		PinchLayer.startcolor = new Array(0, 174, 255);
				
		var config = 
		{
			html: "pinchLayer",
			cls: "pinchLayer",
			draggable: false
		};
		
		Ext.apply(this, config, this.initialConfig);
		PinchLayer.superclass.initComponent.call(this);
	},


	myFunction: function()
	{
		
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
				pinchend: this.onPinchEnd
			}
		);
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
				pinchend: this.onPinchEnd,
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
				pinchend: this.onPinchEnd,
				scope: this
			}
		);
	},

	/**
	 * On pinch destroy the object
	 *
	 * @param {} e
	 * @param {} el
	 * @param {} obj
	 */
	onPinch: function(e, el, obj) 
	{
		if(e.deltaScale > 0)
		{
			PinchLayer.current += PinchLayer.step;
			PinchLayer.current = Math.min(PinchLayer.max, PinchLayer.current);    
	    }
		else
		{
			PinchLayer.current -= PinchLayer.step;
			PinchLayer.current = Math.max(PinchLayer.min, PinchLayer.current);
	    }
		
	 	PinchLayer.level = Math.floor(PinchLayer.current/200);
		
		//console.log("pinchlevel: " + PinchLayer.level + " pinchSize: " + PinchLayer.current);
	 	
	 	PinchLayer.tagPanel.updateTags(PinchLayer.current, PinchLayer.level, calcColor(PinchLayer.current, PinchLayer.max));
	},
	
	onPinchEnd: function(e, el, obj)
	{
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
