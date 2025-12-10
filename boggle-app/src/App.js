import Board from './Board.js';
import GuessInput from './GuessInput.js';
import FoundSolutions from './FoundSolutions.js';
import SummaryResults from './SummaryResults.js';
import ToggleGameState from './ToggleGameState.js';
import ChallengeList from './ChallengeList.js'; // NEW IMPORT
import logo from './logo.png';
import dice from './dice.jpg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { GAME_STATE } from './GameState.js';
import { db, auth, googleProvider } from './firebase'; // NEW FIREBASE IMPORTS
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'; // NEW AUTH IMPORTS
import { doc, updateDoc, getDoc } from 'firebase/firestore'; // NEW FIRESTORE IMPORTS

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function App() {
  const [allSolutions, setAllSolutions] = useState([]);
  const [foundSolutions, setFoundSolutions] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATE.BEFORE);
  const [grid, setGrid] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [size, setSize] = useState(3);
  const [game, setGame] = useState({}); // Still useful for general game state data
  
  // NEW STATES for Firebase and Challenges
  const [user, setUser] = useState(null); // Tracks signed-in user
  const [viewState, setViewState] = useState('MAIN'); // 'MAIN' or 'CHALLENGE_LIST'
  const [currentChallengeId, setCurrentChallengeId] = useState(null); // ID of the active challenge
  
  document.title = 'Bison Boggle!!';

  // ----------------------------------------------------------------------
  // FIREBASE AUTHENTICATION EFFECT (Google Sign-In)
  // ----------------------------------------------------------------------
  useEffect(() => {
    // Listens for sign-in/sign-out changes and updates the user state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("Auth state changed. Current User:", currentUser ? currentUser.displayName : 'None');
    });
    return () => unsubscribe(); // Cleanup subscription
  }, []);

  // Handlers for Google Sign-in/out
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      alert("Failed to sign in: " + error.message);
    }
  };
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-Out Error:", error.message);
    }
  };


  // ----------------------------------------------------------------------
  // CHALLENGE LOADING LOGIC (Replaces Django Fetch for Challenge Mode)
  // ----------------------------------------------------------------------
  const loadChallenge = (challenge) => {
    console.log("Loading challenge:", challenge.name);
    console.log("Raw grid from Firestore:", challenge.grid);
    
    // Convert the grid from Firestore format to proper 2D array
    // Firestore stores each row as a string like "['T', 'W', 'Y', 'R']"
    let properGrid = challenge.grid;
    
    // Check if grid items are strings and need parsing
    if (typeof challenge.grid[0] === 'string') {
      properGrid = challenge.grid.map(row => {
        // Remove brackets and quotes, then split by comma
        const cleanRow = row.replace(/[[\]'"\s]/g, '');
        return cleanRow.split(',');
      });
    }
    
    console.log("Parsed grid:", properGrid);
    
    // Set states directly from Firestore challenge data
    setGrid(properGrid);
    setAllSolutions(challenge.solutions);
    setSize(challenge.size);
    setCurrentChallengeId(challenge.id);
    
    // Reset game state and start
    setFoundSolutions([]);
    setTotalTime(0);
    setGameState(GAME_STATE.IN_PROGRESS);
    setViewState('MAIN');
  };

  // ----------------------------------------------------------------------
  // SCORING LOGIC (New useEffect to handle ENDED state and Leaderboard)
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (gameState === GAME_STATE.ENDED && currentChallengeId && user) {
        // Calculate the score (simply word count for now)
        const score = foundSolutions.length;
        
        // Function to update Firestore Leaderboard
        const updateLeaderboard = async () => {
            const challengeRef = doc(db, "challenges", currentChallengeId);
            const challengeSnap = await getDoc(challengeRef);
            
            if (challengeSnap.exists()) {
                const challengeData = challengeSnap.data();
                const currentHighScore = challengeData.high_score?.score || 0;

                // Check if the current score is higher than the recorded high score
                if (score > currentHighScore) {
                    console.log("New high score achieved! Submitting...");
                    await updateDoc(challengeRef, {
                        high_score: {
                            score: score,
                            username: user.displayName,
                            uid: user.uid,
                            time: totalTime,
                            date: new Date().toISOString()
                        }
                    });
                    alert(`New High Score of ${score} submitted!`);
                } else {
                    console.log("Score not a high score. Score:", score, "High Score:", currentHighScore);
                }
            }
        };

        // Only run for challenges and if a user is logged in
        updateLeaderboard().catch(console.error);

    }
  }, [gameState, currentChallengeId, user, foundSolutions, totalTime]);


  // ----------------------------------------------------------------------
  // ORIGINAL GAME START EFFECT (Modified to only run for generic start)
  // ----------------------------------------------------------------------
  useEffect(() => {
    // This is kept for the original 'Start Game' button (if you want it)
    if (gameState === GAME_STATE.IN_PROGRESS && !currentChallengeId) { 
        const url = "https://exileolivia-mileperfume-8000.codio.io/api/game/create/" + size;
        
        fetch(url)
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then((data) => {
            setGame(data);
            setGrid(data.grid); 
            setAllSolutions(data.foundwords); 
            setFoundSolutions([]);
            setTotalTime(0);
        })
        .catch((err) => {
            console.error("Fetch error:", err.message);
            alert("Failed to load game: " + err.message);
            setGameState(GAME_STATE.BEFORE); // Go back if fetch fails
        });
    }
  }, [gameState, size, currentChallengeId]);

  // ... (rest of helper functions: correctAnswerFound, timer useEffect) ...
  function correctAnswerFound(answer) {
  console.log("New correct answer:" + answer);
  setFoundSolutions(prevFound => [...prevFound, answer]);
  }

  // Add this useEffect for the timer
  useEffect(() => {
    let interval = null;
    
    if (gameState === GAME_STATE.IN_PROGRESS) {
      interval = setInterval(() => {
        setTotalTime(prevTime => prevTime + 1);
      }, 1000); // Update every second
    } else {
      clearInterval(interval);
    }
    
    // Cleanup function
    return () => clearInterval(interval);
  }, [gameState]);
  
  const Convert = (s) => {  // convert a string into an array of tokens that are strings
    s = s.replace(/'/g, '');
    s = s.replace('[', '');
    s = s.replace(']', '');
    const tokens = s.split(",") // Split the string into an array of tokens
    .map(token => token.trim()) // Trim each token
    .filter(token => token !== ''); // Remove empty tokens
    return tokens;
}
// useEffect will trigger when the array items in the second argument are
// updated so whenever grid is updated, we will recompute the solutions

useEffect(() => {
     if (typeof game.foundwords !== "undefined") {
        let tmpAllSolutions = Convert(game.foundwords);
        setAllSolutions(tmpAllSolutions);
        }
}, [grid, game.foundwords]);

  return (
    <div className="App">
    {/* New header with title */}
    <header className="app-header">
      <h1>Bison Boggle!!!</h1>
      <p>Find as many words as you can!</p>
    </header>

    {/* NEW AUTHENTICATION SECTION */}
    <div className="auth-status">
        {user ? (
          <>
            <p>Welcome, **{user.displayName}**! 🏆</p>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <button onClick={signInWithGoogle}>**Sign In with Google (Required for Leaderboard)**</button>
        )}
      </div>
      
    <div className="header-section">
      <img src={dice} className="dice-decoration dice-top-left" alt="dice" />
      <img src={dice} className="dice-decoration dice-top-right" alt="dice" />
      <img
        src={logo}
        className="logo"
        alt="Bison Boggle Logo"
      />
      <ToggleGameState
        gameState={gameState}
        setGameState={(state) => setGameState(state)} 
        setSize={(state) => setSize(state)}
        setTotalTime={(state) => setTotalTime(state)}
      />
    </div>

    {/* NEW CHALLENGE LIST VIEW */}
    {viewState === 'CHALLENGE_LIST' && (
        <ChallengeList 
            onLoadChallenge={loadChallenge} 
            onCancel={() => setViewState('MAIN')} 
        />
    )}

    {/* NEW LOAD CHALLENGE BUTTON */}
    {viewState === 'MAIN' && gameState === GAME_STATE.BEFORE && (
        <button className="load-challenge-btn" onClick={() => setViewState('CHALLENGE_LIST')}>
            **Load Challenge**
        </button>
    )}


    {/* MAIN GAME VIEW (Only visible in MAIN view state) */}
    {viewState === 'MAIN' && (
        <>
            { gameState === GAME_STATE.IN_PROGRESS &&
                <div>
                {/* Add timer here */}
                <div className="timer-display">
                    <h3>Time: {formatTime(totalTime)}</h3>
                </div>

                <Board board={grid} />

                <GuessInput allSolutions={allSolutions}
                            foundSolutions={foundSolutions}
                            correctAnswerCallback={(answer) => correctAnswerFound(answer)}/>
                <FoundSolutions headerText="Solutions you've found" words={foundSolutions} />
                </div>
            }
            { gameState === GAME_STATE.ENDED &&
                <div>
                <Board board={grid} />

                {/* Combined summary box */}
                <div className="summary-container">
                    {/* Summary showing total words found and time */}
                    <SummaryResults 
                    words={foundSolutions} 
                    totalTime={totalTime} 
                    allSolutions={allSolutions} 
                    />

                    {/* Found words list */}
                    <FoundSolutions
                    headerText="Words you found"
                    words={foundSolutions}
                    />
                </div>

                {/* Missed words list - separate */}
                <FoundSolutions
                    headerText="Missed Words"
                    words={allSolutions.filter(word => !foundSolutions.includes(word))}
                />
                </div>
            }
        </>
    )}
    </div>
  );
}

export default App;
