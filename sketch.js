// Refactored

let grid = [];
const gridRows = 40;
const gridCols = 40;
// const gridSize = 20;
const gridSize = 18;


const gridMargin = 14;
const dead = 0;
const live = 1;
const colorDead = 'white';
const colorLive = 'black';
const doTesting = false;

let initializeFunction = function() { return floor(random(2)); }

function setup() {
    // createCanvas(gridSize * gridRows + (2 * gridMargin), gridSize * gridCols + (2 * gridMargin));
    createCanvas(375 * 2, 667 * 2);
    frameRate(15);
    grid = CalculatorInitialGeneration(grid, gridRows, gridCols, initializeFunction, doTesting);
}

function draw() {
    background(128);
    paintLattice(grid, gridRows, gridCols, gridSize, gridMargin, true);
    grid = calculateNextGeneration(grid, gridRows, gridCols, doTesting);
}

// Initializes 2D array.
function CalculatorInitialGeneration(grid, rows, cols, initFunc, testing) {
    for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
            grid[r][c] = initFunc();
        }
    }
    if (testing) { grid = overrideRandomGridForTesting(grid, rows, cols); }
    return grid;
}

function overrideRandomGridForTesting(grid, rows, cols) {


    for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
            grid[r][c] = dead;
        }
    }

    grid[4][4] = live;
    grid[4][5] = live;
    grid[5][4] = live;
    grid[5][5] = live;

    grid[20][1] = live;
    grid[20][2] = live;
    grid[20][3] = live;

    grid[20][6] = live;
    grid[21][7] = live;
    grid[19][8] = live;
    grid[20][8] = live;
    grid[21][8] = live;

    return grid;
}


function paintLattice(grid, rows, cols, size, margin, showGrid) {
    if (showGrid) {
        stroke(128);
        strokeWeight(1);
    } else {
        noStroke()
    };

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] == 0) {
                fill(colorDead);
            } else {
                fill(colorLive);
            }
            rect(r * size + margin, c * size + margin, size, size);
        }
    }
}

// Counts the live neighbors of a square.
function count_live_neighbors(grid, row, col) {
    let count = 0;

    for (let r = -1; r < 2; r++) {
        for (let c = -1; c < 2; c++) {
            count += grid[(row + r + gridRows) % gridRows][(col + c + gridCols) % gridCols];
        }
    }
    count -= grid[row][col];
    return count;
}


function calculateNextGeneration(grid, rows, cols) {
    let gridUpdate = [];

    for (let r = 0; r < rows; r++) {
        gridUpdate[r] = [];
        for (let c = 0; c < cols; c++) {
            currentCell = grid[r][c];
            neighbors = count_live_neighbors(grid, r, c);

            /*  RULES - Conway's Game of Life
                ----------------------------
                Births: Each dead cell adjacent to exactly three live neighbors will
                become live in the next generation. 
                  
                Death by isolation: Each live cell with one or fewer live neighbors
                will die in the next generation.
                  
                Death by overcrowding: Each live cell with four or more live neighbors
                will die in the next generation.
                  
                Survival: Each live cell with either two or three live neighbors
                will remain alive for the next generation.
                */

            if (currentCell == dead && neighbors == 3) {
                // BIRTH
                gridUpdate[r][c] = live;
            } else if (currentCell == live && neighbors <= 1) {
                // ISOLATION
                gridUpdate[r][c] = dead;
            } else if (currentCell == live && neighbors >= 4) {
                // OVERCROWDING
                gridUpdate[r][c] = dead;
            } else {
                gridUpdate[r][c] = currentCell;
            }

        }
    }
    return gridUpdate;
}