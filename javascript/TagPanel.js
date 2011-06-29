function vec2dis(ax, ay, bx, by)
{
	return Math.floor ( Math.sqrt( Math.pow(bx - ax, 2) + Math.pow(by - ay, 2) ) );
} 

function calcAlpha(x)
{
	var y = ( Math.cos(PI*x) + 1 ) / 2;
	y = Math.round( y * 1000 ) / 1000;
	return y;
}

function calcFontSize(x)
{
	var y = (x/2) * MAX_FONT_SIZE;
	return y;
}

function createTagID()
{
	TAG_ID_COUNTER++;
	var id = "tag_" + TAG_ID_COUNTER;
	
	return id;
}

var closeBtnTpl = '<div class="closeBtn" onClick="deleteTag(this)"></div>';

function deleteTag(obj)
{
	//console.log("test " + obj.parentNode.id + ".");
	tagPanel.removeTag(obj.parentNode.id);
}

//TAG
Tag = Ext.extend(Ext.Container, 
{
	name: "",
	debugCLS: "tag",
	tagID: "",
	dis: 0,					
	initX: 0,			//initial x position
	initY: 0,			//initial y position
	tagWidth: 0,
	tagHeight: 0,
	tagFontSize: DEF_FONT_SIZE,
	tagAlpha: 0,
	tagLayer: 0,		//layer ebene wo sich tag befindet, layer 0 = oberste ebene
	tagCSS: TAG_CSS,
	tagZindex: TAG_ZINDEX, 
	pinchX: 0,			//pinch x position
	pinchY: 0,			//pinch x position
	pinchLevel: 0,
	childrenTags:null, 
	closeBtn:"",
	
	initComponent: function() 
	{
		var config = 
		{
	        x: 0,
	        y: 0,
	        width: "0",
	        height: "0"
	  	};
		
		Ext.apply(this, config, this.initialConfig);
 
        Tag.superclass.initComponent.call(this);
        this.addEvents('tagedited');
        this.addListener
        ({
        	el:
        	{
        		dragend: function(e)
        		{
        			this.fireEvent('tagedited', e.type, e);
        		},
        		scope: this
        	}
        });

	},
	
	initTag: function(name, layer, posX, posY)
	{
		this.name = name;
		this.tagLayer = layer;
		this.tagID = createTagID();//layer + "_" + name;
		this.id = this.tagID + "_container";
		this.showClsBtn(true);
		
		if(posX!=null)
		{
			this.initX = posX;
			this.initY = posY;
		}
		this.childrenTags = new Array();
		this.setPos(this.initX, this.initY);
		this.updateTag(0,0);
		
		this.on('tagedited', this.onEditEnd);
	},
		
	setPos: function(x,y)
	{
		this.x = x;
		this.y = y;
		this.setPosition(x, y);
	},
	
	getPos: function()
	{
		var pos = new Object();
		pos.x = this.x;
		pos.y = this.y;
		
		return pos;
	},
	
	updateTag: function(zoom_ratio, zoom_level)
	{
		if( Math.abs(this.tagLayer-zoom_level) < 2)
		{
			
			var x = zoom_ratio;
			var s = zoom_ratio;
					
			//gleiche eben wie tag
			if(this.tagLayer == zoom_level)
			{
				x -= 0.5;
				s += 0.5;
				this.tagAlpha = calcAlpha(x);
				this.tagFontSize = calcFontSize(s);
				this.tagCSS = "tag_active";
				this.tagZindex = TAG_ZINDEX;
			}
						
			//tag eine ebene ueberhalb von aktueller ebene
			else if(this.tagLayer+1 == zoom_level)
			{
				x = x/2 + 0.5;
				s = 1.5 + s/2;
				this.tagAlpha = calcAlpha(x);
				this.tagFontSize = calcFontSize(s);
				this.tagCSS = "tag_inactive";
				this.tagZindex = TAG_ZINDEX+1;
			}
	
			//tag eine ebene unterhalb von aktueller ebene
			else if(this.tagLayer-1 == zoom_level)
			{
				x = x/2 - 1;
				s = s/2;
				this.tagAlpha = calcAlpha(x);
				this.tagFontSize = calcFontSize(s);
				this.tagCSS = "tag_inactive";
				this.tagZindex = TAG_ZINDEX-1;
			}
						
			this.drawTag();
		}
		
		this.calcPos(zoom_ratio, zoom_level);
		this.updateChildren(zoom_ratio, zoom_level);
	},
	
	//draws tag
	drawTag: function()
	{
		this.update('<div id="' + this.tagID  + '"' +
				      'class="' + this.tagCSS + '"' +
				      'style=" z-index:' + this.tagZindex + '; opacity:' + this.tagAlpha + ';">' +	
					this.closeBtn +	
				      '<span style="font-size:' + this.tagFontSize + 'em">' +this.name+ '</span>'+
				    '</div>');
	
		this.updateDimensions();
        //}
	},
	
	updateChildren: function(zoom_ratio, zoom_level)
	{
		for(var i=0; i < this.items.length; i++)
		{
			this.getComponent(i).updateTag(zoom_ratio, zoom_level);
		}
		this.doLayout();
	},
	
	calcPos: function(zoom_ratio, zoom_level)
	{
		//richtungsvektor zw pinchPos und initPos berechnen
		var mx = this.pinchX - this.initX;
		var my = this.pinchY - this.initY;
		var norm = Math.sqrt(mx*mx + my*my); 
		
		mx = mx/norm;
		my = my/norm;

		var dis = vec2dis(this.initX, this.initY, this.pinchX, this.pinchY);
		
		var tx = ( ( zoom_level + zoom_ratio) / ( this.tagLayer+1 ) ); // *  mx
		
		this.dis = "" + tx;// + ", " + my; //vec2dis(this.initX, this.initY, this.pinchX, this.pinchY);

	},
	
	onPinchStart: function(px, py)
	{
		this.pinchX = px;
		this.pinchY = py;
		
		//console.log("TagPanel.onPinchStart: p(" + this.pinchX+ "," +  this.pinchY + ") - t(" + this.x + "," + this.y + ") -> " + this.dis );
	},
	
	onEditEnd: function(type, event)
	{
		this.initX = this.x = event.pageX;
		this.initY = this.y = event.pageY;
		
		this.updateChildrenAfterEdit(this.x, this.y);
	},
	
	updateChildrenAfterEdit: function(x, y)
	{
		for(var i=0; i < this.childrenTags.length; i++)
		{
			this.childrenTags[i].initX = x;
			this.childrenTags[i].initY = y;
			this.childrenTags[i].setPos(x,y);
			this.childrenTags[i].updateChildrenAfterEdit(x, y);
		}
		this.doLayout();
	},
	
	onDragTagStart: function(event)
	{
		console.log("dragTagStart");
	},
		
	afterRender: function() 
	{
		Tag.superclass.afterRender.call(this);
	},
	
	updateDimensions: function()
	{
		var div = Ext.getDom(this.tagID);
		
		if(div!=null)
		{
			this.tagWidth = div.clientWidth;
			this.tagHeight = div.clientHeight;
		}
		else
		{
			this.tagWidth = 0;
			this.tagHeight = 0;
		}
		
		this.doLayout();
	},
	
	showClsBtn: function(value)
	{
		if(value)
		{
			if(this.tagLayer == 0)
			{
				this.closeBtn = closeBtnTpl;
			}
		}
		else
		{
			this.closeBtn = "";
		}
		
		this.drawTag();
	},
	
	getWidth: function()
	{
		return this.tagWidth;
	},
	
	getHeight: function()
	{
		return this.tagHeight;
	},

	getMiddlePos: function()
	{
		var pos = new Array(0,0);
		pos[0] = this.x + this.tagWidth/2;
		pos[1] = this.y + this.tagHeight/2;
		
		return pos;
	},
	
	addChild: function(c)
	{
		this.childrenTags.push(c);
	},

	getChild: function(nr)
	{
		if( nr < this.childrenTags.length )
		{
			return this.childrenTags[i];
		}
		else
		{
			return 0;
		}
	},
		
	getChildNr: function()
	{
		return this.items.length;
	}
});

