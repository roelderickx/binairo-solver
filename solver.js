const PERMUTATION_THRESHOLD = 2;

function getOppositeColor(color) {
    if (color == 1) {
        return 2;
    }
    else if (color == 2) {
        return 1;
    }
    else {
        return 0;
    }
}

function checkCellVertical(cells, row, col) {
    if (row >= 2 && cells[row-1][col] > 0 &&
                cells[row-1][col] == cells[row-2][col]) {
        cells[row][col] = getOppositeColor(cells[row-1][col]);
    }
    else if (row < Game.puzzleHeight-2 && cells[row+1][col] > 0 &&
                cells[row+1][col] == cells[row+2][col]) {
        cells[row][col] = getOppositeColor(cells[row+1][col]);
    }
    else if (row >= 1 && row < Game.puzzleHeight-1 && cells[row-1][col] > 0 &&
                cells[row-1][col] == cells[row+1][col]) {
        cells[row][col] = getOppositeColor(cells[row-1][col]);
    }
    else {
        // no update done
        return false;
    }
    return true;
}

function checkCellHorizontal(cells, row, col) {
    if (col >= 2 && cells[row][col-1] > 0 &&
                cells[row][col-1] == cells[row][col-2]) {
        cells[row][col] = getOppositeColor(cells[row][col-1]);
    }
    else if (col < Game.puzzleWidth-2 && cells[row][col+1] > 0 &&
                cells[row][col+1] == cells[row][col+2]) {
        cells[row][col] = getOppositeColor(cells[row][col+1]);
    }
    else if (col >= 1 && col < Game.puzzleWidth-1 && cells[row][col-1] > 0 &&
                cells[row][col-1] == cells[row][col+1]) {
        cells[row][col] = getOppositeColor(cells[row][col-1]);
    }
    else {
        // no update done
        return false;
    }
    return true;
}

function countColorsNeeded(cells) {
    colorCount = [ cells.length, cells.length/2, cells.length/2 ];
    for (let i = 0; i < cells.length; i++) {
        colorCount[cells[i]]--;
    }
    return colorCount;
}

function verifyPermutationCorrectness(cells, permutation) {
    counter = 0;
    lastColor = -1;
    permutationIndex = 0;
    for (let i = 0; i < cells.length; i++) {
        cellColor = cells[i];
        if (cells[i] == 0) {
            cellColor = permutation[permutationIndex];
            permutationIndex++;
        }
        if (cellColor == lastColor) {
            counter++;
            if (counter > 2) {
                return false;
            }
        }
        else {
            counter = 1;
            lastColor = cellColor;
        }
    }
    return true;
}

function findCorrectPermutations(cells, amountBlack, amountWhite, permutation, correctPermutations) {
    if (amountBlack == 0 && amountWhite == 0) {
        if (verifyPermutationCorrectness(cells, permutation)) {
            // add a copy of the permutation
            correctPermutations.push(permutation.slice());
        }
    }

    // try black
    if (amountBlack > 0) {
        permutation.push(1);
        findCorrectPermutations(cells, amountBlack-1, amountWhite, permutation, correctPermutations);
        permutation.pop();
    }
    // try white
    if (amountWhite > 0) {
        permutation.push(2);
        findCorrectPermutations(cells, amountBlack, amountWhite-1, permutation, correctPermutations);
        permutation.pop();
    }
}

