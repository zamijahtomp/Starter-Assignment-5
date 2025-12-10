import React from 'react';
import './FoundSolutions.css';

function FoundSolutions({ words, headerText}) {

  return (
    <div className="Found-solutions-list">
    
      {words.length > 0 &&
        <h4>{headerText}: {words.length}</h4>
      }
      <div className="words-grid">
        {words.map((solution) => {
          return <div key={solution} className="word-item">{solution}</div>
        })}
      </div>
    </div>
  );
}
export default FoundSolutions;
