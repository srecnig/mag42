//globals
var rootPanel;
var viewport;
var bottom_thingy, bottom_thiny_header, bottom_thingy_content, bottom_bildleiste;
var article_overlay;

function create_bottom_content()
{
    var article_prev;
          
    for(var i=0; i<articlestore.data.length; i++)
    {
        	article_prev += '<div class="articlePreview" onClick="create_and_show_overlay(this)" id="article_preview_' + i + ' "><div class="articlePreviewLeft"><img alt="Bild'+i+'" src="img/' + articlestore.getAt(i).get('image') + '.jpg" class="artprev"/></div><div class="articlePreviewRight"><h1>' +  articlestore.getAt(i).get('title') + '</h1>' + articlestore.getAt(i).get('abstract') + '</div></div>'; 
    }
    	
    return article_prev;
}

function create_and_show_overlay(obj)
{
    //var store_index = obj.id.split("_")[2];
    //var store_index = "20";
    //var i = 5;
    var i = obj.id.split("_")[2];
    console.log(i);
    
    // create html
    var overlay_html = '<div class="overlay" style="width:800px; height:600px; background-image:url(img/Bild1.jpg); background-position:center;"><div> <h1>' + articlestore.getAt(i).get('title') + '</h1> </div><div class="overlay_abstract">Hunderte Soldaten sollen das Dorf Chirbet al-Dschoos besetzt haben. Der Flüchtlingsstorm nahe des türkischen Dorfes Güvecci geht weiter.</div></div><div class="overlay_text">Die syrische Armee ist am Donnerstag in ein Dorf an der Grenze zur Türkei eingedrungen. Hunderte Soldaten hätten das Dorf Chirbet al-Dschoos am Morgen mit Panzern besetzt, sagte ein Menschenrechtsaktivist.<br /><br />Ein syrischer Aktivist an der Grenze zur Türkei sagte, er habe 30 Panzer und 15 Busse der Armee gesehen, die in das Dorf eingedrungen seien. Anschließend seien Schüsse zu hören gewesen. Dutzende Familien aus Chirbet al-Dschoos, die sich in Erwartung eines Angriffs außerhalb des Dorfes versteckt hätten, seien daraufhin in Panik in Richtung Grenze geflohen. Dort seien sie von der türkischen Armee mit 20 Bussen abgeholt und in eine Kaserne gebracht worden. Er habe von Flüchtlingen gehört, dass Soldaten und Angehörige der Shabiha-Miliz mit Namenslisten durch das Dorf gezogen seien und dort Häuser von Regimegegnern zerstört hätten.<br  /><br />Flüchtlingsstrom geht weiter<br /><br />Angesichts der Truppenbewegungen überquerten am Donnerstag erneut Hunderte Syrer nahe des türkischen Dorfes Güvecci die Grenze, wie ein Journalist berichtete. Seit Tagen campieren tausende Flüchtlinge in provisorischen Unterkünften, die sie auf syrischer Seite entlang der Grenze errichtet haben. Sie fürchten, nicht wieder in ihre Heimat zurückkehren zu können, wenn sie einmal die Grenze überquert haben. Ihren Angaben zufolge haben die türkischen Grenzposten ihnen aber zugesichert, bei Gefahr die Grenze passieren zu dürfen.<br /><br />Auf türkischer Seite wurden die Flüchtlinge von Sicherheitskräften in Empfang genommen, die mit Minibussen vor Ort war. Eine zweite Gruppe von mehreren hundert Syrern befand sich auf dem Weg in Richtung der Fahrzeuge. Der Rote Halbmond hat in der Provinz Hatay fünf Flüchtlingslager errichtet, um die Flüchtlinge aufzunehmen. Bisher befinden sich 10.200 Menschen in den Lagern. Die Verletzten werden in das knapp 40 Kilometer weiter nördlich gelegene Krankenhaus von Antakya gebracht.<br /><br />Landesweite Proteste am Donnerstag<br /><br />Syrische Oppositionelle riefen unterdessen im Internet für Donnerstag zu einem landesweiten Generalsstreik auf, um am 100. Tag der Proteste gegen Präsident Bashar al-Assad der Opfer der Repression zu gedenken.<br /><br />Aber auch auf der Facebook-Seite "Syrian Revolution 2011", die eine Schlüsselrolle bei der Organisation der Proteste spielt, wurde zudem wie in den Wochen zuvor für Freitag nach dem Mittagsgebet unter dem Slogan "Verlorene Legitimität" zu erneuten Protesten gegen die Regierung aufgerufen.</div>';
    
    // set to panel and show
    article_overlay.html = overlay_html;
    article_overlay.show();
}

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
    	var side_thingy, side_thingy_list;
    	//var trashcan;
    	var article_overview;
    	
    	
    	// booleans for global state
    	var all_draggable = true;
    	var side_thingy_enabled = true;
    	
    	var arttpl = 	'<div class="overlay" style="width:800px; height:600px; background-image:url(img/Bild1.jpg); background-position:center;">'+
    						'<div> <h1> Syrische Armee besetzt Grenzdorf nahe der Turkei</h1> </div>'+
    						'<div class="overlay_abstract">Hunderte Soldaten sollen das Dorf Chirbet al-Dschoos besetzt haben. Der Flüchtlingsstorm nahe des türkischen Dorfes Güvecci geht weiter.</div>'+
    					'</div>'+
    					'<div class="overlay_text">Die syrische Armee ist am Donnerstag in ein Dorf an der Grenze zur Türkei eingedrungen. Hunderte Soldaten hätten das Dorf Chirbet al-Dschoos am Morgen mit Panzern besetzt, sagte ein Menschenrechtsaktivist.<br /><br />Ein syrischer Aktivist an der Grenze zur Türkei sagte, er habe 30 Panzer und 15 Busse der Armee gesehen, die in das Dorf eingedrungen seien. Anschließend seien Schüsse zu hören gewesen. Dutzende Familien aus Chirbet al-Dschoos, die sich in Erwartung eines Angriffs außerhalb des Dorfes versteckt hätten, seien daraufhin in Panik in Richtung Grenze geflohen. Dort seien sie von der türkischen Armee mit 20 Bussen abgeholt und in eine Kaserne gebracht worden. Er habe von Flüchtlingen gehört, dass Soldaten und Angehörige der Shabiha-Miliz mit Namenslisten durch das Dorf gezogen seien und dort Häuser von Regimegegnern zerstört hätten.<br  /><br />Flüchtlingsstrom geht weiter<br /><br />Angesichts der Truppenbewegungen überquerten am Donnerstag erneut Hunderte Syrer nahe des türkischen Dorfes Güvecci die Grenze, wie ein Journalist berichtete. Seit Tagen campieren tausende Flüchtlinge in provisorischen Unterkünften, die sie auf syrischer Seite entlang der Grenze errichtet haben. Sie fürchten, nicht wieder in ihre Heimat zurückkehren zu können, wenn sie einmal die Grenze überquert haben. Ihren Angaben zufolge haben die türkischen Grenzposten ihnen aber zugesichert, bei Gefahr die Grenze passieren zu dürfen.<br /><br />Auf türkischer Seite wurden die Flüchtlinge von Sicherheitskräften in Empfang genommen, die mit Minibussen vor Ort war. Eine zweite Gruppe von mehreren hundert Syrern befand sich auf dem Weg in Richtung der Fahrzeuge. Der Rote Halbmond hat in der Provinz Hatay fünf Flüchtlingslager errichtet, um die Flüchtlinge aufzunehmen. Bisher befinden sich 10.200 Menschen in den Lagern. Die Verletzten werden in das knapp 40 Kilometer weiter nördlich gelegene Krankenhaus von Antakya gebracht.<br /><br />Landesweite Proteste am Donnerstag<br /><br />Syrische Oppositionelle riefen unterdessen im Internet für Donnerstag zu einem landesweiten Generalsstreik auf, um am 100. Tag der Proteste gegen Präsident Bashar al-Assad der Opfer der Repression zu gedenken.<br /><br />Aber auch auf der Facebook-Seite "Syrian Revolution 2011", die eine Schlüsselrolle bei der Organisation der Proteste spielt, wurde zudem wie in den Wochen zuvor für Freitag nach dem Mittagsgebet unter dem Slogan "Verlorene Legitimität" zu erneuten Protesten gegen die Regierung aufgerufen.</div>';
    				
    	
        // overlay for articles
        article_overlay = new Ext.Panel({
            floating: true,
            modal: true,
            centered: true,
            width: 800,
            height: 600,
            scroll: 'vertical',
            html: arttpl
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
            html:'<div class="picturePreviewPanel">' + pictures_html + '</div>"'
        });
        
        var article_prev_html = create_bottom_content();
        
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
                    /*
                    tap: function(evt, html, obj)
                    {
                        console.log("touched article: ");
                        article_overlay.show();
                    }
                    */
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
                    }
                    
                }
                
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