let tileSize = 32;
let camX = 0;
let camY = 0;
let speed = 5;
let tileInfoP;
let nightMode = true;

let tileCache = {};
let streetSpacingCacheX = {};
let streetSpacingCacheY = {};

let reseedButton;

function setup() {
  createCanvas(800, 600);
  reseedWorld();

  reseedButton = createButton("Reseed City");
  reseedButton.position(10, 10);
  reseedButton.mousePressed(reseedWorld);

  tileInfoP = createP("Click a tile to see info.");
  tileInfoP.position(10, 630);
  
  nightModeText = createP("Click N to change time of day.");
  nightModeText.position(110, -4);
}

function draw() {
  handleInput();

  // Background for day/night
  if (nightMode) {
    background(10, 10, 30); // dark night sky
  } else {
    background(135, 206, 235); // daytime sky blue
  }

  let cols = ceil(width / tileSize) + 2;
  let rows = ceil(height / tileSize) + 2;
  let startX = floor(camX / tileSize) - 1;
  let startY = floor(camY / tileSize) - 1;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let worldX = startX + x;
      let worldY = startY + y;
      let tile = getTileAt(worldX, worldY);
      drawTile(tile, worldX * tileSize - camX, worldY * tileSize - camY);
    }
  }
}

function handleInput() {
  if (keyIsDown(LEFT_ARROW)) camX -= speed;
  if (keyIsDown(RIGHT_ARROW)) camX += speed;
  if (keyIsDown(UP_ARROW)) camY -= speed;
  if (keyIsDown(DOWN_ARROW)) camY += speed;
}

function keyPressed() {
  if (key === 'n' || key === 'N') {
    nightMode = !nightMode;
  }
}

function getStreetSpacingForChunk(coord, cache) {
  if (cache[coord] !== undefined) return cache[coord];
  let spacing = floor(random(4, 8));
  cache[coord] = spacing;
  return spacing;
}

function mousePressed() {
  if (mouseY > height) return;

  let tileX = floor((mouseX + camX) / tileSize);
  let tileY = floor((mouseY + camY) / tileSize);
  let tile = getTileAt(tileX, tileY);

  let label = "Unknown Tile";

  if (tile.type === 'street') {
    label = "Road Tile";
  } else if (tile.type === 'park') {
    label = "Park Tile";
  } else if (tile.type === 'parking') {
    label = "Parking Lot Tile";
  } else if (tile.type === 'building') {
    switch (tile.buildingType) {
      case 1: label = "Blue Building Tile"; break;
      case 2: label = "Red Building Tile"; break;
      case 3: label = "Green Building Tile"; break;
      case 4: label = "Yellow Building Tile"; break;
      default: label = "Building Tile"; break;
    }
    label += `. This building was built in ${tile.yearBuilt}.`;
  } else if (tile.type === 'courtyard') {
    label = "Courtyard Tile";
  }

  tileInfoP.html(`Tile Information: <strong>${label}</strong>`);
}

function getTileAt(x, y) {
  let key = `${x},${y}`;
  if (tileCache[key]) return tileCache[key];

  let chunkSize = 50;
  let chunkX = floor(x / chunkSize);
  let chunkY = floor(y / chunkSize);

  let spacingX = getStreetSpacingForChunk(chunkX, streetSpacingCacheX);
  let spacingY = getStreetSpacingForChunk(chunkY, streetSpacingCacheY);

  let localX = x - chunkX * chunkSize;
  let localY = y - chunkY * chunkSize;

  if (localX % spacingX === 0 || localY % spacingY === 0) {
    tileCache[key] = { type: 'street' };
    return tileCache[key];
  }

  let blockX = floor(localX / spacingX);
  let blockY = floor(localY / spacingY);
  let blockSeedX = chunkX * 1000 + blockX;
  let blockSeedY = chunkY * 1000 + blockY;
  let baseNoise = noise(blockSeedX * 0.1, blockSeedY * 0.1);

  let blockType = "building";
  if (baseNoise < 0.1) blockType = "park";
  else if (baseNoise < 0.2) blockType = "parking";

  let clusterSeed = noise(blockSeedX * 0.2 + 100, blockSeedY * 0.2 + 100);
  let localSeed = noise(x * 0.3 + clusterSeed * 100, y * 0.3 + clusterSeed * 100);

  let clusterThreshold = 0.6;
  if (blockType === "building" && localSeed < clusterThreshold) {
    tileCache[key] = { type: "courtyard" };
  } else {
    let buildingType = floor(baseNoise * 4) + 1;
    let yearBuilt = floor(map(noise(x * 0.15, y * 0.15), 0, 1, 1950, 2021));
    let height = floor(map(yearBuilt, 1950, 2020, 1, 5));
    tileCache[key] = {
      type: blockType,
      buildingType: buildingType,
      yearBuilt: yearBuilt,
      height: height
    };
  }

  return tileCache[key];
}

function drawTile(tile, x, y) {
  noStroke();

  if (tile.type === 'street') {
    fill(nightMode ? 30 : 50);
    rect(x, y, tileSize, tileSize);

    if (nightMode) {
      fill(255, 255, 100, 150);
      ellipse(x + tileSize / 2, y + tileSize / 2, 4, 4);
    }

  } else if (tile.type === 'building') {
    let baseColor = color(150, 150, 150);
    if (tile.buildingType === 1) baseColor = color(0, 0, 255);
    else if (tile.buildingType === 2) baseColor = color(255, 0, 0);
    else if (tile.buildingType === 3) baseColor = color(0, 255, 0);
    else if (tile.buildingType === 4) baseColor = color(255, 255, 0);

    let h = tile.height || 2;
    let shadowOffset = h * 4;

    let wallColor = lerpColor(baseColor, color(0), 0.2);
    if (nightMode) {
      baseColor.setAlpha(180);
      wallColor.setAlpha(120);
    }

    fill(wallColor);
    rect(x, y - shadowOffset, tileSize, tileSize + shadowOffset);

    fill(baseColor);
    rect(x, y - shadowOffset, tileSize, tileSize);


  } else if (tile.type === 'park') {
    fill(nightMode ? color(20, 60, 20) : color(34, 139, 34));
    rect(x, y, tileSize, tileSize);
  } else if (tile.type === 'parking') {
    fill(nightMode ? 80 : 200);
    rect(x, y, tileSize, tileSize);
    stroke(255);
    strokeWeight(1);
    for (let i = 4; i < tileSize; i += 8) {
      line(x + i, y + 2, x + i, y + tileSize - 2);
    }
    noStroke();
  } else if (tile.type === 'courtyard') {
    fill(nightMode ? 60 : color(180, 180, 160));
    rect(x, y, tileSize, tileSize);
  }
}

function reseedWorld() {
  tileCache = {};
  streetSpacingCacheX = {};
  streetSpacingCacheY = {};
  let newSeed = floor(random(100000));
  noiseSeed(newSeed);
  console.log("New city noiseSeed:", newSeed);
}