//globals
var rootPanel;
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
    	var pinchLayer, debugPanel;
    	var menuButtonHandler, menuButtons, menu_bar;
    	var bottom_thingy, bottom_thiny_header, bottom_thingy_content, bottom_bildleiste;
    	var side_thingy, side_thingy_list;
    	//var trashcan;
    	var article_overview;
    	
    	
    	// booleans for global state
    	var all_draggable = true;
    	var side_thingy_enabled = true;
    	
    	
        // overlay for articles
        article_overlay = new Ext.Panel({
            floating: true,
            modal: true,
            centered: true,
            width: 600,
            height: 700,
            scroll: 'vertical',
            html: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.<br/><br/>Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.<br/><br/>Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.<br/><br/>Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer',
            
        });
    	
    	// Bildleiste als Header
    	var pictures_html = "";
    	for(var i=1; i<37; i++)
    	{
    		pictures_html += '<div class="picturePreview"><img alt="Bild'+i+'" src="img/Bild'+i+'.jpg" class="imgprev"/></div>'; 
    	}
    	
        bottom_bildleiste= new Ext.Panel
        ({
            style: "background-image: url(gfx/picture_preview_panel_back.png); background-repeat: no-repeat; z-index: 100;",
            height:"75",
	
            scroll: "horizontal",
            dock: "top",
            html:'<div class="picturePreviewPanel">' + pictures_html + '</div>"',
        });
        
        var article_prev_html = "";
        var lorem = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et";
        
        for(var i=1; i<33; i++)
    	{
        	article_prev_html += '<div class="articlePreview"><div class="articlePreviewLeft"><img alt="Bild'+i+'" src="img/Bild'+i+'.jpg" class="artprev"/></div><div class="articlePreviewRight"><h1>Headline '+i+'</h1>'+lorem+'</div></div>'; 
    	}
        
        // content of bottom panel
        bottom_thingy_content = new Ext.Panel
        ({
            style: "background-image: url(gfx/preview_back.png); background-repeat: repeat; z-index: 100;",
            scroll: "horizontal",
            height: "290",
            html: '<div class="articlePreviewPanel">' + article_prev_html + '</div>',
            listeners:
            {
                el:
                {
                    tap: function(evt, html, obj)
                    {
                        console.log("touched article: ");
                        article_overlay.show();
                    }
                }
            }
        });
        
        // actual bottom panel, contains head- and content-panel
        // is dragable, and docked.
        bottom_thingy = new Ext.Panel
        ({
        	id:"bottomPanel",
            style:  "z-index: 1002;",
            dock: "bottom",
            draggable: true,
            height: "75",
                    
            listeners:
            {
                afterrender:   function(component)
                {
                    console.log("after render");
                    //article_overlay.show();
                },
            
                el:
                {
                    drag:    function(event, html, obj)
                    {
                    	if(event.pageY < 300)
                    	{
                    		var div = Ext.getDom(this.id);
                        	div.style.webkitTransform = "translate3d(0px, -280px, 0px)";
                        	//console.log(event.pageY)
                    	}
                    }, 
                    
                    touchstart: function(event, html, obj)
                    {
                        //console.log("touchstart at " + event.startY);
                    },
                    
                    touchend: function(event, html, obj)
                    {
                        //console.log("touchend at " + event.endX + "/" + event.endY);
                    },
                    
                },
                
            },
            dockedItems: [bottom_bildleiste],
            items: [bottom_thingy_content]
       });
                
        // list for side panel
        side_thingy_list = new Ext.List
        ({
            style: "background-image: url(gfx/preview_back.png); background-repeat:repeat; z-index: 10;",
            store: tagstore,
            itemTpl: '<div style="color:#fff;">{tagname}</div>',
            grouped: false,
            indexBar: true,
            height: "720",
            itemSelector: "div.list",
            itemCls: "list",
            listeners:
            {
            itemswipe:  function(list_object, index, item, event)
                {
                    var new_tag = new Tag();

                    new_tag.initTag(list_object.store.getAt(index).get('tagname'), 0, 500, event.startY - 50);
                    tagPanel.addTag(new_tag);
                    list_object.store.removeAt(index);
                    new_tag.setDraggable(true);
                }
            }
        });
                
        // actual side panel
        side_thingy = new Ext.Panel
        ({
            style: "color: #ffffff; z-index: 10;  opacity:0.75;",
            width: "250",
            dock: "right",
            showAnimation: {type: "slide", direction: "left", duration: 1000},
            items: [side_thingy_list]
        });
                
        /*
        trashcan = new Trashcan(
        { 
            style: "background-color: #ffffff",
            width: 50,
            height: 100,
            
            listeners: 
            {
                drop: function(droppable, draggable, e) {
                    console.log("drop over trashcan happened " + e.startY);
                }
            },
            
        });
        */
        
        
        menuButtonHandler = function(button,event)
        {
        	if(button.text == "view")
        	{
        		side_thingy_enabled = false;
                side_thingy.hide();
                pinchLayer.enablePinchLayer(true);
                //pinchLayer.show();
                tagPanel.setTagsDraggable(false);
        	}
        	if( button.text == "edit")
        	{
        		side_thingy_enabled = true; 
                side_thingy.show();
                //pinchLayer.hide();
                pinchLayer.enablePinchLayer(false);
                pinchLayer.reset();
                tagPanel.setTagsDraggable(true);
        	}
        };
        
        menuButtons = 
        [{
         	xtype: "segmentedbutton",
         	items:
         	[
         	 	{
         	 		text: "view",
         	 		handler: menuButtonHandler
         	 	},
         	 	{
         	 		text: "edit",
         	 		handler: menuButtonHandler,
         	 		pressed: true
        	 	}
         	]
        }];
        
        menu_bar = new Ext.Toolbar
        ({
            dock : 'top',
            style: " z-index:2000;",
            items: [ {xtype: 'spacer'}, menuButtons]
        });
             
        if(DEBUG_INDEX) console.log("create pinch layer");
        pinchLayer = new PinchLayer
        ({
        	fullscreen:true,
        	layout:{type:'auto'},
        	cls: "pinchLayer"
        });

        if(DEBUG_INDEX) console.log("create tagPanel");
        tagPanel = new TagPanel
        ({
        	layout:{type:'auto'}
//        	style: "background-image: url(gfx/helper.jpg); z-index:700;",
//        	width:"2048",
//        	height:"2048"
        });
            
        if(DEBUG_INDEX) console.log("id: " + tagPanel.id);
        pinchLayer.setParent(tagPanel);
        DEBUG_PANEL.addDebugItem(pinchLayer);
        
        viewport = new Ext.Panel
        ({
        	fullscreen:true,
        	layout:{type:'auto'},
        	style: "background-image: url(gfx/back.jpg); background-repeat: no-repeat;",
        	items:[tagPanel, /*trashcan */],
        	dockeditems:[pinchLayer]
        });

    	rootPanel = new Ext.Panel
    	({ 
    		id: 'mainscreen',
    		fullscreen:true, 
    		styleHtmlContent: true,
            items:[viewport],
    		dockedItems: [menu_bar, bottom_thingy, side_thingy ]
    	});
    	//trashcan.setPosition(20,400);
        
    	pinchLayer.initTags();
    	tagPanel.setTagsDraggable(true);
    }
});