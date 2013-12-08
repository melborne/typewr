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

TYPEWR.type = function(keycode) {
  var left = LEFT + this.pos[0];
  var top  = TOP  + this.pos[1];
  var max = this.maxWidth();
  if (max <= left+LEFT || keycode==RET_KEY) {
    this.pos = [ 0, this.pos[1]+this.ELEM_HEIGHT+5 ];
    return;
  };
  if (keycode==BS_KEY) {
    var last = this.elements.pop();
    this.pos = last.pos;
    last.elem.animate({'top':0, 'left':0}, function() {this.remove()} );
    return;
  };
  if (!(keycode==SPACE_KEY)) {
    var element = $('.'+keycode+':first').clone();
    var pos = [this.pos[0], this.pos[1]];
    this.elements.push({elem: element, pos: pos});
    element.appendTo('body').animate({
      'top': top,
      'left': left
    }, function() { $(this).css('color', '#F44') });
  };

  this.pos[0] += this.ELEM_WIDTH;
};

$(window).keypress(function(e) {
  TYPEWR.type(e.which);
})
