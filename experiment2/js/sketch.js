// sketch.js - purpose and description here
// Author: Marcus Tierney
// Date: 4/14/2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

let seed = 0;

const grassColor = "#5a5e00";
const stoneColor = "#33330b";
const treeColor = "#191801";
const hillColor = "#505109"; 
const hill2Color = "#636807"; 

$("#reimagine").click(function() {
  seed++;
});

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

function setup() {  
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent('canvas-container');
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}



function draw() {
  randomSeed(seed);

  background(100);

  noStroke();

  //skycoloring
  for (let y = 0; y < height / 2; y++) {
    let inter = map(y, 0, height / 2, 0, 1);
    let c = lerpColor(color("#6b7871"), color("#ffb347"), inter); 
    stroke(c);
    line(0, y, width, y);
  }
  noStroke;

  let sunX = width - 10;
  let sunY = height / 2 - 10;
  let sunRadius = 40;
  
  noStroke();
  fill(255, 180, 0, 200);
  ellipse(sunX, sunY, sunRadius, sunRadius);
  
  fill(grassColor);
  rect(0, height / 2, width, height / 2);
  noStroke();
  
  fill(hillColor); //Hill One
  beginShape();
  vertex(0, height / 2 + int(random(30, 80)));
  vertex(width, height);
  vertex(width, height / 2);
  endShape(CLOSE);
  
  fill(hill2Color); //Hill 2
  beginShape();
  vertex(width , height);
  vertex(0, height);
  vertex(0, height / 2 + int(random(20, 40)));
  vertex(width, height - 20);
  endShape(CLOSE);
  
  fill(stoneColor);
  beginShape();
  vertex(0, height / 2);
  const steps = 30;
  for (let i = 0; i < steps + 1; i++) {
    let x = (width * i) / steps;
    let y =
      height / 2 - random() * 5;
    vertex(x, y);
  }
  vertex(width, height / 2);
  endShape(CLOSE);

  fill(treeColor);
  const trees = 50*random();
  const scrub = mouseX/width;
  for (let i = 0; i < trees; i++) {
    let z = random();
    if (z < 0.7) {
      continue; 
    }
    let x = random(width);
    let s = width / 50 / z;
    let y = height / 2 + height / 20 / z;
    triangle(x, y - s, x - s / 4, y, x + s / 4, y);
  }
  
  let cloudCount = int(random(3, 7)); //clouds
  const cloudScrub = mouseX / width;

  for (let i = 0; i < cloudCount; i++) {
    let z = random();
    let x = width * ((random() + (cloudScrub / 40 + millis() / 500000.0) / z) % 1);
    let y = random(20, height / 3);
    let cloudSize = random(60, 80);
    
    let base = int(random(170, 200));
    let r = base + int(random(10, 30));
    let g = base - int(random(0, 10));
    let b = base - int(random(5, 15));
    fill(r, g, b, 220);
    noStroke();
    
    ellipse(x, y, cloudSize, cloudSize * 0.6);
    ellipse(x + cloudSize * 0.4, y + 2, cloudSize * 0.8, cloudSize * 0.5);
    ellipse(x - cloudSize * 0.4, y + 2, cloudSize * 0.8, cloudSize * 0.5);
  }
  
}
