/**
 * 
 */

Ext.setup
({
    tabletStartupScreen: 'gfx/tablet_startup.png',
    icon: 'gfx/icon.png',
    glossOnIcon: true,
    fullscreen:true,
    
    onReady: function()
    {
    	var pinchFactor = 10;
    	var pinchPrevious = 0;
    	var pinchStart = 0;
    	
    	var debug, test, vieport, pinchPanel;
  
    	var min = 5;
    	var max = 1000;
    	var step = 10;
    	var current = 100;
        var alpha = 1;
    	
    	debug = new Ext.Panel
    	({
    		html: "mag 42"
    	});
    	
        test = new Ext.Panel
        ({
        	width: current,
        	height: current,
        	style: "background-color: #ff0000;"        
        });
         
        viewport = new Ext.Panel
        ({
        	fullscreen:true,
        	layout:{type:'auto'},
        	listeners:
        	{
        		el:
        		{
        			tap: 		function() { console.log('tapped on viewport'); },
			        pinch:  	function(e, el, obj) 
			        			{
						        	if(e.deltaScale > 0)
						        	{
						                current += step;
						                current = Math.min(max, current);    
						            }
						        	else
						        	{
						        		current -= step;
						                current = Math.max(min, current);
						            }
			        				
						        	alpha = 1 - current/max; 
						        	
			        				test.setHeight(current);
			        				test.setWidth(current);
			        			
			        				debug.update("pinchFactor:  " + pinchFactor + "<br/>" + 
			        							"scale: " + e.scale + "<br/>");
			        				
			        				this.update("<div style=\"width:" + current + "px; height:" + current + "px; background-color:#003366; opacity:"+ alpha +"\"></div>");
			           			}, 
			        pinchstart: function() { console.log('pinchStart on viewport -> ' + pinchFactor);	},
			        pinchend: 	function() { console.log('pinchEnd on viewport-> ' + pinchFactor);	}	
        		}
        	}
        });

    	new Ext.Panel
    	({ 
    		id: 'mainscreen',
    		fullscreen:true, 
    		html: 'hello mag42',
    		styleHtmlContent: true,
            items:[viewport],
    		dockedItems:debug
    	});
    }
});

