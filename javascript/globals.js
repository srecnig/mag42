/**
 *GLOBALS 
 */
//MATH
var PI = Math.PI;

//TagPanel
var ORIGIN = new Object(); ORIGIN.x = 0; ORIGIN.y = 0;
var MAX_FONT_SIZE = 16;
var MIN_FONT_SIZE = 0;
var DEF_FONT_SIZE = 4;
var TAG_CORR = 5;
var TAG_ZINDEX = 900;
var TAG_ID_COUNTER = -1;
var TAG_CSS = "tag_inactive";

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
