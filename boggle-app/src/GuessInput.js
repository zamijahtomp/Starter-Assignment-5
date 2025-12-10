import React, { useState } from 'react';
import './GuessInput.css';

function GuessInput({ allSolutions, foundSolutions, correctAnswerCallback }) {
  const [labelText, setLabelText] = useState("Make your first guess!");
  const [input, setInput] = useState("");

  function evaluateInput() {
    const guess = input.trim().toLowerCase(); // normalize casing and trim spaces

    if (!guess) {
      setLabelText("Please enter a word!");
      return;
    }

    if (foundSolutions.map(w => w.toLowerCase()).includes(guess)) {
      setLabelText(`${guess.toUpperCase()} has already been found!`);
    } else if (allSolutions.map(w => w.toLowerCase()).includes(guess)) {
      correctAnswerCallback(guess.toUpperCase());
      setLabelText(`${guess.toUpperCase()} is correct!`);
    } else {
      setLabelText(`${guess.toUpperCase()} is incorrect!`);
    }
  }

  function keyPress(e) {
    if (e.key === 'Enter') {
      evaluateInput();
      setInput(""); // clear after checking
    }
  }

  return (
    <div className="Guess-input">
      <div>{labelText}</div>
      <input
        type="text"
        value={input}
        placeholder="Type a word..."
        onKeyPress={keyPress}
        onChange={(event) => setInput(event.target.value)}
      />
    </div>
  );
}

export default GuessInput;
