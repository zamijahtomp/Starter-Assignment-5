import React from 'react';
import './SummaryResults.css';

function SummaryResults({ words, totalTime, allSolutions }) {
  const totalFound = words.length;                  // words player found
  const totalPossible = allSolutions.length || 0;   // total possible words
  const totalMissed = totalPossible - totalFound;   // calculate missed words

  return (
    <div className="Summary">
      <h2>SUMMARY</h2>
      <ul>
        <li><strong>Total Words Found:</strong> {totalFound}</li>
        <li><strong>Total Words Missed:</strong> {totalMissed}</li>
        <li><strong>Total Time:</strong> {totalTime.toFixed(2)} secs</li>
      </ul>
    </div>
  );
}

export default SummaryResults;
