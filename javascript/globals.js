/**
 *GLOBALS 
 */
//MATH
var PI = Math.PI;

//TagPanel
var tagPanel;
var ORIGIN = new Object(); ORIGIN.x = 0; ORIGIN.y = 0;
var MAX_FONT_SIZE = 16;
var MIN_FONT_SIZE = 0;
var DEF_FONT_SIZE = 4;
var TAG_CORR = 5;
var TAG_ZINDEX = 900;
var TAG_ID_COUNTER = -1;
var TAG_CSS = "tag_inactive";
var TAG_EDIT_MODE = true;

//PinchLayer
var ENABLE_DRAG = true;
var PINCH_STEP = 20;
var PINCH_MIN = 0;
var PINCH_MAX = 2000;
var PINCH_LEVEL_RANGE = 400;
var PINCH_START_COLOR = new Array(0, 174, 255);

//DEBUG
var DEBUG_ON = false;
var DEBUG_PANEL = new DebugPanel();
var DEBUG_PINCH = false;
var DEBUG_INDEX = false;


// stores
var tagstore;

Ext.regModel('Tags', {fields: [{name: 'id'}, {name: 'tagname', type: 'string'}, ]});
tagstore = new Ext.data.Store
({
    model: 'Tags', 
    sorters: 'tagname',
    getGroupString: function(record) 
    {
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

// stores
var viewport_tagstore;

Ext.regModel('ViewportTags', {fields: [{name: 'id'}, {name: 'tagname', type: 'string'}, ]});
viewport_tagstore = new Ext.data.Store
({
    model: 'Tags', 
    sorters: 'tagname',
    getGroupString: function(record) 
    {
        return record.get('tagname')[0];
    }, 
    data:
    [
        {tagname: 'Sports'},
    ]
});


var ARTICLES_DIV = new Array(40);
var ARTICLES_VIS = new Array(7);

/*
0 Politics
1 Sports
2 Music
3 Video
4 Games
5 Philosophy
6 Nonsense
*/