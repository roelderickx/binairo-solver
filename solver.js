const PERMUTATION_THRESHOLD = 4;

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

function compareClue(clue, directionEquality) {
    return (clue & directionEquality) == directionEquality;
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

function checkCluesVertical(cells, clues, row, col) {
    updated = false;
    if (row >= 3 && cells[row][col] > 0 &&
                cells[row-1][col] == 0 && cells[row-2][col] == 0 &&
                compareClue(clues[row-2][col], Game.FLAG_DOWN_EQ)) {
        cells[row-1][col] = getOppositeColor(cells[row][col]);
        cells[row-2][col] = getOppositeColor(cells[row][col]);
        updated = true;
    }
    else if (row < Game.puzzleHeight-3 && cells[row][col] > 0 &&
                cells[row+1][col] == 0 && cells[row+2][col] == 0 &&
                compareClue(clues[row+1][col], Game.FLAG_DOWN_EQ)) {
        cells[row+1][col] = getOppositeColor(cells[row][col]);
        cells[row+2][col] = getOppositeColor(cells[row][col]);
        updated = true;
    }

    if (row < Game.puzzleHeight-1 && compareClue(clues[row][col], Game.FLAG_DOWN_EQ) &&
                cells[row][col] > 0 && cells[row+1][col] == 0) {
        cells[row+1][col] = cells[row][col];
    }
    else if (row < Game.puzzleHeight-1 && compareClue(clues[row][col], Game.FLAG_DOWN_NE) &&
                cells[row][col] > 0 && cells[row+1][col] == 0) {
        cells[row+1][col] = getOppositeColor(cells[row][col]);
    }
    else if (row >= 1 && compareClue(clues[row-1][col], Game.FLAG_DOWN_EQ)) {
        if (cells[row][col] == 0 && cells[row-1][col] > 0) {
            cells[row][col] = cells[row-1][col];
        }
        else if (cells[row][col] > 0 && cells[row-1][col] == 0) {
            cells[row-1][col] = cells[row][col];
        }
        else {
            // no update beyond equality clue done
            return updated;
        }
    }
    else if (row >= 1 && compareClue(clues[row-1][col], Game.FLAG_DOWN_NE)) {
        if (cells[row][col] == 0 && cells[row-1][col] != 0) {
            cells[row][col] = getOppositeColor(cells[row-1][col]);
        }
        else if (cells[row][col] != 0 && cells[row-1][col] == 0) {
            cells[row-1][col] = getOppositeColor(cells[row][col]);
        }
        else {
            // no update beyond equality clue done
            return updated;
        }
    }
    else {
        // no update beyond equality clue done
        return updated;
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

function checkCluesHorizontal(cells, clues, row, col) {
    updated = false;
    if (col >= 3 && cells[row][col] > 0 &&
                cells[row][col-1] == 0 && cells[row][col-2] == 0 &&
                compareClue(clues[row][col-2], Game.FLAG_RIGHT_EQ)) {
        cells[row][col-1] = getOppositeColor(cells[row][col]);
        cells[row][col-2] = getOppositeColor(cells[row][col]);
        updated = true;
    }
    else if (col < Game.puzzleWidth-3 && cells[row][col] > 0 &&
                cells[row][col+1] == 0 && cells[row][col+2] == 0 &&
                compareClue(clues[row][col+1], Game.FLAG_RIGHT_EQ)) {
        cells[row][col+1] = getOppositeColor(cells[row][col]);
        cells[row][col+2] = getOppositeColor(cells[row][col]);
        updated = true;
    }

    if (col < Game.puzzleWidth-1 && compareClue(clues[row][col], Game.FLAG_RIGHT_EQ) &&
                cells[row][col] > 0 && cells[row][col+1] == 0) {
        cells[row][col+1] = cells[row][col];
    }
    else if (col < Game.puzzleWidth-1 && compareClue(clues[row][col], Game.FLAG_RIGHT_NE) &&
                cells[row][col] > 0 && cells[row][col+1] == 0) {
        cells[row][col+1] = getOppositeColor(cells[row][col]);
    }
    else if (col >= 1 && compareClue(clues[row][col-1], Game.FLAG_RIGHT_EQ)) {
        if (cells[row][col] == 0 && cells[row][col-1] > 0) {
            cells[row][col] = cells[row][col-1];
        }
        else if (cells[row][col] > 0 && cells[row][col-1] == 0) {
            cells[row][col-1] = cells[row][col];
        }
        else {
            // no update beyond equality clue done
            return updated;
        }
    }
    else if (col >= 1 && compareClue(clues[row][col-1], Game.FLAG_RIGHT_NE)) {
        if (cells[row][col] == 0 && cells[row][col-1] != 0) {
            cells[row][col] = getOppositeColor(cells[row][col-1]);
        }
        else if (cells[row][col] != 0 && cells[row][col-1] == 0) {
            cells[row][col-1] = getOppositeColor(cells[row][col]);
        }
        else {
            // no update beyond equality clue done
            return updated;
        }
    }
    else {
        // no update beyond equality clue done
        return updated;
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

function verifyPermutationCorrectness(cells, clues, permutation) {
    counter = 0;
    lastColor = -1;
    permutationIndex = 0;
    for (let i = 0; i < cells.length; i++) {
        // find cell color, fill permutation values in empty cells
        cellColor = cells[i];
        if (cells[i] == 0) {
            cellColor = permutation[permutationIndex];
            permutationIndex++;
        }
        // more than 2 consecutive cells of same color?
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
        // verify comparison clues
        // TODO the corretness must be checked in the other direction as well - we need both row and column
        if (typeof clues[i] != "undefined") {
            // find next cell color, fill permutation values in empty cells
            nextCellColor = cells[i+1];
            if (cells[i+1] == 0) {
                nextCellColor = permutation[permutationIndex];
            }
            // verify both cells
            if ((compareClue(clues[i], Game.FLAG_DOWN_EQ) || compareClue(clues[i], Game.FLAG_RIGHT_EQ)) &&
                        cellColor != nextCellColor) {
                return false;
            }
            else if ((compareClue(clues[i], Game.FLAG_DOWN_NE) || compareClue(clues[i], Game.FLAG_RIGHT_NE)) &&
                        cellColor == nextCellColor) {
                return false;
            }
        }
    }
    return true;
}

function findCorrectPermutations(cells, clues, amountBlack, amountWhite, permutation, correctPermutations) {
    if (amountBlack == 0 && amountWhite == 0) {
        if (verifyPermutationCorrectness(cells, clues, permutation)) {
            // add a copy of the permutation
            correctPermutations.push(permutation.slice());
        }
    }

    // try black
    if (amountBlack > 0) {
        permutation.push(1);
        findCorrectPermutations(cells, clues, amountBlack-1, amountWhite, permutation, correctPermutations);
        permutation.pop();
    }
    // try white
    if (amountWhite > 0) {
        permutation.push(2);
        findCorrectPermutations(cells, clues, amountBlack, amountWhite-1, permutation, correctPermutations);
        permutation.pop();
    }
}

function checkRowVertical(cells, clues, col) {
    columnCells = [];
    columnClues = [];
    for (let row = 0; row < Game.puzzleHeight; row++) {
        columnCells.push(cells[row][col]);
        columnClues.push(clues[row][col] & (Game.FLAG_DOWN_EQ | Game.FLAG_DOWN_NE));
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
        findCorrectPermutations(columnCells, columnClues, colorCount[1], colorCount[2], [], correctPermutations);
        
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

function checkRowHorizontal(cells, clues, row) {
    rowCells = [];
    rowClues = [];
    for (let col = 0; col < Game.puzzleWidth; col++) {
        rowCells.push(cells[row][col]);
        rowClues.push(clues[row][col] & (Game.FLAG_RIGHT_EQ | Game.FLAG_RIGHT_NE));
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
        findCorrectPermutations(rowCells, rowClues, colorCount[1], colorCount[2], [], correctPermutations);
        
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

if (!Game.currentState.solved) {
    updated = true;
    while (updated) {
        updated = false;

        for (let row = 0; row < Game.puzzleHeight; row++) {
            for (let col = 0; col < Game.puzzleWidth; col++) {
                if (Game.currentState.cellStatus[row][col] == 0) {
                    updated |= checkCellVertical(Game.currentState.cellStatus, row, col);
                    updated |= checkCellHorizontal(Game.currentState.cellStatus, row, col);
                }
            }
            updated |= checkRowHorizontal(Game.currentState.cellStatus, Game.comparisonClues, row);
        }

        for (let col = 0; col < Game.puzzleWidth; col++) {
            updated |= checkRowVertical(Game.currentState.cellStatus, Game.comparisonClues, col);
        }

        for (let row = 0; row < Game.puzzleHeight; row++) {
            for (let col = 0; col < Game.puzzleWidth; col++) {
                updated |= checkCluesVertical(Game.currentState.cellStatus,
                                                       Game.comparisonClues, row, col);
                updated |= checkCluesHorizontal(Game.currentState.cellStatus,
                                                         Game.comparisonClues, row, col);
            }
        }
    }

    Game.drawCurrentState();
    
    Game.checkFinished();
}

