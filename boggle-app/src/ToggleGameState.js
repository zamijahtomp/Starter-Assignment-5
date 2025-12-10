import React, { useState } from 'react';
// import Button from "@material-ui/core/Button";
import { GAME_STATE } from './GameState.js';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import './ToggleGameState.css';

function ToggleGameState({ gameState, setGameState, size, setSize, setTotalTime }) {
  const [buttonText, setButtonText] = useState("Start a new game!");
  const [startTime, setStartTime] = useState(0);

  const updateGameState = () => {
    const now = Date.now();

    if (gameState === GAME_STATE.BEFORE || gameState === GAME_STATE.ENDED) {
      setStartTime(now);
      setGameState(GAME_STATE.IN_PROGRESS);
      setButtonText("End game");
    } else if (gameState === GAME_STATE.IN_PROGRESS) {
      const elapsed = (now - startTime) / 1000.0;
      setTotalTime(elapsed);
      setGameState(GAME_STATE.ENDED);
      setButtonText("Start a new game!");
    }
  };

  const handleChange = (event) => {
    setSize(event.target.value);
  };

  return (
    <div className="Toggle-game-state">
      <button
        className={gameState === GAME_STATE.IN_PROGRESS ? "end-game-btn" : "start-game-btn"}
        onClick={updateGameState}
      >
        {buttonText}
      </button>

      {(gameState === GAME_STATE.BEFORE || gameState === GAME_STATE.ENDED) && (
        <div className="Input-select-size">
          <FormControl>
            <Select value={size} onChange={handleChange}>
              {[3,4,5,6,7,8,9,10].map((num) => (
                <MenuItem key={num} value={num}>{num}</MenuItem>
              ))}
            </Select>
            <FormHelperText>Set Grid Size</FormHelperText>
          </FormControl>
        </div>
      )}
    </div>
  );
}

export default ToggleGameState;