function checkRowVertical(cells, col) {
    columnCells = [];
    for (let row = 0; row < Game.puzzleHeight; row++) {
        columnCells.push(cells[row][col]);
    }
    colorCount = countColorsNeeded(columnCells);
    if (colorCount[1] == 0 && colorCount[2] > 0) {
        for (let row = 0; row < Game.puzzleHeight; row++) {
            if (cells[row][col] == 0) {
                cells[row][col] = 2;
            }
        }
    }
    else if (colorCount[1] > 0 && colorCount[2] == 0) {
        for (let row = 0; row < Game.puzzleHeight; row++) {
            if (cells[row][col] == 0) {
                cells[row][col] = 1;
            }
        }
    }
    else if (colorCount[1] <= PERMUTATION_THRESHOLD || colorCount[2] <= PERMUTATION_THRESHOLD) {
        // arbitrary threshold to limit the amount of permutations
        
        updated = false;
        correctPermutations = [];
        findCorrectPermutations(columnCells, colorCount[1], colorCount[2], [], correctPermutations);
        
        // keep the cells which are consistently the same color in every correct permutation
        if (correctPermutations.length >= 1) {
            certainValues = correctPermutations[0];
            for (let i = 1; i < correctPermutations.length; i++) {
                for (let j = 0; j < correctPermutations[i].length; j++) {
                    if (certainValues[j] != 0 && certainValues[j] != correctPermutations[i][j]) {
                        certainValues[j] = 0;
                    }
                }
            }

            permutationCounter = 0;
            for (let row = 0; row < Game.puzzleHeight; row++) {
                if (cells[row][col] == 0) {
                    cells[row][col] = certainValues[permutationCounter];
                    updated = updated | certainValues[permutationCounter] > 0;
                    permutationCounter++;
                }
            }
        }

        return updated;
    }
    else {
        // no update done
        return false;
    }
    return true;
}

function checkRowHorizontal(cells, row) {
    rowCells = [];
    for (let col = 0; col < Game.puzzleWidth; col++) {
        rowCells.push(cells[row][col]);
    }
    colorCount = countColorsNeeded(rowCells);
    if (colorCount[1] == 0 && colorCount[2] > 0) {
        for (let col = 0; col < Game.puzzleWidth; col++) {
            if (cells[row][col] == 0) {
                cells[row][col] = 2;
            }
        }
    }
    else if (colorCount[1] > 0 && colorCount[2] == 0) {
        for (let col = 0; col < Game.puzzleWidth; col++) {
            if (cells[row][col] == 0) {
                cells[row][col] = 1;
            }
        }
    }
    else if (colorCount[1] <= PERMUTATION_THRESHOLD || colorCount[2] <= PERMUTATION_THRESHOLD) {
        // arbitrary threshold to limit the amount of permutations
        
        updated = false;
        correctPermutations = [];
        findCorrectPermutations(rowCells, colorCount[1], colorCount[2], [], correctPermutations);
        
        // keep the cells which are consistently the same color in every correct permutation
        if (correctPermutations.length >= 1) {
            certainValues = correctPermutations[0];
            for (let i = 1; i < correctPermutations.length; i++) {
                for (let j = 0; j < correctPermutations[i].length; j++) {
                    if (certainValues[j] != 0 && certainValues[j] != correctPermutations[i][j]) {
                        certainValues[j] = 0;
                    }
                }
            }

            permutationCounter = 0;
            for (let col = 0; col < Game.puzzleWidth; col++) {
                if (cells[row][col] == 0) {
                    cells[row][col] = certainValues[permutationCounter];
                    updated = updated | certainValues[permutationCounter] > 0;
                    permutationCounter++;
                }
            }
        }

        return updated;
    }
    else {
        // no update done
        return false;
    }
    return true;
}

/**************************************************************************************************/

if (Game.currentState.solved != 1) {
    updated = true;
    while (updated) {
        updated = false;

        for (let row = 0; row < Game.puzzleHeight; row++) {
            for (let col = 0; col < Game.puzzleWidth; col++) {
                if (Game.currentState.cellStatus[row][col] == 0) {
                    updated = updated | checkCellVertical(Game.currentState.cellStatus, row, col);
                    updated = updated | checkCellHorizontal(Game.currentState.cellStatus, row, col);
                }
            }
            updated = updated | checkRowHorizontal(Game.currentState.cellStatus, row);
        }

        for (let col = 0; col < Game.puzzleWidth; col++) {
            updated = updated | checkRowVertical(Game.currentState.cellStatus, col);
        }
    }

    Game.drawCurrentState();
    
    Game.checkFinished();
}

