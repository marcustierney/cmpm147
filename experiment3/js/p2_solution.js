/* exported generateGrid, drawGrid */
/* global placeTile */


function generateGrid(numCols, numRows) {
    let grid = [];
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        row.push("_");
      }
      grid.push(row);
    }
    
    let top = floor(random(2, numRows / 2));
    let bottom = floor(random(numRows / 2 + 1, numRows - 2));
    let left = floor(random(2, numCols / 2));
    let right = floor(random(numCols / 2 + 1, numCols - 2));
    
    for (let x = top; x <= bottom; x++) {
      for (let y = left; y <= right; y++) {
        grid[x][y] = ".";
      }
    }
    
    grid[top][left] = "X";
    grid[top][right] = "X";
    grid[bottom][right] = "X";
    grid[bottom][left] = "X";
    
   
    let TdoorI = top;
    let TdoorJ = floor(random(left + 1, right));
    grid[TdoorI][TdoorJ] = "D";
    
    let BdoorI = bottom;
    let BdoorJ = floor(random(left + 1, right));
    grid[BdoorI][BdoorJ] = "D";
    
    let LdoorI = floor(random(top + 1, bottom));
    let LdoorJ = left;
    grid[LdoorI][LdoorJ] = "D";
    
    
    let RdoorI = floor(random(top + 1, bottom));
    let RdoorJ = right;
    grid[RdoorI][RdoorJ] = "D";
    
    let chestI = floor(random(top + 1, bottom));
    let chestJ = floor(random(left + 1, right));
    grid[chestI][chestJ] = "C";
    
    for (let x = 0; x < TdoorI; x++) {
      grid[x][TdoorJ] = "P";
    }
    
    for (let x = BdoorI + 1; x < numRows; x++) {
      grid[x][BdoorJ] = "P";
    }
    
    for (let y = 0; y < LdoorJ; y++) {
      grid[LdoorI][y] = "P";
    }
    
    for (let y = RdoorJ + 1; y < numRows; y++) {
      grid[RdoorI][y] = "P";
    }
    
    return grid;
  }
  
  
  
  function drawGrid(grid) {
    background(128);
  
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] == '_') {
          placeTile(i, j, (floor(random(10, 12))), floor(random(18, 20)));
        } else if (grid[i][j] == ".") {
          drawContext(grid, i, j, ".", 12, 23);
        } else if (grid[i][j] == "D") {
          placeTile(i, j, 27, 27);
        } else if (grid[i][j] == "C") {
          placeTile(i, j, 5, 30);
        } else if (grid[i][j] == "P") {
          placeTile(i, j, 28, 24);
        } else if (grid[i][j] == "X") {
          placeTile(i, j, 18, 24);
        }
      }
    }
  }
  
  
  function gridCheck(grid, i, j, target) {
    if ( i < 0 || j < 0 || i >= grid.length || grid[0].length) {
      return false;
    }
    return grid[i][j] == target;
  }
  
  function gridCode(grid, i, j, target) {
    let northBit = gridCheck(grid, i - 1, j, target) ? 1 : 0;
    let southBit = gridCheck(grid, i + 1, j, target) ? 1 : 0;
    let eastBit = gridCheck(grid, i, j + 1, target) ? 1 : 0;
    let westBit = gridCheck(grid, i, j - 1, target) ? 1 : 0;  
        
    return (northBit<<0)+(southBit<<1)+(eastBit<<2)+(westBit<<3);
  }
  
  const lookup = [
    [0,0],
    [1,0],
    [2,0],
    [3,0],
    [0,1],
    [1,1],
    [2,1],
    [3,1],
    [0,2],
    [1,2],
    [2,2],
    [3,2],
    [0,3],
    [1,3],
    [2,3],
    [3,3]
  ];
  
  function drawContext(grid, i, j, target, dti, dtj) {
    let code = gridCode(grid, i, j, target);
    let coords = lookup[code];
    if (coords) {
      placeTile(i, j, dti + coords[0], dtj + coords[1]);
    }
    else {
      placeTile(i, j, dti, dtj);
    }
  }
  
  