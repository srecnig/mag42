//debug panel
var DebugPanel = Ext.extend(Ext.Panel, 
{
	// @privat
	initComponent: function() 
	{
		DebugPanel.debugItems = new Array();
		
		var config = 
		{
			id: 'DebugPanel',
			style: "background-color:#000000; color:#ffffff; z-index:1002",
        	width:"300",
        	dock: "right"
		};
		
		Ext.apply(this, config);
		DebugPanel.superclass.initComponent.call(this);
	},
	
	addDebugItem: function(item)
	{
		DebugPanel.debugItems.push(item);
	},
	
	updateDebugItems: function()
	{
		var debug = "";
		
		for(var i=0; i<DebugPanel.debugItems.length; i++)
		{
			var item = DebugPanel.debugItems[i];
			var tmp = "";
			
			if(item.debugCLS == "tag")
			{
				tmp = '<div class="debugItem_tag" >'+
							'name: <b>' + item.name + '</b> <br/>'+
							'init: ' + item.initX + ', ' + item.initY + ' <br/>'+
							'pos: ' + item.x + ',' + item.y + ' <br/>'+
							'dim: ' + item.getWidth() + ', ' + item.getHeight() + '<br/>' + 
							'dis: ' + item.dis + '</div>';
			}
			
			if(item.debugCLS == "pinchLayer")
			{
				tmp = '<div class="debugItem_pinchLayer" >'+
							'name: <b>' + item.id + '</b> <br/>'+
							'startPos: ' + item.getPinchPosX() + ', ' + item.getPinchPosY() + ' <br/>'+
							'level: ' 	 + item.getZoomLevel() + ' <br/>'+
							'ratio: ' 	 + item.getZoomRatio() + ' <br/>'+
					  '</div>';
			}
					
			debug += tmp;
		}
		
		this.update(debug);
	}
});

Ext.reg('DebugPanel', DebugPanel);
