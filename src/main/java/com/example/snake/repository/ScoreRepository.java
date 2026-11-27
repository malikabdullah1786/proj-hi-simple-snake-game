package com.example.snake.repository;

import com.example.snake.model.HighScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreRepository extends JpaRepository<HighScore, Long> {
    List<HighScore> findTop10ByOrderByScoreDescCreatedAtAsc();
}
