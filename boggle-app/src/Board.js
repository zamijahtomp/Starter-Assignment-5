import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import React from 'react';
import './Board.css';

function Board({board}) { // This is the main functional component

  // Helper 1: Renders a single tile (letter)
  function tile(id, letter) {
    return(
      <Grid key={id} item xs={1} className="Tile">
        <Paper elevation={4}>
         {letter}
        </Paper>
      </Grid>);
  }

  // Helper 2: Renders a row of tiles
  function rowOfTiles(rowArray, rowIndex) {
    // Safety check for inner array (optional, but robust)
    if (!Array.isArray(rowArray)) return null; 

    return (
      <Grid key={rowIndex} container spacing={1} justify="space-around"> 
        {/* Map directly over the array of letters */}
        {rowArray.map((letter, letterIndex) => { 
          // Use a unique key combining row and letter index
          return tile(`${rowIndex}-${letterIndex}`, letter) 
        })}
      </Grid>);
  }

  // Helper 3: Renders the entire grid of rows
  function gridOfRows(board) {
    // Primary check to ensure the input is an array
    if (!Array.isArray(board)) {
        return null; 
    }
    
    return (
      <Grid item xs={12}>
        {/* Map over the outer array (rows) */}
        {board.map((rowArray, rowIndex) => {
          return rowOfTiles(rowArray, rowIndex)
        })}
      </Grid>);
  }

  // Main render logic for the Board component
  return (
    <div className="Board-div">
      <Grid container justify="center">
        {/* Simplified conditional rendering: checks if the board array is present and non-empty */}
        {board && board.length > 0
          ? gridOfRows(board)
          : <p>Loading board...</p>
        }
      </Grid>
    </div>
  );
}

export default Board;
