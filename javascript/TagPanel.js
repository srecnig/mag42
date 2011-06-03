var ORIGIN = new Object(); ORIGIN.x = 0; ORIGIN.y = 0;
var MAX_FONT_SIZE = 200;



function vec2dis(ax, ay, bx, by)
{
	return Math.floor ( Math.sqrt( Math.pow(bx - ax, 2) + Math.pow(by - ay, 2) ) );
} 

//TAG
Tag = Ext.extend(Ext.Container, 
{
	name: "",
	tagID: "",
	maxSize: 200,
	size: 30,			//pinch size
	alpha: 1,
	layer: 0,			//layer ebene wo sich tag befindet, layer 0 = oberste ebene
	level: 0,			//aktuelle level ebene laut pinch
	dis: 0,					
	initX: 0,			//initial x position
	initY: 0,			//initial y position
	tagWidth: 0,
	tagHeight: 0,
	tagFontSize: 0,
	tagAlpha: 0,
	tagLayer: 0,
	pinchX: 0,			//pinch x position
	pinchY: 0,			//pinch x position
	pinchLevel: 0,
		
	initComponent: function() 
	{
		var config = 
		{
	        centered: true,
	        modal: true
		};
		
		Ext.apply(this, config, this.initialConfig);
 
        Tag.superclass.initComponent.call(this);
		Tag.childTags = new Array();
	},
	
	initTag: function(name, layer, posX, posY)
	{
		this.name = name;
		this.tagLayer = layer;
		this.tagID = layer + "_" + name;
				
		this.initX = posX;
		this.initY = posY;
		
		//console.log("mid: " + this.getMiddlePos()[0] + ", " + this.getMiddlePos()[1]);
		
		this.setPos(posX, posY);
		this.updateTag(this.size, this.alpha, 1);
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
	
	updateTag: function(size, level, zoom)
	{
		this.size = size;
		this.pinchLevel = level;
				
		if( this.pinchLevel > this.layer+1 )
		{
			this.tagAlpha = 0;
		}
		else
		{
			if( this.pinchLevel != 0 )	this.tagFontSize = Math.floor(size/level);
			else 						this.tagFontSize = Math.floor(size);
		
			this.tagAlpha = 1 - ( this.tagFontSize ) / MAX_FONT_SIZE;
		}
				
		//console.log("Tag->updateTag "+this.name+" z: " + zoom);

		if(zoom!=1) this.calcPos(zoom);
		
		if(this.tagFontSize < MAX_FONT_SIZE)
		{
			this.update("<div id=\"" + this.tagID + "\" class=\"layer"+this.tagLayer+"\" style=\" opacity: " + this.tagAlpha + ";\"><span style=\"font-size:" + this.tagFontSize + "px\">"+this.name+"</span></div>");
		}
		else
		{
			this.update("");
		}
			
		
		this.updateChildren(zoom);
	},
	
	
	calcPos: function(z)
	{
		var tx = 0;
		var ty = 0;
		var corr = 20;
		
		this.dis = vec2dis(this.initX, this.initY, this.pinchX, this.pinchY);
		
		//console.log(this.name + " before: initialPos(" + this.initialPos.x + ", " + this.initialPos.y + ") pinchPos(" + this.pinchPos.x + ", " + this.pinchPos.y + ") dis: " + this.dis + " zoom: " + z);
		
		if( ( this.initX + this.w/2 ) >= this.pinchX)
		{
			tx = this.initX + this.w/2  + this.dis * z/corr;
		}
		else
		{
			tx = this.initX - this.dis * z/corr;
		}
		
		if( ( this.initY + this.h/2 ) >= this.pinchY)
		{
			ty =  this.initY + this.h/2 + this.dis * z/corr;
		}
		else
		{
			ty =  this.initY + this.h/2 - this.dis * z/corr;
		}
		
		this.setPos(tx, ty);
		//console.log(this.name + " after: tagPos(" + this.x + ", " + this.y + ") pinchPos(" + this.pinchPos.x + ", " + this.pinchPos.y + ") dis: " + this.dis + " zoom: " + z);
	},
	
	onPinchStart: function(px, py)
	{
		this.pinchX = px;
		this.pinchY = py;
		
		//console.log(this.name + " pinchStart: initialPos(" + this.initialPos.x + ", " + this.initialPos.y + ") pinchPos(" + this.pinchPos.x + ", " + this.pinchPos.y + ") dis: " + this.dis);
		//console.log("TagPanel.onPinchStart: p(" + this.pinchPos.x + "," +  this.pinchPos.y + ") - t(" + this.x + "," + this.y + ") -> " + this.dis );
	},
	
	afterRender: function() 
	{
		Tag.superclass.afterRender.call(this);
		this.getWidth();
		this.getHeight();
	},
	

	getWidth: function()
	{
		var div = document.getElementById(this.tag_id);
		
		if(div != null)
		{
			this.w = div.clientWidth;
		}
		else
		{
			this.w = 0;
		}
		
		return  this.w;
	},
	
	getHeight: function()
	{
		var div = document.getElementById(this.tag_id);
		
		if(div != null)
		{
			this.h = div.clientHeight;
		}
		else
		{
			this.h = 0;
		}
				
		return  this.h;
	},
	
	getMiddlePos: function()
	{
		var pos = new Array(0,0);
		pos[0] = this.x + this.w/2;
		pos[1] = this.y + this.y/2;
		
		return pos;
	},
	
	addChild: function(c)
	{
		this.add(c);
		this.updateChildren(1);
	},

	getChild: function(nr)
	{
		if( nr < this.items.length )
		{
			return this.getComponent(i);
		}
		else
		{
			return 0;
		}
	},
		
	getChildNr: function()
	{
		return this.items.length;
	},
	
	updateChildren: function(zoom)
	{
		for(var i=0; i < this.items.length; i++)
		{
			this.getComponent(i).updateTag(this.tagFontSize/2, this.level, zoom);
		}
		this.doLayout();
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
			//var tmp = this.getComponent(i);
			//console.log(tmp.name + " before: initialPos(" + tmp.initialPos.x + ", " + tmp.initialPos.y + ") pinchPos(" + tmp.pinchPos.x + ", " + tmp.pinchPos.y + ") dis: " + tmp.dis);
			this.getComponent(i).onPinchStart(px,py);
			//console.log(tmp.name + " after: initialPos(" + tmp.initialPos.x + ", " + tmp.initialPos.y + ") pinchPos(" + tmp.pinchPos.x + ", " + tmp.pinchPos.y + ") dis: " + tmp.dis );
		}
	},
	
	onDragStop: function()
	{
		this.startX = this.x;
		this.startY = this.y;
	},
	
	setPos: function(dx, dy)
	{
		console.log("pos before: " + this.x + ", " + this.y);
			
		this.x = this.startX + dx;
		this.y = this.startY + dy;
		
		this.setPosition(this.x, this.y);
		
		//console.log("move tag panel: " + this.x + ", " + this.y);
		//console.log("pos after: " + this.x + ", " + this.y);
		this.update("<div style=\"position:absolute; x:0; y:0; z-index:1008; \"><h1>TOUCH:" + this.x + ", " + this.y +"</h1></div>");
	},
	
	createTags: function()
	{
		var t1 = new Tag();
		var t2 = new Tag();
		var c1 = new Tag();
		var c2 = new Tag();
		var cc1 = new Tag();
		
		t1.initTag("SPORTS", 0, 100, 100);
		t2.initTag("TECHNOLOGY", 0, 400, 300);
		c1.initTag("Bundesliga", 1);
		c2.initTag("Apple", 1);
		cc1.initTag("Fc Bayern", 2);
		
		c1.addChild(cc1);
		t1.addChild(c1);
		t2.addChild(c2);
		
		this.addTag(t1);
		this.addTag(t2);
	},

	//s pinchSize
	//l pinchLevel
	//p pinchPos
	//c pinchColor
	//ps pinchStart
	//px pinchX
	//py pinchY
	updateTags: function(s, l, z, c)
	{
		for(var i=0; i<this.items.length; i++)
		{
			//if(ps) this.getComponent(i).onPinchStart(px, py);
//			console.log(this.getComponent(i).name + " before up: initialPos(" + this.getComponent(i).initialPos.x + ", " + this.getComponent(i).initialPos.y + ") pinchPos(" + this.getComponent(i).pinchPos.x + ", " + this.getComponent(i).pinchPos.y + ") dis: " + this.getComponent(i).dis);
			this.getComponent(i).updateTag(s, l, z);
//			console.log(this.getComponent(i).name + " after up: initialPos(" + this.getComponent(i).initialPos.x + ", " + this.getComponent(i).initialPos.y + ") pinchPos(" + this.getComponent(i).pinchPos.x + ", " + this.getComponent(i).pinchPos.y + ") dis: " + this.getComponent(i).dis);
			//this.getComponent(i).updateChildren(z);
		}
	},
	
	updateTagsLayout: function()
	{
		//console.log("-> updateTagsLayout - " + rootPanel.getWidth() + ", " + rootPanel.getHeight());
	}, 
	
	addTag: function(t)
    {
    	this.add(t);
    	this.doLayout();
    }
});