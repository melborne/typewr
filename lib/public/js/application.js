var TYPEWR = {};
TYPEWR.pos = [0, 0];
TYPEWR.ELEM_WIDTH = 30;
TYPEWR.ELEM_HEIGHT = 30;
TYPEWR.maxWidth = function() { return $(window).width(); };
TYPEWR.elements = [];
TYPEWR.color = '#FFCC00'
var TOP = 100;
var LEFT = 100;
var SPACE_KEY = 32;
var BS_KEY = 8;
var RET_KEY = 13;

function lineFeed (obj) {
  var y = obj.pos[1] + obj.ELEM_HEIGHT + 5;
  obj.pos = [0, y];
  return;
}

function backSpace (obj) {
  var last = obj.elements.pop();
  obj.pos = last.pos;
  last.elem.animate({'top':0, 'left':0}, function() {this.remove()} );
  return;
}

function typeKey (obj, keycode, left, top) {
  var element = $('.'+keycode+':first').clone();
  var pos = [obj.pos[0], obj.pos[1]];
  obj.elements.push({elem: element, pos: pos});
  element.appendTo('body').animate({
    'top': top,
    'left': left
  }, function() { $(this).css('color', '#F44') });
}

TYPEWR.type = function(keycode) {
  var left = LEFT + this.pos[0];
  var top  = TOP  + this.pos[1];
  var max = this.maxWidth();

  switch (keycode) {
    case RET_KEY:
      lineFeed(this);
      break;
    case BS_KEY:
      backSpace(this);
      break;
    case SPACE_KEY:
      this.pos[0] += this.ELEM_WIDTH;
      break;
    default:
      if (max <= left+LEFT) { return lineFeed(this) };
      typeKey(this, keycode, left, top);
      this.pos[0] += this.ELEM_WIDTH;
  }
};

$(window).keypress(function(e) {
  TYPEWR.type(e.which);
})
