import React from 'react';
import './AlphabetFilter.css';  // Make sure this path is correct

function AlphabetFilter({ selectedLetter, onSelectLetter }) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="alphabet-filter text-center mb-3">
      {letters.map(letter => (
        <button
          key={letter}
          className={`alphabet-letter ${selectedLetter === letter ? 'active' : ''}`}
          onClick={() => onSelectLetter(letter)}
        >
          {letter}
        </button>
      ))}
      <button className="clear-button" onClick={() => onSelectLetter('')}>Clear</button>
    </div>
  );
}

export default AlphabetFilter;
