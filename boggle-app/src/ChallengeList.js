// src/ChallengeList.js

import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Import the initialized Firestore database
import { collection, getDocs } from 'firebase/firestore'; 

// ChallengeList component will be displayed when the user wants to load a new game
function ChallengeList({ onLoadChallenge, onCancel }) {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                // Fetch all documents from the 'challenges' collection
                const querySnapshot = await getDocs(collection(db, "challenges"));
                
                const challengeData = [];
                querySnapshot.forEach((doc) => {
                    // Extract data, including the document ID (cid)
                    challengeData.push({ id: doc.id, ...doc.data() });
                });
                
                setChallenges(challengeData);
            } catch (error) {
                console.error("Error fetching challenges: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, []);

    if (loading) {
        return <p>Loading available challenges...</p>;
    }

    return (
        <div className="challenge-list-container">
            <h3>Available Challenges:</h3>
            <button onClick={onCancel}>Back to Start</button>
            
            {challenges.map((challenge) => (
                <div key={challenge.id} className="challenge-item">
                    <h4>{challenge.name} ({challenge.size}x{challenge.size})</h4>
                    
                    {/* Display current high score (Leaderboard Functionality) */}
                    <p>High Score: {challenge.high_score?.score || 'N/A'}</p>
                    <p>By: {challenge.high_score?.username || 'None'}</p>
                    
                    {/* Button calls the function in App.js to load the grid */}
                    <button onClick={() => onLoadChallenge(challenge)}>
                        Start Challenge
                    </button>
                </div>
            ))}
        </div>
    );
}

export default ChallengeList;