Ext.reg('Tag', Tag);

//TAG CONTAINER
var TagPanel = Ext.extend(Ext.Panel, 
{
	x: 0,
	y: 0,
	startX:0,
	startY:0,
	tagsDragabble: true,
	
	// @privat
	initComponent: function() 
	{
		TagPanel.tags = new Array();
		
		var config = 
		{
			id: 'TagPanel'
			//html: "<div id=\"tagContainer\" class=\"test\" style=\"background-color: #00aeff;\"></div>"
		};
		
		Ext.apply(this, config);
		TagPanel.superclass.initComponent.call(this);
		
		this.createTags();
	},
	
	onDragStart: function()
	{
		this.startX = this.x;
		this.startY = this.y;
	},
	
	onPinchStart: function(px, py)
	{
		for(var i=0; i<this.items.length; i++)
		{
			this.getComponent(i).onPinchStart(px,py);
		}
	},
	
	onDragStop: function()
	{
		this.startX = this.x;
		this.startY = this.y;
	},
	
	setPos: function(dx, dy)
	{
//		console.log("pos before: " + this.x + ", " + this.y);
			
		this.x = this.startX + dx;
		this.y = this.startY + dy;
		
		this.setPosition(this.x, this.y);
		
		//console.log("move tag panel: " + this.x + ", " + this.y);
		//console.log("pos after: " + this.x + ", " + this.y);
//		this.update("<div style=\"position:absolute; x:0; y:0; z-index:1008; \"><h1>TOUCH:" + this.x + ", " + this.y +"</h1></div>");
	},
	
	createTags: function()
	{
		var t1 = new Tag();
		//var t2 = new Tag();
		var c1 = new Tag();
		//var c2 = new Tag();
		var cc1 = new Tag();
		var ccc1 = new Tag();
		
		t1.initTag("Sports", 0, 200, 200);
	
		//t2.initTag("TECHNOLOGY", 0, 400, 300);
		c1.initTag("Bundesliga", 1,200,200);
		//c2.initTag("Apple", 1);
		cc1.initTag("FC&nbsp;Bayern", 2, 200,200);
		ccc1.initTag("Beckenbauer", 3, 200,200);
		
		cc1.addChild(ccc1);
		c1.addChild(cc1);
		t1.addChild(c1);
		
		/*
		t1.addChild(c1);
		c1.addChild(cc1);
		cc1.addChild(ccc1);
		*/
		//t2.addChild(c2);
		
		
		this.addTag(t1);
		this.addTag(c1);
		this.addTag(cc1);
		this.addTag(ccc1);
	
		/*
		DEBUG_PANEL.addDebugItem(t1);
		DEBUG_PANEL.addDebugItem(c1);
		DEBUG_PANEL.addDebugItem(cc1);
		DEBUG_PANEL.updateDebugItems();
		*/
	},

	setTagsDraggable: function(value)
	{
		this.tagsDragabble = value;
		
		for(var i=0; i<this.items.length; i++)
		{
			this.getComponent(i).setDraggable(this.tagsDragabble);
			
			if(value && this.getComponent(i).tagLayer==0)
				this.getComponent(i).showClsBtn(true);
			else
				this.getComponent(i).showClsBtn(false);
		}
	},
	
	updateTags: function(zoom_ratio, zoom_level)
	{
		for(var i=0; i<this.items.length; i++)
		{
			//console.log("mother " + i + " draw " + this.getComponent(i).name);
			this.getComponent(i).updateTag(zoom_ratio, zoom_level);
		}
		
		if(DEBUG_ON) 
			DEBUG_PANEL.updateDebugItems();
	},
	
	addTag: function(t)
    {
    	this.add(t);
    	this.doLayout();
    },
    
    removeTag: function(id )
    {
        var mother_tag;
        console.log("heeeello, removeTag: " + id);
        // iterate and find the tag object
        for(var i=0; i<this.items.length; i++)
		{		
		    if (this.getComponent(i).id == id + "_container")
		    {
		         // find all child-tags and remove them
                // remove mothertag ("muttertag") 
                mother_tag = this.getComponent(i);
                console.log("fount our tag:" + mother_tag.id);
                this.remove(mother_tag, true);
                //this.items.removeAt(i);
                //this.doLayout();
            }
		}   
    },
    
    getTags: function()
    {
        var return_string = "";
    
        for(var i=0; i<this.items.length; i++)
		{
		    if (this.getComponent(i).tagLayer == 0)
                return_string += this.getComponent(i).name + " ";
		}
		
		return return_string;
    }
});

Ext.reg('TagPanel', TagPanel);
