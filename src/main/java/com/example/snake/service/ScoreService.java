package com.example.snake.service;

import com.example.snake.model.HighScore;
import com.example.snake.repository.ScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ScoreService {

    private final ScoreRepository scoreRepository;

    @Autowired
    public ScoreService(ScoreRepository scoreRepository) {
        this.scoreRepository = scoreRepository;
    }

    @Transactional(readOnly = true)
    public List<HighScore> getTopScores() {
        return scoreRepository.findTop10ByOrderByScoreDescCreatedAtAsc();
    }

    @Transactional
    public HighScore saveScore(HighScore highScore) {
        // Additional business validation if needed
        if (highScore.getPlayerName() != null) {
            highScore.setPlayerName(highScore.getPlayerName().toUpperCase());
        }
        return scoreRepository.save(highScore);
    }
}
