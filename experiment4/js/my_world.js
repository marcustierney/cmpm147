"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

let islandCenter;


function p3_preload() {}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed); 
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};


function p3_tileClicked(i, j) {
  let key = [i + 1, j + 1];
  clicks[key] = millis(); //record time of click
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();
  push();
  
  let isRock = false;

  let islandNoise = noise(i * 0.05, j * 0.05);

  if (islandNoise < 0.6) { 
      isRock = true;
  }
  
  let r = 30 + random(10, 20);
  let g = 80 + random(10, 20);
  let b = 180 + random(10, 20);
  
  let surfaceColor = color(r, g, b);
  let side1Color = color("#005A82");
  let side2Color = color("#00466E");
  let bottomColor = color("#003C64");
  

  let time = millis() * 0.0002;
  let heightNoise;
  if (isRock == true) {
    heightNoise = noise(i * 3, j * 3);
  }
  else {
    heightNoise = noise(i * 0.2, j * 0.2, time);
  }
  let tileHeight = map(heightNoise, 0, 1, 0, 50);
  
  let splash = clicks[[i, j]];
  if (splash != undefined && !isRock) {
      tileHeight = 50;
      surfaceColor = color("#6F4E37");
      side1Color = color("#6F4E37");
      side2Color = color("#6F4E37");
      bottomColor = color("#6F4E37");
  } 
  if (isRock) {
    //surfaceColor = color("#008000");
    let gray = map(noise(i * 10, j * 10), 0, 1, 80, 160);
    surfaceColor = color(gray);
    side1Color = color("#818589");
    side2Color = color("#B2BEB5");
    bottomColor = color("#808080");
  } 
  fill(surfaceColor);
  beginShape(); //top of tile
  vertex(-tw, -tileHeight);
  vertex(0, th - tileHeight);
  vertex(tw, -tileHeight);
  vertex(0, -th - tileHeight);
  endShape(CLOSE);
  
  fill(side1Color); //side color 1
  beginShape(); //side 1
  vertex(-tw, 0);
  vertex(-tw, -tileHeight);
  vertex(0, th - tileHeight);
  vertex(0, th);
  endShape(CLOSE);
  
  fill(side2Color); //side color 2
  beginShape(); //side 2
  vertex(tw, 0);
  vertex(tw, -tileHeight);
  vertex(0, th - tileHeight);
  vertex(0, th);
  endShape(CLOSE);
  
  fill(bottomColor); //bottom color 
  beginShape(); //bottom of tile
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  
  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}
