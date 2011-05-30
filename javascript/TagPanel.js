//TAG
var Tag = Ext.extend(Ext.Container, 
{
	name: "",
	tag_id: "",
	maxSize: 200,
	size: 30,			//pinch size
	alpha: 1,
	layer: 0,			//layer ebene wo sich tag befindet, layer 0 = oberste ebene
	level: 0,			//aktuelle level ebene laut pinch
	x:0,
	y:0,				
	s:0,				//aktuelle schriftgroesse
	w:0,				//aktuelle tag breite
	h:0,				//aktuelle tag hoehe
	
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
	},
	
	setName: function(n,l)
	{
		this.name = n;
		this.layer = l;
		this.tag_id = l + "_" + n;
       	this.updateTag(this.size, this.alpha);
	},
	
	setPos: function(x,y)
	{
		this.x = x;
		this.y = y;
		this.setPosition(x,y);
	},
	
	updateTag: function(size, level)
	{
		this.size = size;
		this.level = level;
		
		var tmp = this.s;
		
		if( level > this.layer+1 )
		{
			this.alpha = 0;
		}
		else
		{
			if(level!=0)	this.s = Math.floor(size/level);
			else 			this.s = Math.floor(size);
		
			this.alpha = 1 - ( this.s ) / this.maxSize;
		}
		
		var diff = this.s-tmp;
		
		this.setPos(this.x+diff, this.y+diff);
		
		this.update("<div id=\"" + this.tag_id + "\" class=\"layer"+this.layer+"\" style=\" opacity: " + this.alpha + ";\"><span style=\"font-size:" + this.s + "px\">"+this.name+"</span></div>");
		//console.log("this: " + this.getWidth() + ", " + this.getHeight());
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
		this.updateChildren();
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
	
	updateChildren: function()
	{
		if(Tag.childTags.length > 0)
		{
			for(var i=0; i<Tag.childTags.length; i++)
			{
				Tag.childTags[i].updateTag(this.size/2, this.level);
			}
			this.doLayout();
		}
	}
});


//TAG CONTAINER
var TagPanel = Ext.extend(Ext.Panel, 
{
	// @privat
	initComponent: function() 
	{
		TagPanel.tags = new Array();
		
		var config = 
		{
			id: 'TagPanel',
			//html: "<div id=\"tagContainer\" class=\"test\" style=\"background-color: #00aeff;\"></div>"
		};
		
		Ext.apply(this, config);
		TagPanel.superclass.initComponent.call(this);
		
		this.createTags();
	},
	
	createTags: function()
	{
		var t1 = new Tag();
		t1.setName("SPORTS", 0);
		var c1 = new Tag();
		c1.setName("BUNDESLIGA", 1);
		t1.addChild(c1);
		t1.setPos(300,100);

				
		var t2 = new Tag();
		t2.setName("ART", 0);
		t2.setPos(200,300);
		
		var t3 = new Tag();
		t3.setName("TECHNOLOGY", 0);
		t3.setPos(20,50);
		
		this.addTag(t1);
		this.addTag(t2);
		this.addTag(t3);
	},

	updateTags: function(s,l,c)
	{
		if(TagPanel.tags.length > 0)
		{
			for(var i=0; i<TagPanel.tags.length; i++)
			{
				TagPanel.tags[i].updateTag(s,l);
				TagPanel.tags[i].updateChildren();
			}
		}
		
	 	this.update("<div id=\"tagContainer\" class=\"test\" style=\"background-color: #"+c+";\"></div>");
	},
	
	updateTagsLayout: function()
	{
		console.log("-> updateTagsLayout - " + rootPanel.getWidth() + ", " + rootPanel.getHeight());
	}, 
	
	addTag: function(t)
    {
		TagPanel.tags.push(t);
    	this.add(t);
    	this.doLayout();
    }
});