/* exported getInspirations, initDesign, renderDesign, mutateDesign */


function getInspirations() {
  return [
    {
      name: "Tank-Man", 
      assetUrl: "https://cdn.glitch.global/6bcba4c5-5de0-42dc-985c-18b291140590/Tank-Man.jpg?v=1746687079923",
      credit: "Tiananmen Square, 1989"
    },
    {
      name: "Cow", 
      assetUrl: "https://cdn.glitch.global/6bcba4c5-5de0-42dc-985c-18b291140590/Cow.jpg?v=1746686676669",
      credit: "Image of Cow"
    },
    {
      name: "MLK", 
      assetUrl: "https://cdn.glitch.global/6bcba4c5-5de0-42dc-985c-18b291140590/MLK.jpg?v=1746687586277",
      credit: "Martin Luther King Jr., Washington, D.C., 1963"
    },
    {
      name: "911", 
      assetUrl: "https://cdn.glitch.global/6bcba4c5-5de0-42dc-985c-18b291140590/911.jpg?v=1746687907818",
      credit: "New York City, 2001"
    },
  ];
}

function initDesign(inspiration) {
  resizeCanvas(inspiration.image.width / 5, inspiration.image.height / 5);

  let design = {
    bg: 128,
    fg: []
  };

  for (let i = 0; i < 70; i++) {
    design.fg.push({
      x: random(width),
      y: random(height),
      w: random(width / 2),
      h: random(height / 2),
      fill: random(255),
      shape: random(["rect", "ellipse", "triangle"])
    });
  }

  return design;
}


function renderDesign(design) {
  background(design.bg);
  noStroke();
  for (let box of design.fg) {
    fill(box.fill, 128);
    switch (box.shape) {
    case "rect":
      rect(box.x, box.y, box.w, box.h);
      break;
    case "ellipse":
      ellipse(box.x + box.w / 2, box.y + box.h / 2, box.w, box.h);
      break;
    case "triangle":
      triangle(box.x, box.y,
        box.x + box.w, box.y,
        box.x + box.w / 2, box.y - box.h);
      break;
    }
  }
}


function mutateDesign(design, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  for(let box of design.fg) {
    box.fill = mut(box.fill, 0, 255, rate);
    box.x = mut(box.x, 0, width, rate);
    box.y = mut(box.y, 0, height, rate);
    box.w = mut(box.w, 0, width/2, rate);
    box.h = mut(box.h, 0, height/2, rate);
  }
}


function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}