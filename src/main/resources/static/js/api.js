// API Client for interacting with Spring Boot Backend Scores REST API

const API_BASE = '/api/scores';

async function fetchTopScores() {
    try {
        const response = await fetch(API_BASE);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const scores = await response.json();
        return scores;
    } catch (error) {
        console.error('Failed to fetch high scores:', error);
        return [];
    }
}

async function submitScore(playerName, score) {
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                playerName: playerName.toUpperCase(),
                score: score
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.playerName || errorData.score || 'Failed to submit score');
        }

        const savedScore = await response.json();
        return { success: true, data: savedScore };
    } catch (error) {
        console.error('Failed to submit score:', error);
        return { success: false, error: error.message };
    }
}
