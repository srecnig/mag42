var rootPanel, tagstore;

Ext.regModel('Tag', {fields: ['tagname']});

tagstore = new Ext.data.Store({
    model: 'Tag', 
    sorters: 'tagname',
    getGroupString: function(record) {
        return record.get('tagname')[0];
    }, 
    data:
    [
        {tagname: 'Music'},
        {tagname: 'Video'},
        {tagname: 'Games'},
        {tagname: 'Philosophy'},
        {tagname: 'Politics'},
        {tagname: 'Nonsense'},
     ]
    });

var viewport;

Ext.setup
({
    tabletStartupScreen: 'gfx/tablet_startup.png',
    icon: 'gfx/icon.png',
    glossOnIcon: true,
    fullscreen:true,
    
    onReady: function()
    {   	
        // panels that build our application
    	var tag_1, tag_2, move_switch, pinchLayer, tagPanel;
    	var bottom_thingy, bottom_thiny_header, bottom_thingy_content, bottom_bildleiste;
    	var side_thingy, side_thingy_list;
    	
    	// booleans for global state
    	var all_draggable = true;
    	var side_thingy_enabled = true;
    	
    	// Bildleiste als Header
        bottom_bildleiste= new Ext.Panel({
            style: "background-color: #000000; z-index: 100;",
		height:46,
		//layout:{type:"auto"},
		//styleHtmlContent: true,
	     scroll: "horizontal",
            html: '<div id="Bildleiste" height="46">'+
       			'<div id="Bild1" style="float: left"><img alt="Bild1" src="img/Bild1.jpg" width="60" height="45" /></div>'+
				'<div id="Bild2" style="float: left"><img alt="Bild2" src="img/Bild2.jpg" width="60" height="45" /></div>'+  
        			'<div id="Bild3" style="float: left"><img alt="Bild3" src="img/Bild3.jpg" width="60" height="45" /></div>'+
        			'<div id="Bild4" style="float: left"><img alt="Bild4" src="img/Bild4.jpg" width="60" height="45" /></div>'+	
        			'<div id="Bild5" style="float: left"><img alt="Bild5" src="img/Bild5.jpg" width="60" height="45" /></div>'+
        			'<div id="Bild6" style="float: left"><img alt="Bild6" src="img/Bild6.jpg" width="60" height="45" /></div>'+   
        			'<div id="Bild7" style="float: left"><img alt="Bild7" src="img/Bild7.jpg" width="60" height="45" /></div>'+
        			'<div id="Bild8" style="float: left"><img alt="Bild8" src="img/Bild8.jpg" width="60" height="45" /></div>'+	
        			'<div id="Bild9" style="float: left"><img alt="Bild9" src="img/Bild9.jpg" width="60" height="45" /></div>'+
        			'<div id="Bild10" style="float: left"><img alt="Bild10" src="img/Bild10.jpg" width="60" height="45" /></div>'+
       			'<div id="Bild11" style="float: left"><img alt="Bild11" src="img/Bild11.jpg" width="60" height="45" /></div>'+
				'<div id="Bild12" style="float: left"><img alt="Bild12" src="img/Bild12.jpg" width="60" height="45" /></div>'+  
        			'<div id="Bild13" style="float: left"><img alt="Bild13" src="img/Bild13.jpg" width="60" height="45" /></div>'+
        			'<div id="Bild14" style="float: left"><img alt="Bild14" src="img/Bild14.jpg" width="60" height="45" /></div>'+	
        			'<div id="Bild15" style="float: left"><img alt="Bild15" src="img/Bild15.jpg" width="60" height="45" /></div>'+
        			'<div id="Bild16" style="float: left"><img alt="Bild16" src="img/Bild16.jpg" width="60" height="45" /></div>'+   
        			'<div id="Bild17" style="float: left"><img alt="Bild17" src="img/Bild17.jpg" width="60" height="45" /></div>'+
        			'<div id="Bild18" style="float: left"><img alt="Bild18" src="img/Bild18.jpg" width="60" height="45" /></div>'+	
        			'<div id="Bild19" style="float: left"><img alt="Bild19" src="img/Bild19.jpg" width="60" height="45" /></div>'+
        			'<div id="Bild20" style="float: left"><img alt="Bild20" src="img/Bild20.jpg" width="60" height="45" /></div>'+
       			'<div id="Bild21" style="float: left"><img alt="Bild21" src="img/Bild21.jpg" width="60" height="45" /></div>'+
				'<div id="Bild22" style="float: left"><img alt="Bild22" src="img/Bild22.jpg" width="60" height="45" /></div>'+  
        			'<div id="Bild23" style="float: left"><img alt="Bild23" src="img/Bild23.jpg" width="60" height="45" /></div>'+
        			'<div id="Bild24" style="float: left"><img alt="Bild24" src="img/Bild24.jpg" width="60" height="45" /></div>'+	
        			'<div id="Bild25" style="float: left"><img alt="Bild25" src="img/Bild25.jpg" width="60" height="45" /></div>'+
        			'<div id="Bild26" style="float: left"><img alt="Bild26" src="img/Bild26.jpg" width="60" height="45" /></div>'+   
        			'<div id="Bild27" style="float: left"><img alt="Bild27" src="img/Bild27.jpg" width="60" height="45" /></div>'+
        			'<div id="Bild28" style="float: left"><img alt="Bild28" src="img/Bild28.jpg" width="60" height="45" /></div>'+	
        			'<div id="Bild29" style="float: left"><img alt="Bild29" src="img/Bild29.jpg" width="60" height="45" /></div>'+
        			'<div id="Bild30" style="float: left"><img alt="Bild30" src="img/Bild30.jpg" width="60" height="45" /></div>'+
       			'<div id="Bild31" style="float: left"><img alt="Bild31" src="img/Bild31.jpg" width="60" height="45" /></div>'+
				'<div id="Bild32" style="float: left"><img alt="Bild32" src="img/Bild32.jpg" width="60" height="45" /></div>'+  
        			'<div id="Bild33" style="float: left"><img alt="Bild33" src="img/Bild33.jpg" width="60" height="45" /></div>'+
        			'<div id="Bild34" style="float: left"><img alt="Bild34" src="img/Bild34.jpg" width="60" height="45" /></div>'+	
        			'<div id="Bild35" style="float: left"><img alt="Bild35" src="img/Bild35.jpg" width="60" height="45" /></div>'+
        			'<div id="Bild36" style="float: left"><img alt="Bild36" src="img/Bild36.jpg" width="60" height="45" /></div>'+   			
        			'<div id="Strich" height="1" width="2160"><img alt="Strich" src="img/Strich.png" width="2160" height="1" /></div>'+   			
			'</div>',
            dock: "top"
        });

        
        // content of bottom panel
        bottom_thingy_content = new Ext.Panel({
            style: "background-color: #000000; z-index: 100;",
		scroll: "horizontal",
            html: '<div><img src="img/artikelliste_personal.png"></div>'
        });
        
        // actual bottom panel, contains head- and content-panel
        // is dragable, and docked.
        bottom_thingy = new Ext.Panel({
            style: "background-color: #000000; z-index: 1002;",
            dock: "bottom",
            draggable: "true",
            height: 46,
            listeners:
            {
                el:
                {
                    drag:    function(event, html, obj)
                    {
                        // value is not really right, i guess.
                        this.setHeight(768 - event.pageY);
                    }
                }
            },
            dockedItems: [bottom_bildleiste],
 //           items: [bottom_thingy_header, bottom_thingy_content]
             items: [bottom_thingy_content]
       });
        
        // list for side panel
        side_thingy_list = new Ext.List({
           style: "background-image: url(gfx/listbg.png); background-repeat:repeat; z-index: 10",
           store: tagstore,
            itemTpl: '<div class="list" style="background-image: url(gfx/tag.png);">{tagname}</div>',
            grouped: false,
            indexBar: false,
            height: "720"
        });
                
        // actual side panel
        side_thingy = new Ext.Panel({
            style: "background-color: #ad1aca;color: #ffffff; z-index: 1001",
            width: "300",
            dock: "right",
            showAnimation: {type: "slide", direction: "left", duration: 1000},
            items: [side_thingy_list]
        });
            	
    	    	
    	tag_1 = new Ext.Panel
    	({
        	cls: "layer_dummy",
    		html: "TECHNOLOGY",
    		width: "220",
    		height: "50",
    		draggable: "false"
    	});
    	
        tag_2 = new Ext.Panel
        ({
        	cls: "layer_dummy",
        	html: "ART",
        	width: "80",
        	height: "50",
        	draggable: "false"
        });
         
        move_switch = new Ext.Panel
        ({
            html: "dragging: on",
            width: "100",
            height: "50",
            listeners:
            {
                el:
                {
                    tap:    function() 
                    { 
                        
                        if (all_draggable == true)
                        {
                            this.update("dragging: off"); 
                            // remove draggablity of _all_ tags
                            tag_1.setDraggable(false);
                            tag_2.setDraggable(false);                            
                            all_draggable = false;
                            side_thingy.hide();
                        }
                        else
                        {
                            // add draggability to _all_ tags
                            this.update("dragging: on"); 
                            tag_1.setDraggable(true);
                            tag_2.setDraggable(true);
                            all_draggable = true;
                            side_thingy.show();
                        }
                        
                    }
                }
            }
                   
        }); 
        
        pinchLayer = new PinchLayer
        ({
        	fullscreen:true,
        	layout:{type:'auto'},
        	cls: "pinchLayer"
        });
        
        tagPanel = new TagPanel
        ({
        	layout:{type:'auto'},
        	items: [pinchLayer]
        });
            
        pinchLayer.setParent(tagPanel);
        
        viewport = new Ext.Panel
        ({
        	fullscreen:true,
        	layout:{type:'auto'},
        	style: "background-image: url(gfx/bg.png); background-repeat: repeat;",
        	items:[move_switch, tagPanel]
        });

    	rootPanel = new Ext.Panel
    	({ 
    		id: 'mainscreen',
    		fullscreen:true, 
    		styleHtmlContent: true,
            items:[viewport],
    		dockedItems: [ bottom_thingy, side_thingy ]
    	});
    }
});