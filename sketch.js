/*
* Credit:
* Challenges....
* Generate indiviudually colored streams
* Pause and Start a stream based on midi input.
*
*/

var stream;
var symbolSize = 21;
var streams = [];

function setup(){
  createCanvas(
    window.innerWidth,
    window.innerHeight
  );

  background(0);
  var x = 0;

  for(var i = 0; i <= width / symbolSize; i++){
    var stream= new Stream();
    stream.generateSymbols(x, random(-1000, 0));
    streams.push(stream);
    x += symbolSize;
  }
  textSize(symbolSize);

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
  background(0, 135);
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
        console.log("Works");
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
