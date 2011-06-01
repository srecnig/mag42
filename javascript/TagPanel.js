var ORIGIN = new Object(); ORIGIN.x = 0; ORIGIN.y = 0;
var MAX_FONT_SIZE = 200;



function vec2dis(a, b)
{
	return Math.floor ( Math.sqrt( Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2) ) );
} 

//TAG
var Tag = Ext.extend(Ext.Container, 
{
	name: "",
	tagID: "",
	maxSize: 200,
	size: 30,			//pinch size
	alpha: 1,
	layer: 0,			//layer ebene wo sich tag befindet, layer 0 = oberste ebene
	level: 0,			//aktuelle level ebene laut pinch
	dis: 0,					
	initialPos: new Object(),
	currentPos: new Object(),
	tagWidth: 0,
	tagHeight: 0,
	tagFontSize: 0,
	tagAlpha: 0,
	tagLayer: 0,
	pinchPos: new Object(),
	pinchLevel: 0,
		
	initComponent: function() 
	{
		var config = 
		{
	        centered: true,
	        modal: true
		};
		
		Ext.apply(this, config);
	  	    
        Tag.superclass.initComponent.call(this);
		Tag.childTags = new Array();
		
		this.initialPos.x = 0;
		this.initialPos.y = 0;
		
		this.currentPos.x = 0;
		this.currentPos.y = 0;
		
		this.pinchPos.x = 0;
		this.pinchPos.y = 0;
	},
	
	setName: function(n,l)
	{
		this.name = n;
		this.tagLayer = l;
		this.tagID = l + "_" + n;
       	this.updateTag(this.size, this.alpha,1);
			
		this.initialPos.x = this.x;
		this.initialPos.y = this.y;
		
		this.dis = vec2dis(this.initialPos, ORIGIN);
	},
	
	setPos: function(x,y)
	{
		this.currentPos.x = x;
		this.currentPos.y = y;
		
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
				
		console.log("Tag->updateTag "+this.name+" z: " + zoom);
		this.calcPos(zoom);
		
		
		this.update("<div id=\"" + this.tagID + "\" class=\"layer"+this.tagLayer+"\" style=\" opacity: " + this.tagAlpha + ";\"><span style=\"font-size:" + this.tagFontSize + "px\">"+this.name+"</span></div>");
		//console.log("this: " + this.getWidth() + ", " + this.getHeight());
	},
	
	
	calcPos: function(z)
	{
		var tp = new Object();
		tp.x = this.x;
		tp.y = this.y;
			
		this.dis = vec2dis(tp, this.pinchPos);
		
		if(this.x > this.pinchPos.x)
		{
			tx = this.pinchPos.x + this.dis * z;
		}
		else
		{
			tx = this.pinchPos.x - this.dis * z;
		}
		
		if(this.y > ORIGIN.y)
		{
			ty = this.pinchPos.y + this.dis * z;
		}
		else
		{
			ty = this.pinchPos.y - this.dis * z;
		}
		
		//console.log(this.name  + " -> dis: " + this.dis);
		
		//console.log("ORIGIN: " + ORIGIN.x + ", " + ORIGIN.y + "  dis: " + this.dis + "   z: " + z);
		//console.log("t: " + tx + ", " + ty);
		
		this.setPos(tx, ty);
	},
	
	onPinchStart: function(px, py)
	{
		this.pinchPos.x = px;
		this.pinchPos.y = py;
		
		this.dis = vec2dis(this.getPos(), this.pinchPos);
		
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
		
		return  this.w;
	},
	
	getHeight: function()
	{
		var div = document.getElementById(this.tag_id);
		
		if(div != null)
		{
			this.h = div.clientHeight;
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
		Tag.childTags.push(c);
		this.add(c);
		this.updateChildren(1);
	},

	getChild: function(nr)
	{
		if( nr < Tag.childTags.length )
		{
			return Tag.childTags[nr];
		}
		else
		{
			return 0;
		}
	},
		
	getChildNr: function()
	{
		return Tag.childTags.length;
	},
	
	updateChildren: function(zoom)
	{
		if(Tag.childTags.length > 0)
		{
			for(var i=0; i<Tag.childTags.length; i++)
			{
				Tag.childTags[i].updateTag(this.size/2, this.level, zoom);
			}
			this.doLayout();
		}
	}
});


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
		if(TagPanel.tags.length > 0)
		{
			for(var i=0; i<TagPanel.tags.length; i++)
			{
				TagPanel.tags[i].onPinchStart(px,py);
			}
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
		t1.setPos(100,100);
		t1.setName("SPORTS", 0);
		
		var t2 = new Tag();
		t2.setPos(200,300);
		t2.setName("ART", 0);

		var t3 = new Tag();
		t3.setPos(-20,50);
		t3.setName("TECHNOLOGY", 0);
	
		
		var c1 = new Tag();
		c1.setName("BUNDESLIGA", 1);
			
		t1.addChild(c1);
	
		
		this.addTag(t1);
		this.addTag(t2);
		this.addTag(t3);
	},

	//s pinchSize
	//l pinchLevel
	//p pinchPos
	//c pinchColor
	updateTags: function(s, l, z, c)
	{
		console.log(" TagPanel->updateTags z: " + z);
		
		if(TagPanel.tags.length > 0)
		{
			for(var i=0; i<TagPanel.tags.length; i++)
			{
				TagPanel.tags[i].updateTag(s, l, z);
				TagPanel.tags[i].updateChildren(z);
				//console.log(" TagPanel->updateTags " + TagPanel.tags[i].name + " z: " + z);
			}
		}
	
		//console.log("tag pinch z: " +z);
	},
	
	updateTagsLayout: function()
	{
		//console.log("-> updateTagsLayout - " + rootPanel.getWidth() + ", " + rootPanel.getHeight());
	}, 
	
	addTag: function(t)
    {
		TagPanel.tags.push(t);
    	this.add(t);
    	this.doLayout();
    }
});