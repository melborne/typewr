var audio_ext = (function() {
  var audio = new Audio();
  var ext;
  if (audio.canPlayType('audio/mp3')=='maybe') { ext = 'mp3' }
  else if (audio.canPlayType('audio/ogg')=='maybe') { ext = 'ogg' };
  return ext;
})();

var Sound = {};
var context = new AudioContext();
Sound.gainNode = context.createGain();
Sound.gainNode.gain.value = 0.25;

Sound.play = function(urls) {
  var source = context.createBufferSource();
  var bufferLoader = new BufferLoader(
    context,
    urls,
    finishedLoading
    );
  bufferLoader.load();
};

function finishedLoading(bufferList) {
  for (var i=0; i < bufferList.length; i++) {
    var source = this.context.createBufferSource();
    source.buffer = bufferList[i];
    source.connect(Sound.gainNode);
    Sound.gainNode.connect(this.context.destination)
    source.start(0);
    this.source = source;
  }
}

Sound.volume = function(element) {
  var fraction = parseInt(element.value) / parseInt(element.max);
  this.gainNode.gain.value = fraction * fraction;
};
