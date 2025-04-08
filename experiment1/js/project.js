// project.js - main file for Experiment 01
// Author: Marcus Tierney
// Date: 4/7/25

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
const fillers = { 
  cowtype: ["Holstein Friesian", "Hereford Cattle", "Simmental Cattle", "Aberdeen Angus", "Limousin Cattle", "Belgian Blue", "Belted Galloway", "Red Angus"],
  farmer: ["crop", "livestock", "mixed", "dairy", "poultry", "aquaculture", "apiculture", "rancher"],
  tool: ["shovel", "rake", "hoe", "shear", "bucket", "wheelbarrow", "axe", "ladder", "sickle"],
  vehicle: ["tractor", "truck", "wagon", "atv", "utv"],
  vegetable: ["lettuce", "spinach", "kale", "carrots", "potato", "onion", "tomato", "cucumber", "squash", "zucchini", "broccoli", "cabbage", "celery", "garlic"],
  fruit: ["orange", "grapefruit", "peach", "plum", "cherry", "strawberry", "blueberry", "banana", "raspberry", "apple", "pear", "watermelon", "mango", "grape"],
  sounds: ["moo", "mmmoooo", "hmoo", "chomp", "yawn", "snork"]
};

const template = `$cowtype is the species in the $farmer farm

The farmer used the $tool to help the livestock prosper with the help of the $vehicle to move around. 

Many amounts of $vegetable and $fruit were planted, and the cows exclaimed $sounds in response!`;

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  $("#box").text(story);
}

/* global clicker */
$("#clicker").click(generate);

generate();
