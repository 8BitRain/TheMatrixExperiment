/*
* Credit:
* Challenges....
* Generate indiviudually colored streams
* Pause and Start a stream based on midi input.
*
*/

var stream;
var backgroundColor = [0, 255, -1];
var symbolSize = 21;
var streams = [];



function setup(){
  createCanvas(
    window.innerWidth,
    window.innerHeight
  );

  background(0);
  var x = 0;

  /*Stream Logic*/
  for(var i = 0; i <= width / symbolSize; i++){
    var stream= new Stream();
    stream.generateSymbols(x, random(-1000, 0));
    streams.push(stream);
    x += symbolSize;
  }
  textSize(symbolSize);

  //WebMIDI Control
  WebMidi.enable(function (err) { //check if WebMidi.js is enabled

  if (err) {
      console.log("WebMidi could not be enabled.", err);
    } else {
      console.log("WebMidi enabled!");
    }


  //Name visible MIDI input and output ports
  console.log("---");
  console.log("Inputs Ports: ");
  for(i = 0; i< WebMidi.inputs.length; i++){
     console.log(i + ": " + WebMidi.inputs[i].name);
  }

  console.log("---");
  console.log("Output Ports: ");
  for(i = 0; i< WebMidi.outputs.length; i++){
      console.log(i + ": " + WebMidi.outputs[i].name);
    }

  //Choose an input port
  inputSoftware = WebMidi.inputs[0];

  try {
    inputSoftware.addListener('noteon', "all",
      function (e) {
        //Show what we are receiving
        console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ") "+ e.note.number +".");
        //C6 + B5 B5 is pitch up C6 is pitch down
        if(e.note.name + e.note.octave == "B5"){
          backgroundColor[0] = 0;
          //backgroundColor[1] = 255;
          //Bleed Reverse
          backgroundColor[2] = -1
        }
        if(e.note.name + e.note.octave == "C6"){
          backgroundColor[0] = 0;
          //backgroundColor[1] = 50;
          //Bleed Start
          backgroundColor[2] = 1
        }

      });
  } catch(err){
    console.log("Error: " +  err);
  }
  });

  //An instance of a symbol
  /*symbol = new Symbol(
    width / 2,
    0,
    random(5, 10)
  );
  symbol.setToRandomSymbol();
  textSize(symbolSize);
  */
}

function draw(){
  //I want to oscillate between high opacity and low opacity
  this.bleedInterval = 30;
  //Bleed Start
  if(backgroundColor[2] == 1 && backgroundColor[1] >= 0){
    backgroundColor[1] = backgroundColor[1] - 3
  }

  //Bleed Reverse
  if(backgroundColor[2] == -1 && backgroundColor[1] <= 255){
    backgroundColor[1] = backgroundColor[1] + 1;
  }
  console.log("Background Opacity: " + backgroundColor[1]);
  background(backgroundColor[0], backgroundColor[1]);
  streams.forEach(function(stream){
    stream.render();
  });
}

function Symbol(x, y, speed, first){
  this.x = x;
  this.y = y;
  this.value;
  this.speed = speed;
  this.switchInterval = round(random(2, 20));
  this.first = first;

  this.setToRandomSymbol = function(){
    //If the frame count is an even number if a modulo (%) returns 0, the number is even
    if (frameCount % this.switchInterval == 0){
      //Create a random symbol
      this.value = String.fromCharCode(
        0x30A0 + round(random(0, 96))
      );
    }
  }

  this.render = function(){
    fill(0, 255, 70);
    text(this.value, this.x, this.y);
    this.rain();
    this.setToRandomSymbol();
  }

  this.rain = function (){
    this.y = (this.y >= height) ? 0 : this.y += this.speed;
  }
}

function Stream(){
  this.symbols = [];
  this.totalSymbols = round(random(5, 30));
  this.speed = random(5, 8);

  this.generateSymbols = function(x, y){
    var first = round(random(0, 1)) == 1;
    for (var i = 0; i <= this.totalSymbols; i++){
      symbol = new Symbol(x, y, this.speed, first);
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      //This sets the symbol under the current symbol.
      y -= symbolSize;
      first = false;
    }
  }

  this.render = function(){
    var R = random(0, 255);
    var G = random(0, 255);
    var B = random(0, 255);
    this.symbols.forEach(function(symbol){
      if (symbol.first){
        fill(180, 255, 180);
        //console.log("Works");
      } else {
        //fill(0, 255, 70);
        fill(R, G, B);
      }
      text(symbol.value, symbol.x, symbol.y);
      symbol.rain();
      symbol.setToRandomSymbol();
    });
  }
}
