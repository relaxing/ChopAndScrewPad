var dropZone1, dropZone2;
var fileSelect1, fileSelect2;
var whichPlayer, reader;

function setup() {
  noCanvas();

  fileSelect1 = createFileInput(gotFile1, 'multiple');
  dropZone1 = createDiv('Drop files here for TT1');
  dropZone1.id('drop_zone1');

  fileSelect2 = createFileInput(gotFile2, 'multiple');
  dropZone2 = createDiv('Drop files here for TT2');
  dropZone2.id('drop_zone2');


  // event handlers for dropZone1
  dropZone1.dragOver(function() {
    this.style('background','#AAAAAA');
  });

  dropZone1.dragLeave(function() {
     // do nothing?
     console.log("LEAVING");
  });

  dropZone1.drop(gotFile1, dropped);


  // event handlers for dropZone2
  dropZone2.dragOver(function() {
    this.style('background','#AAAAAA');
  });

  dropZone2.dragLeave(function() {
     // do nothing?
     console.log("LEAVING");
  });

  dropZone1.drop(gotFile2, dropped);

}


function dropped() {
  this.style('background','');
}

function gotFile1(file) {
  whichPlayer = player1;
  if (file.type === 'audio') {
    // console.log(file.file);
    loadBlob(file.file);
    // player1.load(file.file, function(e) {console.log(e)});
  } else {
    console.log('not a valid audio file');
  }
}

function gotFile2(file) {
  whichPlayer = player2;
  if (file.type === 'audio') {
    // console.log(file.file);
    loadBlob(file.file);
    // player1.load(file.file, function(e) {console.log(e)});
  } else {
    console.log('not a valid audio file');
  }
}

function loadBlob(file) {
  var reader = new FileReader();
  reader.addEventListener('load', loadSoundSuccess);
  reader.addEventListener('error', loadSoundError);
  reader.readAsArrayBuffer(file);
}

loadSoundSuccess = function(s) {
  var arrayBuffer = s.target.result;
  decodeArrayBuffer(arrayBuffer);

  // remove event listeners and clear the FileReader
  try{
    reader.removeEventListener('load', self.loadSoundSuccess);
    reader.removeEventListener('error', self.loadSoundError);
    reader = undefined;
  } catch(e){};
};

loadSoundError = function(e) {
  console.log('Error decoding audio: ' + e.message);

  // remove event listeners and clear the FileReader
  try{
    reader.removeEventListener('load', self.loadSoundSuccess);
    reader.removeEventListener('error', self.loadSoundError);
    reader = undefined;
  } catch(e){};
};

decodeArrayBuffer = function(arrayBuffer) {
  Tone.context.decodeAudioData(arrayBuffer,
    function(audioBuffer) {
      var soundBuffer = audioBuffer;
      whichPlayer._buffer._buffer = soundBuffer;
      whichPlayer.stop();
      whichPlayer.start();
    },
    function(error) {
      console.log('Error decoding audio: ' + error.message);
    }
  );
};