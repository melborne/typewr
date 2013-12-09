var TYPEWR = {};
TYPEWR.pos = [0, 0];
TYPEWR.ELEM_WIDTH = 30;
TYPEWR.LINE_HEIGHT = 35;
TYPEWR.maxWidth = function() { return $(window).width(); };
TYPEWR.elements = [];
TYPEWR.color = '#FFCC00'
var TOP = Math.floor($(window).height() / 10);
var LEFT = Math.floor($(window).width() / 10);
var SPACE_KEY = 32, BS_KEY = 8, RET_KEY = 13;

var YOUR_COLOR = sample(["#FFCC00", "#C71585", "#4169E1", "#32CD32", "#FF1493", "#006400", "#D2691E", "#191970", "#800080"]);

function sample (array) {
  return array[Math.floor(Math.random() * array.length)];
}

function lineFeed (obj) {
  var y = obj.pos[1] + obj.LINE_HEIGHT;
  obj.pos = [0, y];
  return;
}

function backSpace (obj) {
  var last = obj.elements.pop();
  if (last) {
    obj.pos = last.pos;
    last.elem.animate({'top':0, 'left':0}, function() {this.remove()} );
  };
  return;
}

function typeAKey (obj, keycode, left, top, color) {
  var element = $('.'+keycode+':first').clone();
  var pos = [obj.pos[0], obj.pos[1]];
  obj.elements.push({elem: element, pos: pos});
  element.appendTo('body').animate({
    'top': top,
    'left': left
  }, function() { $(this).css('color', color) });
}

TYPEWR.type = function(keycode, color) {
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
      typeAKey(this, keycode, left, top, color);
      this.pos[0] += this.ELEM_WIDTH;
      if (max <= left+LEFT) { lineFeed(this) };
  }
};

$(window).keypress(function(e) {
  // TYPEWR.type(e.which);
  var keycode = e.which;
  ws.send(JSON.stringify({keycode: keycode, color: YOUR_COLOR}));
})

var ws = new WebSocket(location.origin.replace(/^http/, 'ws'));

ws.onmessage = function(msg) {
  var data = JSON.parse(msg.data);
  TYPEWR.type(data.keycode, data.color);
};
